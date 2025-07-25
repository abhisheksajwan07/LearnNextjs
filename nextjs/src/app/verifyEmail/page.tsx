"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const res = await axios.post("/api/users/verifyemail", { token });
        setVerified(true);
        toast.success("✅ Email verified successfully!");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Verification failed. Try again.");
        toast.error("❌ " + err?.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyUserEmail();
    } else {
      setError("No token provided in the URL");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-3xl text-black font-bold mb-4">Email Verification</h1>

        {loading && <p className="text-gray-500">⏳ Verifying your email...</p>}

        {!loading && verified && (
          <>
            <p className="text-green-600 text-lg font-semibold mb-4">
              🎉 Your email has been verified!
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {!loading && error && (
          <div className="mt-4">
            <p className="text-red-600 font-semibold">{error}</p>
            <p className="text-sm text-gray-500 mt-1">Request a new verification link if needed.</p>
          </div>
        )}

        {/* Optional Debug Token */}
        <p className="mt-6 text-xs text-gray-400 break-all">
          Token: {token || "No token found"}
        </p>
      </div>
    </div>
  );
}
