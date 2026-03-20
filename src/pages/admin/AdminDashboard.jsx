import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, expensesRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/expenses"),
      ]);

      setUsers(usersRes.data || []);
      setExpenses(expensesRes.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const totalExpenses = expenses.length;

  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [expenses]);

  const recentUsers = [...users].slice(-5).reverse();
  const recentExpenses = [...expenses].slice(0, 5);

  if (loading) {
    return <div className="p-6">Loading admin dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 text-blue-800 rounded shadow p-5">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
          </div>

          <div className="bg-red-100 text-red-800 rounded shadow p-5">
            <h2 className="text-lg font-semibold">Total Expenses</h2>
            <p className="text-3xl font-bold mt-2">{totalExpenses}</p>
          </div>

          <div className="bg-green-100 text-green-800 rounded shadow p-5">
            <h2 className="text-lg font-semibold">Expense Amount</h2>
            <p className="text-3xl font-bold mt-2">
              ₹{totalExpenseAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>

            {recentUsers.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {user.name || user.username || "No Name"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-sm px-2 py-1 rounded bg-gray-100">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>

            {recentExpenses.length === 0 ? (
              <p>No expenses found</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{exp.title || "Expense"}</p>
                      <p className="text-sm text-gray-500">
                        {exp.category} •{" "}
                        {exp.userId?.email || exp.userId?.name || "Unknown User"}
                      </p>
                    </div>
                    <span className="font-semibold">₹{exp.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded shadow p-5">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700"
            >
              Manage Users
            </Link>

            <Link
              to="/admin/expenses"
              className="bg-red-600 text-white text-center py-3 rounded hover:bg-red-700"
            >
              View Expenses
            </Link>

            <Link
              to="/admin/reports"
              className="bg-green-600 text-white text-center py-3 rounded hover:bg-green-700"
            >
              Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;