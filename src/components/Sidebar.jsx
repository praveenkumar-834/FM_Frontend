import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

import {
FaHome,
FaMoneyBillWave,
FaWallet,
FaChartLine,
FaBullseye,
FaSignOutAlt,
FaUser,
FaChartBar,
FaFileAlt
} from "react-icons/fa"

function Sidebar(){

const location = useLocation()
const navigate = useNavigate()

const user = JSON.parse(localStorage.getItem("user"))

useEffect(()=>{
if(!user){
navigate("/login")
}
},[user,navigate])

const linkClass = (path) =>
`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
location.pathname.startsWith(path) ? "bg-gray-700" : ""
}`

const handleLogout = ()=>{
localStorage.removeItem("token")
localStorage.removeItem("user")
navigate("/login")
}

return(

<div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col justify-between">

<div>
<h1 className="text-2xl font-bold mb-6">
Finance Manager
</h1>

<div className="bg-gray-800 p-3 rounded mb-6">
<p className="text-sm text-gray-400">Welcome</p>
<p className="font-semibold">{user?.name}</p>
<p className="text-xs text-gray-400">{user?.email}</p>

<Link
to="/profile"
className="flex items-center gap-2 text-blue-400 text-sm mt-2 hover:underline"
>
<FaUser /> View Profile
</Link>
</div>

<nav className="flex flex-col space-y-3">

<Link to="/dashboard" className={linkClass("/dashboard")}>
<FaHome />
Dashboard
</Link>

<Link to="/income" className={linkClass("/income")}>
<FaMoneyBillWave />
Income
</Link>

<Link to="/expenses" className={linkClass("/expenses")}>
<FaWallet />
Expenses
</Link>

<Link to="/budget/list" className={linkClass("/budget")}>
<FaChartLine />
Budgets
</Link>

<Link to="/goals" className={linkClass("/goals")}>
<FaBullseye />
Goals
</Link>

<Link to="/forecast" className={linkClass("/forecast")}>
<FaChartBar />
Forecast
</Link>
<Link to="/reports" className={linkClass("/reports")}>
  <FaFileAlt />
  Reports
</Link>
</nav>
</div>

<button
onClick={handleLogout}
className="flex items-center gap-3 p-2 rounded hover:bg-red-600"
>
<FaSignOutAlt />
Logout
</button>

</div>

)

}

export default Sidebar