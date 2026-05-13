import React, { useState, useContext, useRef } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);
  const googleRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= NORMAL LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.login.url, {
        method: SummaryApi.login.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        
        navigate("/");
      } else {
        alert(result.message);
      }

    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  // ================= GOOGLE TRIGGER =================
  const handleGoogleLogin = () => {
    googleRef.current?.querySelector("div[role=button]")?.click();
  };

  // ================= GOOGLE SUCCESS =================
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
        await fetchUserDetails();
        navigate("/");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Google login failed");
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
            Sign In to C.R.M
          </h2>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-4">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Email"
                required
                className="w-full p-3 bg-transparent outline-none text-sm sm:text-base"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 mb-3 relative">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Password"
                required
                className="w-full p-3 bg-transparent outline-none text-sm sm:text-base"
              />

              <span
                className="absolute right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between text-xs sm:text-sm mb-6 text-gray-600">
              <label className="flex items-center gap-1">
                <input type="checkbox" />
                Remember Me
              </label>
              <span className="cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition text-sm sm:text-base"
            >
              LOG IN
            </button>

          </form>

          {/* OR (added but same style as signup) */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          {/* GOOGLE BUTTON (UI MATCHED) */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* HIDDEN GOOGLE COMPONENT */}
          <div ref={googleRef} style={{ display: "none" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
            />
          </div>

          {/* SIGNUP */}
          <button
            onClick={() => navigate("/signup")}
            className="mt-4 border border-green-500 text-green-500 py-3 rounded-full hover:bg-green-100 text-sm sm:text-base"
          >
            SIGN UP
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;