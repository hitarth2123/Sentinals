import React, { useEffect, useState } from 'react'
// import { loadStripe } from '@stripe/stripe-js';

import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { createRSVP } from '@/lib/actions/rsvp.actions';

// loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  const [buttonText, setButtonText] = useState(event.isFree ? 'Get Ticket' : 'Buy Ticket');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log("Order canceled -- continue to shop around and checkout when you're ready.");
    }
  }, []);

  const onCheckout = async () => {
    try {
      // Directly confirm seat for free events
      if (event.isFree) {
        setButtonText('Got the Seat');
      } else {
        // Change button text to "Waiting List" when clicked
        setButtonText('Waiting List');
        // Simulate order processing for paid events
        setButtonText('Seat Secured');
      }
      // Call the RSVP action to store data in MongoDB
      await createRSVP(event._id, userId);
    } catch (error) {
      console.error('Failed to create RSVP:', error);
      setButtonText('Failed to Reserve');
    }
  }

  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {buttonText}
      </Button>
    </form>
  )
}

export default Checkout