import { useEffect,useState } from "react"
import API from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"

function UsersList(){

const [users,setUsers] = useState([])

useEffect(()=>{

fetchUsers()

},[])

const fetchUsers = async()=>{

try{

const res = await API.get("/admin/users")

setUsers(res.data)

}catch(err){

console.log(err)

}

}

const deleteUser = async(id)=>{

await API.delete(`/admin/users/${id}`)

fetchUsers()

}

return(

<div className="flex">

<AdminSidebar/>

<div className="p-6 w-full">

<h2 className="text-xl font-bold mb-4">
All Users
</h2>

<table className="w-full border">

<thead>

<tr className="bg-gray-200">

<th className="p-2">Username</th>
<th className="p-2">Email</th>
<th className="p-2">Action</th>

</tr>

</thead>

<tbody>

{users.map(user=>(

<tr key={user._id} className="border">

<td className="p-2">{user.username}</td>
<td className="p-2">{user.email}</td>

<td className="p-2">

<button
onClick={()=>deleteUser(user._id)}
className="bg-red-500 text-white px-3 py-1 rounded"
>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}

export default UsersList