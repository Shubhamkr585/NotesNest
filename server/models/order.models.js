import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId:
   {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: true
     },
  noteId: 
  { type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true 
    },
  totalAmount:
   { 
    type: Number,
    required: true
  },
  paymentStatus: 
  {
     type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending' 
   },
  razorpayOrderId:
   {
     type: String
 }
},
 {
    timestamps:true,
 }
);

export default Order=mongoose.model("Order",orderSchema)

