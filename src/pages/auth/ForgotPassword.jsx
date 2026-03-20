import { useState } from "react"
import axios from "axios"

function ForgotPassword(){

const [email,setEmail] = useState("")
const [message,setMessage] = useState("")

const handleSubmit = async(e)=>{

e.preventDefault()

try{

const res = await axios.post(
"https://fm-backend-olive.vercel.app/api/auth/forgot-password",
{email}
)

setMessage(res.data.message)

}catch(err){

setMessage(err.response?.data?.message || "Error sending email")

}

}

return(

<div className="flex justify-center items-center h-[80vh]">

<div className="bg-white shadow-lg p-8 rounded w-96">

<h2 className="text-2xl font-bold text-center mb-6">
Forgot Password
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="email"
placeholder="Enter your email"
className="w-full border p-2 rounded"
onChange={(e)=>setEmail(e.target.value)}
required
/>

<button className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
Send Reset Link
</button>

</form>

{message &&

<p className="text-center text-blue-600 mt-4">
{message}
</p>

}

</div>

</div>

)

}

export default ForgotPassword