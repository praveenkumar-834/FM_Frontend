import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import useCurrency from "../../hooks/useCurrency"

const { symbol } = useCurrency()
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await API.get("/budgets");
      const data = res.data.budgets || res.data || [];
      setBudgets(data);
      setFilteredBudgets(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBudget = async (id) => {
    try {
      await API.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = () => {
    let data = [...budgets];

    if (categoryFilter.trim()) {
      data = data.filter((b) =>
        b.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    if (monthFilter) {
      data = data.filter((b) => b.month === monthFilter);
    }

    setFilteredBudgets(data);
  };

  const handleReset = () => {
    setCategoryFilter("");
    setMonthFilter("");
    setFilteredBudgets(budgets);
  };

  const totalLimit = useMemo(() => {
    return filteredBudgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
  }, [filteredBudgets]);

  const totalSpent = useMemo(() => {
    return filteredBudgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  }, [filteredBudgets]);

  const totalRemaining = useMemo(() => {
    return filteredBudgets.reduce((sum, b) => {
      const remaining =
        b.remaining !== undefined && b.remaining !== null
          ? Number(b.remaining)
          : Number(b.limit || 0) - Number(b.spent || 0);
      return sum + remaining;
    }, 0);
  }, [filteredBudgets]);

  const warningCount = useMemo(() => {
    return filteredBudgets.filter((b) => b.status === "warning").length;
  }, [filteredBudgets]);

  const exceededCount = useMemo(() => {
    return filteredBudgets.filter((b) => b.status === "exceeded").length;
  }, [filteredBudgets]);

  const barData = filteredBudgets.map((b) => ({
    category: b.category,
    limit: Number(b.limit || 0),
    spent: Number(b.spent || 0),
  }));

  const pieData = filteredBudgets.map((b) => ({
    name: b.category,
    value: Number(b.limit || 0),
  }));

  const pieColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
  ];

  return (
    
   

    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Budget Monitoring</h2>

        <Link
          to="/budget/add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Budget
        </Link>
      </div>

      {(warningCount > 0 || exceededCount > 0) && (
        <div className="mb-6 space-y-2">
          {warningCount > 0 && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
              ⚠ {warningCount} budget(s) nearing limit
            </div>
          )}
          {exceededCount > 0 && (
            <div className="bg-red-100 text-red-800 p-3 rounded">
              🚨 {exceededCount} budget(s) exceeded
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Budget</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{totalLimit.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-100 text-red-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Spent</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h3 className="font-semibold">Remaining</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{totalRemaining.toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-100 text-purple-800 p-4 rounded shadow">
          <h3 className="font-semibold">Categories</h3>
          <p className="text-2xl font-bold mt-2">{filteredBudgets.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Budget vs Spent</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="limit" fill="#2563eb" />
                <Bar dataKey="spent" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Category</th>
              <th className="border p-2">Limit</th>
              <th className="border p-2">Spent</th>
              <th className="border p-2">Remaining</th>
              <th className="border p-2">Month</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBudgets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No budgets found
                </td>
              </tr>
            )}

            {filteredBudgets.map((b) => {
              const spent = Number(b.spent || 0);
              const remaining =
                b.remaining !== undefined && b.remaining !== null
                  ? Number(b.remaining)
                  : Number(b.limit || 0) - spent;

              const status =
                b.status ||
                (spent >= Number(b.limit || 0)
                  ? "exceeded"
                  : spent >= Number(b.limit || 0) * 0.8
                  ? "warning"
                  : "safe");

              return (
                <tr key={b._id}>
                  <td className="border p-2">{b.category}</td>
                  <td className="border p-2">
                    {symbol}{Number(b.limit || 0).toLocaleString()}
                  </td>
                  <td className="border p-2">{symbol}{spent.toLocaleString()}</td>
                  <td className="border p-2">{symbol}{remaining.toLocaleString()}</td>
                  <td className="border p-2">{b.month || "-"}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        status === "exceeded"
                          ? "bg-red-100 text-red-700"
                          : status === "warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="border p-2 space-x-2">
                    <Link
                      to={`/budget/edit/${b._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteBudget(b._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetList;