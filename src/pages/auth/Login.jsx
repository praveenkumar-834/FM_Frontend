
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [requiresOtp, setRequiresOtp] = useState(false)
  const [userId, setUserId] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  // 🔐 LOGIN STEP
  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const res = await axios.post(
        "https://finance-backend-gamma.vercel.app/api/auth/login",
        {
          email,
          password
        }
      )

      // 👉 If OTP required
      if (res.data.requiresOtp) {
        setRequiresOtp(true)
        setUserId(res.data.userId)
        setMessage("OTP sent to your email")
        return
      }

      // 👉 Normal login
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      localStorage.setItem("role", res.data.user.role)

      navigate(
        res.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/dashboard"
      )
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed")
    }
  }

  // 🔑 OTP VERIFY STEP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const res = await axios.post(
        "https://finance-backend-80w5.onrender.com/api/auth/verify-otp",
        {
          userId,
          otp
        }
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      localStorage.setItem("role", res.data.user.role)

      navigate(
        res.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/dashboard"
      )
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed")
    }
  }

  return (
    <div className="flex justify-center items-center h-[90vh] bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          {requiresOtp ? "Verify OTP" : "Login"}
        </h2>

        {!requiresOtp ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 rounded text-center tracking-widest text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
              Verify OTP
            </button>

            <button
              type="button"
              onClick={() => {
                setRequiresOtp(false)
                setOtp("")
              }}
              className="w-full bg-gray-500 text-white p-2 rounded"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* 🔗 Forgot password */}
        {!requiresOtp && (
          <div className="text-center mt-3">
            <a
              href="/forgot-password"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="text-center text-red-500 mt-3">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default Login