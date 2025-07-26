// import React, { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Camera, Mail, User, Loader2 } from "lucide-react";
// import Lottie from "lottie-react";
// import ProfileIcon from "../animations/ProfileIcon.json";
// import toast from "react-hot-toast";

// const ProfilePage = () => {
//   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
//   const [selectedImg, setSelectedImg] = useState(null);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Optional: Add a file size check
//     if (file.size > 5 * 1024 * 1024) {
//       // 2MB limit
//       return toast.error(
//         "File is too large. Please select an image under 5MB."
//       );
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Image = reader.result;
//       setSelectedImg(base64Image);
//       await updateProfile({ profilePic: base64Image });
//     };

//     reader.onerror = () => {
//       toast.error("Failed to read file.");
//     };
//   };

//   const hasProfileImage = selectedImg || authUser?.profilePic;

//   return (
//     <div className="min-h-screen flex items-center justify-center pt-24 pb-8 px-4">
//       <div className="max-w-2xl w-full mx-auto p-6 sm:p-8 bg-black/20 backdrop-blur-2xl border border-gray-500/30 rounded-2xl shadow-xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white">Your Profile</h1>
//           <p className="mt-2 text-gray-400">Manage your account information</p>
//         </div>

//         {/* Avatar Upload Section */}
//         <div className="flex flex-col items-center gap-4 mb-8">
//           <div className="relative w-32 h-32">
//             {hasProfileImage ? (
//               <img
//                 src={selectedImg || authUser.profilePic}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
//               />
//             ) : (
//               <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-600">
//                 <Lottie
//                   animationData={ProfileIcon}
//                   loop={true}
//                   style={{ height: "100px", width: "100px" }}
//                 />
//               </div>
//             )}
//             <label
//               htmlFor="avatar-upload"
//               className={`
//                                 absolute bottom-0 right-0
//                                 bg-[#07deda] hover:scale-110
//                                 p-2 rounded-full cursor-pointer
//                                 transition-all duration-200
//                                 ${
//                                   isUpdatingProfile ? "pointer-events-none" : ""
//                                 }
//                             `}
//             >
//               {isUpdatingProfile ? (
//                 <Loader2 className="w-5 h-5 text-black animate-spin" />
//               ) : (
//                 <Camera className="w-5 h-5 text-black" />
//               )}
//               <input
//                 type="file"
//                 id="avatar-upload"
//                 className="hidden"
//                 accept="image/png, image/jpeg"
//                 onChange={handleImageUpload}
//                 disabled={isUpdatingProfile}
//               />
//             </label>
//           </div>
//           <p className="text-sm text-gray-400 mt-2">
//             {isUpdatingProfile
//               ? "Updating photo..."
//               : "Click the camera to upload a new photo"}
//           </p>
//         </div>

//         {/* User Information Section */}
//         <div className="space-y-6">
//           <div className="space-y-1.5">
//             <div className="text-sm text-gray-400 flex items-center gap-2">
//               <User className="w-4 h-4" />
//               <span>Full Name</span>
//             </div>
//             <p className="px-4 py-2.5 bg-gray-900/50 rounded-lg border border-gray-700 text-white">
//               {authUser?.fullName}
//             </p>
//           </div>

//           <div className="space-y-1.5">
//             <div className="text-sm text-gray-400 flex items-center gap-2">
//               <Mail className="w-4 h-4" />
//               <span>Email Address</span>
//             </div>
//             <p className="px-4 py-2.5 bg-gray-900/50 rounded-lg border border-gray-700 text-white">
//               {authUser?.email}
//             </p>
//           </div>
//         </div>

//         {/* Account Information Section */}
//         <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-gray-700">
//           <h2 className="text-lg font-medium text-white mb-4">
//             Account Details
//           </h2>
//           <div className="space-y-3 text-sm">
//             <div className="flex items-center justify-between py-2 border-b border-gray-700 text-gray-300">
//               <span>Member Since</span>
//               <span className="font-mono">
//                 {new Date(authUser?.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//             <div className="flex items-center justify-between py-2 text-gray-300">
//               <span>Account Status</span>
//               <span className="text-green-400 font-semibold">Active</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProfilePage;

import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Loader2 } from "lucide-react";
import Lottie from "lottie-react";
import ProfileIcon from "../animations/ProfileIcon.json";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return toast.error(
        "File is too large. Please select an image under 5MB."
      );
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };

    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
  };

  const hasProfileImage = selectedImg || authUser?.profilePic;

  return (
    <div className="min-h-screen flex items-center justify-center  pb-8 px-4">
      {/* The main container now uses theme-aware classes */}
      <div className="max-w-2xl w-full mx-auto p-6 sm:p-8 bg-base-100 border border-base-300 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-base-content">Your Profile</h1>
          <p className="mt-2 text-base-content/70">
            Manage your account information
          </p>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative w-32 h-32">
            {hasProfileImage ? (
              <img
                src={selectedImg || authUser.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-base-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-base-200 flex items-center justify-center border-4 border-base-300">
                <Lottie
                  animationData={ProfileIcon}
                  loop={true}
                  style={{ height: "100px", width: "100px" }}
                />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className={`
                                absolute bottom-0 right-0 
                                bg-primary hover:scale-110
                                p-2 rounded-full cursor-pointer 
                                transition-all duration-200
                                ${
                                  isUpdatingProfile ? "pointer-events-none" : ""
                                }
                            `}
            >
              {isUpdatingProfile ? (
                <Loader2 className="w-5 h-5 text-primary-content animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-primary-content" />
              )}
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-base-content/70 mt-2">
            {isUpdatingProfile
              ? "Updating photo..."
              : "Click the camera to upload a new photo"}
          </p>
        </div>

        {/* User Information Section */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-base-content/70 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 text-base-content">
              {authUser?.fullName}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-base-content/70 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 text-base-content">
              {authUser?.email}
            </p>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="mt-8 bg-base-200 rounded-xl p-6 border border-base-300">
          <h2 className="text-lg font-medium text-base-content mb-4">
            Account Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-base-300 text-base-content/80">
              <span>Member Since</span>
              <span className="font-mono">
                {new Date(authUser?.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-base-content/80">
              <span>Account Status</span>
              <span className="text-success font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
