import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import Alert from "../components/common/Alert";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(token)
      console.log(password)
      console.log("atlest reached here ")
      await resetPassword(token, password);
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log("why is this occuring ")
      setError(err.message || "Invalid or expired link");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a23] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1f1f2e] p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <Alert message={message} type="success" />}
        {error && <Alert message={error} type="error" />}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
          className="w-full p-3 bg-[#2b2b3c] border border-gray-600 rounded-lg"
        />
        <button className="w-full mt-4 py-2 bg-pink-500 rounded-lg">Update Password</button>
      </form>
    </div>
  );
}
