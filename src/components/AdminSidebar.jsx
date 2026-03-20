import { Link, useLocation } from "react-router-dom"
import {
  FaTachometerAlt,
  FaUsers,
  FaWallet,
  FaChartBar,
  FaSignOutAlt
} from "react-icons/fa"

function AdminSidebar(){

const location = useLocation()

const linkClass = (path) =>
`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
location.pathname.startsWith(path) ? "bg-gray-700" : ""
}`

const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location = "/login"
}

return(

<div className="w-64 bg-gray-900 text-white min-h-screen p-5">

<h2 className="text-2xl font-bold mb-8">
Admin Panel
</h2>

<nav className="flex flex-col space-y-3">

<Link to="/admin-dashboard" className={linkClass("/admin-dashboard")}>
<FaTachometerAlt/>
Dashboard
</Link>

<Link to="/admin/users" className={linkClass("/admin/users")}>
<FaUsers/>
Users
</Link>

<Link to="/admin/expenses" className={linkClass("/admin/expenses")}>
<FaWallet/>
Expenses
</Link>

<Link to="/admin/reports" className={linkClass("/admin/reports")}>
<FaChartBar/>
Reports
</Link>

<button
onClick={handleLogout}
className="flex items-center gap-3 p-2 rounded hover:bg-red-600 mt-6"
>
<FaSignOutAlt/>
Logout
</button>

</nav>

</div>

)

}

export default AdminSidebar