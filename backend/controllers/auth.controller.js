import { generateToken } from "../lib/utils.js";
import User from "../models/users.model.js";

//To hash the password
import bcrypt from "bcryptjs";

//To manage and handle multimedia
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName && !email && !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!fullName && !email) {
      return res
        .status(400)
        .json({ message: "Your fullname and email is required" });
    }

    if (!email && !password) {
      return res
        .status(400)
        .json({ message: "Your email and password is required" });
    }

    if (!fullName && !password) {
      return res
        .status(400)
        .json({ message: "Your fullname and password is required" });
    }

    if (!fullName) {
      return res.status(400).json({ message: "Your fullname is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Your email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Your password is required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be greater than 6 characters." });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate new token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Error in signup Controller ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const userFullname = req.user.fullName;
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(200)
      .json({ message: `${userFullname} logged out successfully` });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    //This req.user comes from auth.middleware.js line 22. We set req.user = user with token
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: "Profile picture is required" });
    }

    const profilePicResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUserProfilePic = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUserProfilePic);
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userFullname = req.user.fullName;
    const userId = req.user._id;
    // 1. Delete the user's account
    await User.findByIdAndDelete(userId);
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(200)
      .json({ message: `${userFullname} Account removed successfully` });
  } catch (error) {
    console.log("Error in delete profile controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
