# Socialites 🎉

A modern event management and RSVP platform built with Next.js 14, featuring QR code-based check-ins, user authentication, and real-time event tracking.

## 🚀 Features

- **User Authentication** - Secure authentication powered by Clerk
- **Event Management** - Create, edit, and manage events
- **QR Code Integration** - Generate and scan QR codes for event check-ins
- **RSVP System** - Handle event registrations and attendance tracking
- **Responsive Design** - Built with Tailwind CSS for a modern, mobile-first experience
- **Email Notifications** - Automated emails using Resend
- **Payment Integration** - Secure payments with Stripe
- **File Uploads** - Powered by UploadThing

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **UI Components**: Radix UI
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe
- **Email**: Resend
- **File Upload**: UploadThing

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/socialites.git
cd socialites
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MongoDB
MONGODB_URI=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📝 Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable UI components
- `/lib` - Utility functions, database models, and actions
- `/public` - Static assets
- `/types` - TypeScript type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

