import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Register(){

const [username,setUsername] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [message,setMessage] = useState("")

const handleSubmit = async(e)=>{

e.preventDefault()

try{

const res = await axios.post(
"https://fm-backend-olive.vercel.app/api/auth/register",
{username,email,password}
)

setMessage(res.data.message)

}catch(err){

setMessage(err.response?.data?.message)

}

}

return(

<div className="flex justify-center items-center h-[80vh]">

<div className="bg-white shadow-lg p-8 rounded w-96">

<h2 className="text-2xl font-bold text-center mb-6">
Create Account
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="text"
placeholder="Username"
className="w-full border p-2 rounded"
onChange={(e)=>setUsername(e.target.value)}
required
/>

<input
type="email"
placeholder="Email"
className="w-full border p-2 rounded"
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
className="w-full border p-2 rounded"
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
Signup
</button>

</form>

<p className="text-center mt-3 text-sm">

Already have account?

<Link to="/login" className="text-blue-600 ml-1">
Login
</Link>

</p>

{message &&

<p className="text-center text-green-600 mt-3">
{message}
</p>

}

</div>

</div>

)

}

export default Register