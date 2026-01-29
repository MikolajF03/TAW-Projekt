import { Schema, model } from 'mongoose';
import { IData } from "../models/data.model";

export const DataSchema: Schema = new Schema({
   title: { type: String, required: true },
   text: { type: String, required: true },
   image: { type: String, required: true },
   likes: { type: [String], default: [] },
   authorId: { 
      type: String, 
      required: true
   },
   createdAt: { 
      type: Date, 
      default: Date.now
   }
});

export default model('Post-KO', DataSchema);