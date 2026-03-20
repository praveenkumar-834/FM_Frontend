import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function ExpensesReport() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/admin/expenses");
      const data = res.data || [];
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let data = [...expenses];

    if (search.trim()) {
      data = data.filter((exp) => {
        const userName =
          exp.user?.username ||
          exp.user?.name ||
          exp.userId?.username ||
          exp.userId?.name ||
          "";
        const userEmail =
          exp.user?.email ||
          exp.userId?.email ||
          "";
        return (
          userName.toLowerCase().includes(search.toLowerCase()) ||
          userEmail.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (categoryFilter.trim()) {
      data = data.filter((exp) =>
        exp.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    setFilteredExpenses(data);
  };

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("");
    setFilteredExpenses(expenses);
  };

  const totalExpenses = filteredExpenses.length;

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0
    );
  }, [filteredExpenses]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="p-6 w-full">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-6">All Expenses</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-100 text-red-800 p-4 rounded shadow">
            <h3 className="font-semibold">Total Expenses</h3>
            <p className="text-2xl font-bold mt-2">{totalExpenses}</p>
          </div>

          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
            <h3 className="font-semibold">Total Amount</h3>
            <p className="text-2xl font-bold mt-2">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by user name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Filter
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">User</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const userName =
                    exp.user?.username ||
                    exp.user?.name ||
                    exp.userId?.username ||
                    exp.userId?.name ||
                    "Unknown User";

                  const userEmail =
                    exp.user?.email ||
                    exp.userId?.email ||
                    "-";

                  return (
                    <tr key={exp._id} className="border-t">
                      <td className="p-3 border">{userName}</td>
                      <td className="p-3 border">{userEmail}</td>
                      <td className="p-3 border">{exp.title || "-"}</td>
                      <td className="p-3 border">
                        ₹{Number(exp.amount || 0).toLocaleString()}
                      </td>
                      <td className="p-3 border">{exp.category}</td>
                      <td className="p-3 border">
                        {exp.date
                          ? new Date(exp.date).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExpensesReport;