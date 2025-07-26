import User from "../models/users.model.js";

// This new controller function finds a single user by their email address.
export const findUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const loggedInUserId = req.user._id;

        // Find the user but exclude their password from the result
        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found with that email." });
        }

        // Prevent users from trying to add themselves
        if (user._id.toString() === loggedInUserId.toString()) {
            return res.status(400).json({ message: "You cannot start a conversation with yourself." });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log("Error in findUserByEmail controller", error.message);
		res.status(500).json({ message: "Internal server error" });
    }
}
