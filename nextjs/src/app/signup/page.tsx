"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    emailId: "",
    password: "",
    userName: "",
  });
  const [error,setError] = React.useState({
    emailId:"",
    password:"",
    userName:""
  })
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);



  
  const onSignUp = async () => {
    try {
      setLoading(true);
      const res = await axios.post("api/users/signup", user);
      toast.success("signup successfull")
      router.push("/login");
    } catch (err: any) {
      console.log("signup failed", err.message);
      toast.error(err?.response?.data?.message || "Signup failed. Try again");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (
      user.emailId.length > 0 &&
      user.password.length > 0 &&
      user.userName.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-semibold mb-4">
        {loading ? "Processing" : "Create Your Account"}
      </h1>
      <hr />
      <label htmlFor="username">username</label>
      <input
        id="username"
        placeholder="username"
        value={user.userName}
        onChange={(e) =>
          setUser({
            ...user,
            userName: e.target.value,
          })
        }
        type="text"
        className="p-2 border mb-4 border-gray-300 rounded-md focus:outline-none focus:border-amber-600"
      />
      <label htmlFor="emailId">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-amber-600"
        id="emailId"
        type="email"
        value={user.emailId}
        onChange={(e) => setUser({ ...user, emailId: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-amber-600 "
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button type="submit"
        onClick={onSignUp}
        disabled={buttonDisabled || loading}
        className={`p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 ${
          buttonDisabled || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Signing up..." : buttonDisabled ? "No signup" : "Signup"}
      </button>

      <Link href="/login">Visit login page</Link>
    </div>
  );
}
