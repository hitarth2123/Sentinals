import { Resend } from 'resend';
import QRCode from 'qrcode';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export type EmailTicketProps = {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketId: string;
};

export async function sendEventTicketEmail({
  userEmail,
  userName,
  eventTitle,
  eventDate,
  eventLocation,
  ticketId,
}: EmailTicketProps) {
  try {
    // Generate QR code
    const qrCodeData = {
      ticketId,
      eventTitle,
      userName,
      eventDate,
    };
    
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrCodeData));

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Event Ticket - ${eventTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .ticket { border: 2px solid #ddd; padding: 20px; border-radius: 8px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .qr-code img { max-width: 200px; }
            .event-details { margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Event Ticket</h1>
            </div>
            <div class="ticket">
              <h2>Hello ${userName}!</h2>
              <p>Thank you for booking your ticket to ${eventTitle}. We're excited to have you!</p>
              
              <div class="event-details">
                <h3>Event Details:</h3>
                <p><strong>Event:</strong> ${eventTitle}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Location:</strong> ${eventLocation}</p>
                <p><strong>Ticket ID:</strong> ${ticketId}</p>
              </div>

              <div class="qr-code">
                <h3>Your Entry QR Code</h3>
                <img src="${qrCodeImage}" alt="Ticket QR Code">
                <p>Please present this QR code at the event entrance</p>
              </div>

              <p>Important Notes:</p>
              <ul>
                <li>Please arrive at least 15 minutes before the event starts</li>
                <li>Keep this ticket handy on your phone</li>
                <li>This QR code is unique to you and cannot be reused</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact the event organizer.</p>
              <p>  Socialites. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Socialites <events@socialites.com>',
      to: [userEmail],
      subject: `Your Ticket for ${eventTitle}`,
      html: emailHtml,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending ticket email:', error);
    throw error;
  }
}
