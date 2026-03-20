import { Link } from "react-router-dom"

function Navbar() {

return (

<nav className="bg-blue-600 text-white p-4 shadow">

<div className="max-w-6xl mx-auto flex justify-between items-center">

<h1 className="text-xl font-bold">Finance Manager</h1>

<div className="space-x-6">

<Link to="/" className="hover:text-gray-200">Home</Link>

<Link to="/login" className="hover:text-gray-200">Login</Link>

<Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
Signup
</Link>

</div>

</div>


</nav>

)

}

export default Navbar