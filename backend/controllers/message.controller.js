import User from "../models/users.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";
import mongoose from "mongoose";

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     const filteredUsers = await User.find({
//       _id: { $ne: loggedInUserId },
//     }).select("-password");
//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.log("Error in getUsersForSidebar controller", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// export const getUsersForSidebar = async (req, res) => {
// 	try {
// 		const loggedInUserId = req.user._id;

// 		// Find all messages involving the current user
// 		const conversations = await Message.find({
// 			$or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
// 		}).select("senderId receiverId");

// 		// Get the unique IDs of the other users in these conversations
// 		const otherUserIds = conversations.reduce((acc, conv) => {
// 			if (conv.senderId.toString() !== loggedInUserId.toString()) {
// 				acc.add(conv.senderId.toString());
// 			}
// 			if (conv.receiverId.toString() !== loggedInUserId.toString()) {
// 				acc.add(conv.receiverId.toString());
// 			}
// 			return acc;
// 		}, new Set());

//         const uniqueOtherUserIds = Array.from(otherUserIds);

// 		// If there are no existing conversations, return an empty array
// 		if (uniqueOtherUserIds.length === 0) {
// 			return res.status(200).json([]);
// 		}

// 		// Find the user documents for these unique IDs
// 		const users = await User.find({
// 			_id: { $in: uniqueOtherUserIds },
// 		}).select("-password");

// 		res.status(200).json(users);
// 	} catch (error) {
// 		console.log("Error in getUsersForSidebar controller", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

//working
// export const getUsersForSidebar = async (req, res) => {
// 	try {
// 		const loggedInUserId = req.user._id;

// 		const conversations = await Message.aggregate([
// 			// 1. Find all messages involving the current user
// 			{
// 				$match: {
// 					$or: [
// 						{ senderId: new mongoose.Types.ObjectId(loggedInUserId) },
// 						{ receiverId: new mongoose.Types.ObjectId(loggedInUserId) },
// 					],
// 				},
// 			},
// 			// 2. Sort messages to find the most recent one for each conversation
// 			{
// 				$sort: { createdAt: -1 },
// 			},
// 			// 3. Group messages by the other user (the conversation partner)
// 			{
// 				$group: {
// 					_id: {
// 						$cond: {
// 							if: { $eq: ["$senderId", loggedInUserId] },
// 							then: "$receiverId",
// 							else: "$senderId",
// 						},
// 					},
// 					lastMessage: { $first: "$$ROOT" }, // Get the entire last message
// 				},
// 			},
// 			// 4. Sort the conversations themselves by the last message's date
// 			{
// 				$sort: { "lastMessage.createdAt": -1 },
// 			},
// 			// 5. Look up the user details for each conversation partner
// 			{
// 				$lookup: {
// 					from: "users", // The name of your users collection
// 					localField: "_id",
// 					foreignField: "_id",
// 					as: "userDetails",
// 				},
// 			},
// 			// 6. Clean up the output to match what the frontend expects
// 			{
// 				$unwind: "$userDetails",
// 			},
// 			{
// 				$project: {
// 					_id: "$userDetails._id",
// 					fullName: "$userDetails.fullName",
// 					profilePic: "$userDetails.profilePic",
// 				},
// 			},
// 		]);

// 		res.status(200).json(conversations);
// 	} catch (error) {
// 		console.log("Error in getUsersForSidebar controller", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

//to show latest message in sidebar userchat container
export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const conversations = await Message.aggregate([
			// Find all messages involving the current user
			{ $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
			// Sort messages by creation date
			{ $sort: { createdAt: -1 } },
			// Group by conversation to get the last message for each
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ["$senderId", loggedInUserId] },
							then: "$receiverId",
							else: "$senderId",
						},
					},
					lastMessage: { $first: "$$ROOT" },
				},
			},
			// Populate the user details for each conversation partner
			{
				$lookup: {
					from: "users", // IMPORTANT: This must be the plural, lowercase name of your User collection in MongoDB
					localField: "_id",
					foreignField: "_id",
					as: "userDetails",
				},
			},
			{ $unwind: "$userDetails" },
			// Final projection to shape the output
			{
				$project: {
					_id: "$userDetails._id",
					fullName: "$userDetails.fullName",
					profilePic: "$userDetails.profilePic",
					lastMessage: {
						text: "$lastMessage.text",
						images: "$lastMessage.images",
						createdAt: "$lastMessage.createdAt",
					},
				},
			},
			// Sort conversations by the last message time
			{ $sort: { "lastMessage.createdAt": -1 } },
		]);

		res.status(200).json(conversations);
	} catch (error) {
		console.log("Error in getUsersForSidebar controller", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, images } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    let imageUrls = [];
    // FIX: Handle multiple image uploads
    if (images && images.length > 0) {
      // Use Promise.all to upload all images in parallel
      const uploadPromises = images.map((base64Image) => {
        return cloudinary.uploader.upload(base64Image);
      });

      const uploadResponses = await Promise.all(uploadPromises);
      imageUrls = uploadResponses.map((response) => response.secure_url);
    }

    // if (images) {
    //   //upload base64 image to cloudinary
    //   const imageuploadResponse = cloudinary.uploader.upload(image);
    //   imageUrl = await imageuploadResponse.secure_url;
    // }

    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      images: imageUrls,
    });
    await newMessage.save();

    //todo: realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }



    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
