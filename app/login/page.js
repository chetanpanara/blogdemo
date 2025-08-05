"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ModernSignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [loginerrors, setloginErrors] = useState("");

  const router = useRouter();
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log(formData);
    try {
      setIsLoading(true);
      const response = await axios.post("/api/login", formData);
      if (response.data.status == 200) {
        window.location.reload();
        router.push("/admin");
      } else if(response.data.status == 401) {
        setloginErrors(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  return (
    <>
      <div className="max-w-md mx-auto px-4 py-8 mt-16">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm p-3">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="relative mt-4 text-2xl font-bold from-gray-900 via-green-700 to-emerald-500 bg-clip-text text-transparent bg-gradient-to-r mb-2">
              Admin Login
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-green-300"
                viewBox="0 0 100 10"
                fill="currentColor"
              >
                <path d="M0,8 Q50,0 100,8 L100,10 L0,10 Z" />
              </svg>
            </h1>
            <p className="text-gray-600">
             Only Admin can access this panel!</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === "email"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50/50 border-1 rounded-xl focus:bg-white focus:outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : focusedField === "email"
                      ? "border-green-500 shadow-md shadow-green-500/20"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="Enter your email address"
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50/50 border-1 rounded-xl focus:bg-white focus:outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : focusedField === "password"
                      ? "border-green-500 shadow-md shadow-green-500/20"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div
              onClick={handleSubmit}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/50 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </div>
            <span className="text-red-600 items-center justify-center flex mt-4">
              {" "}
              {loginerrors}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
