import React, { useState, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { GoogleLogin } from "@react-oauth/google";

function SignUp() {
  const navigate = useNavigate();
  const googleRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIXED API METHOD
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.Signup.url, {
        method: SummaryApi.Signup.method, // ✅ FIX
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert("Signup successful ✅");
        navigate("/login");
      } else {
        alert(result.message);
      }

    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  // ✅ TRIGGER GOOGLE POPUP (UI SAME)
  const handleGoogleSignup = () => {
    googleRef.current?.querySelector("div[role=button]")?.click();
  };

  // ✅ GOOGLE RESPONSE HANDLER
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(SummaryApi.GoogleAuth.url, {
        method: SummaryApi.GoogleAuth.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        alert("Google signup/login successful ✅");
        navigate("/");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Google auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl bg-gray-200 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-400 to-green-600 text-white p-10 flex-col justify-center relative overflow-hidden">
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">C.R.M</h1>

          <p className="text-lg font-semibold">
            Customer Relationship Management
          </p>

          <p className="mt-4 text-sm opacity-90">
            Manage your properties and clients efficiently.
          </p>

          <div className="absolute right-[-80px] top-0 w-[200px] h-full bg-gray-200 rounded-l-[150px]"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 py-10">

          <h2 className="text-2xl sm:text-3xl text-green-500 mb-6 text-center font-semibold">
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                placeholder="Full Name"
                required
                className="w-full p-3 bg-transparent outline-none"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Email"
                required
                className="w-full p-3 bg-transparent outline-none"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4">
              <Phone size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleOnChange}
                placeholder="Contact Number"
                required
                className="w-full p-3 bg-transparent outline-none"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-3 relative">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Password"
                required
                className="w-full p-3 bg-transparent outline-none"
              />

              <span
                className="absolute right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
            >
              SIGN UP
            </button>

          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* ✅ SAME BUTTON UI */}
          <button
            onClick={handleGoogleSignup}
            className="w-full border border-gray-300 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>

          {/* ✅ HIDDEN GOOGLE (NO UI CHANGE) */}
          <div ref={googleRef} style={{ display: "none" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
            />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 border border-green-500 text-green-500 py-3 rounded-full hover:bg-green-100"
          >
            Already have an account? Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default SignUp;