import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Login successful!");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f6f2] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Illustration placeholder */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="Login Illustration"
            className="w-40 h-40 object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-red-700 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => alert("Forgot password flow not implemented")}
            className="text-sm text-red-700 hover:underline"
          >
            forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
