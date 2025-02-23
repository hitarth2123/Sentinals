import { Schema, model, models, Document } from "mongoose";

export interface IRSVP extends Document {
  _id: string;
  event: {
    _id: string;
    title: string;
    description: string;
  };
  user: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: Date;
}

const RSVPSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: { // Fixed field name from 'users' to 'user' to match interface
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a compound index to prevent duplicate RSVPs
RSVPSchema.index({ event: 1, user: 1 }, { unique: true });

const RSVP = models.RSVP || model('RSVP', RSVPSchema);

export default RSVP;