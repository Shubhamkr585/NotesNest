import { useState } from "react";
import { sendForgotPasswordEmail } from "../services/api";
import Alert from "../components/common/Alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendForgotPasswordEmail(email);
      setMessage("Check your email for reset instructions.");
    } catch (err) {
      setError(  err.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a23] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1f1f2e] p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl text-center font-bold mb-4">Forgot Password</h2>
        {message && <Alert message={message} type="success" />}
        {error && <Alert message={error} type="error" />}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-3 bg-[#2b2b3c] border border-gray-600 rounded-lg"
        />
        <button className="w-full mt-4 py-2 bg-pink-500 rounded-lg">Send Reset Link</button>
      </form>
    </div>
  );
}
