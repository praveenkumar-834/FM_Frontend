import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

function ResetPassword(){

const {token} = useParams()

const navigate = useNavigate()

const [password,setPassword] = useState("")
const [message,setMessage] = useState("")

const handleSubmit = async(e)=>{

e.preventDefault()

try{

const res = await axios.post(
`https://finance-backend-80w5.onrender.com/api/auth/reset-password/${token}`,
{password}
)

setMessage(res.data.message)

setTimeout(()=>{

navigate("/login")

},2000)

}catch(err){

setMessage(err.response?.data?.message || "Error resetting password")

}

}

return(

<div className="flex justify-center items-center h-[80vh]">

<div className="bg-white shadow-lg p-8 rounded w-96">

<h2 className="text-2xl font-bold text-center mb-6">
Reset Password
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="password"
placeholder="New Password"
className="w-full border p-2 rounded"
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
Update Password
</button>

</form>

{message &&

<p className="text-center text-green-600 mt-4">
{message}
</p>

}

</div>

</div>

)

}

export default ResetPassword