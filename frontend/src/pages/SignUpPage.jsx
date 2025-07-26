import React, { useState } from "react";
import ShaderBackground from "../components/lightswind/shader-background.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const toastId = 'validation-toast';

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required",{ id: toastId });
    if (!formData.email.trim()) return toast.error("Email is required",{ id: toastId });
    if (!/\S+@\S+\.\S+/.test(formData.email)){

      return toast.error("Invalid email format",{ id: toastId });
    }
    if (!formData.password) return toast.error("Password is required",{ id: toastId });
    if (formData.password.length < 6){
      
      return toast.error("Password must be at least 6 characters",{ id: toastId });
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signUp(formData);
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      <ShaderBackground
        backdropBlurAmount="md"
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 p-8 rounded-lg shadow-xl bg-opacity-10 backdrop-blur-3xl border border-gray-700 max-w-md w-full mx-4 sm:mx-0">
        <h2 className="text-3xl font-bold mb-4 text-blue">Sign Up</h2>

        {/* Signup Form */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User
                  color="#06b4b0"
                  className="size-5 text-base-content/40 z-10"
                />
              </div>
              <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail
                  color="#06b4b0"
                  className="size-5 text-base-content/40 z-10"
                />
              </div>
              <input
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  color="#06b4b0"
                  className="size-5 text-base-content/40 z-10"
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff
                    color="#06b4b0"
                    className="size-5 text-base-content/40 z-10"
                  />
                ) : (
                  <Eye className="size-5 text-base-content/40 z-10" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          {/* <button
            type="submit"
            className="btn btn-ghost hover:bg-[#06b4b0] w-full"
            // className='btn bg-[#07deda] hover:bg-[#06b4b0] text-black font-bold w-full mt-6 border-none'
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button> */}

          {/* First animated button */}
          <button
            type="submit"
            className="
							relative btn btn-ghost w-full mt-6 overflow-hidden
							border-2 border-[#07deda] text-[#fff]
							hover:text-black hover:border-transparent
							transition-all duration-300 ease-in-out
							group disabled:opacity-50 disabled:cursor-not-allowed
						"
            disabled={isSigningUp}
          >
            {/* Sliding background element */}
            <span
              className="
								absolute left-0 top-0 h-full w-full bg-[#06b4b0]
								transform -translate-x-full
								transition-transform duration-300 ease-in-out
								group-hover:translate-x-0
							"
            ></span>

            {/* Button Text and Icon, kept relative to stay on top */}
            <span className="relative flex items-center justify-center">
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </span>
          </button>
        </form>
        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
