import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },

    // image:{
    //     type:String,
    // },
    // FIX: Changed 'image' to 'images' and the type to an array of strings
    images: {
      type: [String], // This now accepts an array of image URLs
      default: [], // It's good practice to set a default empty array
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
