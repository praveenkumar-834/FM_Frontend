import { Link } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Dashboard from "../dashboard/Dashboard"



function UserDashboard() {

  const user = JSON.parse(localStorage.getItem("user"))

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Welcome, {user?.username}
        </h1>

        {/* DASHBOARD */}
        <Dashboard />

        {/* QUICK LINKS
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">

          <Link to="/income" className="bg-yellow-200 p-4 rounded shadow text-center">
            Income
          </Link>

          <Link to="/expenses" className="bg-green-200 p-4 rounded shadow text-center">
            Expenses
          </Link>

          <Link to="/budget/list" className="bg-blue-200 p-4 rounded shadow text-center">
            Budgets
          </Link>

          <Link to="/goals" className="bg-purple-200 p-4 rounded shadow text-center">
            Goals
          </Link>

          <Link to="/reports" className="bg-pink-200 p-4 rounded shadow text-center">
            Reports
          </Link>

          <Link to="/income/add" className="bg-indigo-200 p-4 rounded shadow text-center">
            Add Income
          </Link>

        </div> */}

      </div>

    </div>

  )

}

export default UserDashboard



