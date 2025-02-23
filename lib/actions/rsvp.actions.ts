"use server"

import { clerkClient } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../database'
import RSVP from '../database/models/rsvp.model'
import Event from '../database/models/event.model'
import User from '../database/models/user.model'
import { handleError } from '../utils'

// Create RSVP
export async function createRSVP({
  eventId,
  userId,
  path
}: {
  eventId: string
  userId: string
  path: string
}) {
  try {
    await connectToDatabase()

    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId)
    if (!clerkUser) throw new Error('User not found')

    // Get event details
    const event = await Event.findById(eventId)
    if (!event) throw new Error('Event not found')

    // Get or create user in our database
    let user = await User.findOne({ clerkId: userId })
    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.username || `${clerkUser.firstName}${clerkUser.lastName}`,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        photo: clerkUser.imageUrl,
        phoneno: parseInt(clerkUser.phoneNumbers[0]?.phoneNumber || '0000000000')
      })
    }

    // Check if RSVP already exists
    const existingRSVP = await RSVP.findOne({
      event: eventId,
      user: user._id
    })

    if (existingRSVP) {
      throw new Error('You have already RSVP\'d to this event')
    }

    // Create RSVP
    const newRSVP = await RSVP.create({
      event: eventId,
      user: user._id
    })

    // Populate the RSVP with event and user details
    const populatedRSVP = await RSVP.findById(newRSVP._id)
      .populate({
        path: 'event',
        model: Event,
        select: '_id title description startDateTime location'
      })
      .populate({
        path: 'user',
        model: User,
        select: '_id username email firstName lastName'
      })

    // Send confirmation email with QR code
    const { sendEventTicketEmail } = await import('@/lib/services/email.service')
    await sendEventTicketEmail({
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      eventTitle: event.title,
      eventDate: new Date(event.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      eventLocation: event.location,
      ticketId: newRSVP._id.toString()
    })

    revalidatePath(path)

    return JSON.parse(JSON.stringify(populatedRSVP))
  } catch (error) {
    handleError(error)
  }
}

// Get RSVPs by Event
export async function getRSVPsByEvent(eventId: string) {
  try {
    await connectToDatabase()

    const rsvps = await RSVP.find({ event: eventId })
      .populate({
        path: 'user',
        model: User,
        select: '_id username email'
      })
      .populate({
        path: 'event',
        model: Event,
        select: '_id title description'
      })

    return JSON.parse(JSON.stringify(rsvps))
  } catch (error) {
    handleError(error)
  }
}

// Get RSVPs by User
export async function getRSVPsByUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user by clerk ID
    const user = await User.findOne({ clerkId })
    if (!user) throw new Error('User not found')

    const rsvps = await RSVP.find({ user: user._id })
      .populate({
        path: 'event',
        model: Event,
        select: '_id title description'
      })
      .populate({
        path: 'user',
        model: User,
        select: '_id username email'
      })

    return JSON.parse(JSON.stringify(rsvps))
  } catch (error) {
    handleError(error)
  }
}

// Delete RSVP
export async function deleteRSVP({
  rsvpId,
  path
}: {
  rsvpId: string
  path: string
}) {
  try {
    await connectToDatabase()

    const deletedRSVP = await RSVP.findByIdAndDelete(rsvpId)
    if (!deletedRSVP) throw new Error('RSVP not found')

    revalidatePath(path)

    return JSON.parse(JSON.stringify(deletedRSVP))
  } catch (error) {
    handleError(error)
  }
}