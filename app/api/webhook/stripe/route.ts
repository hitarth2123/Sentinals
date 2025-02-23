// import { NextResponse } from 'next/server'
// import { createOrder } from '@/lib/actions/order.actions'

// export async function POST(request: Request) {
//   try {
//     const { sessionId, eventId, buyerId, amount } = await request.json()

//     // Create order with payment details
//     const order = {
//       stripeId: sessionId,
//       eventId: eventId,
//       buyerId: buyerId,
//       totalAmount: amount.toString(),
//       createdAt: new Date(),
//     }

//     const newOrder = await createOrder(order)
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Payment successful', 
//       order: newOrder 
//     })

//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Error processing payment', 
//       error: error 
//     }, { status: 500 })
//   }
// }
