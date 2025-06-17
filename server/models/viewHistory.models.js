import mongoose from "mongoose";

const viewHistorySchema = new mongoose.Schema({

  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true
     },
  noteId: {
     type: nodes.Schema.Types.ObjectId,
      ref: 'Note',
       required: true 
    },
  viewCount:
   { 
    type:  Number,
     default: 1
     },

  lastViewedAt:
   {
     type: Date,
      default: Date.now
     },
});

export default viewHistory=mongoose.model("viewHistory",viewHistorySchema)