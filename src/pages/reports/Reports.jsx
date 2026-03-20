import { useEffect, useMemo, useState } from "react"
import API from "../../api/axios"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts"
import useCurrency from "../../hooks/useCurrency"

const { symbol } = useCurrency()

function Reports() {
  const [data, setData] = useState(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports", {
        params: { startDate, endDate, category }
      })
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleReset = async () => {
    setStartDate("")
    setEndDate("")
    setCategory("")
    try {
      const res = await API.get("/reports")
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const exportToExcel = () => {
    if (!data) return

    const rows = data.expenses.map((e) => ({
      Type: "Expense",
      Title: e.title || "",
      Amount: e.amount || 0,
      Category: e.category || "",
      Date: new Date(e.date).toLocaleDateString()
    }))

    const incomeRows = data.incomes.map((i) => ({
      Type: "Income",
      Title: i.source || i.title || "",
      Amount: i.amount || 0,
      Category: i.source || "",
      Date: new Date(i.date).toLocaleDateString()
    }))

    const worksheet = XLSX.utils.json_to_sheet([...incomeRows, ...rows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    })

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream"
    })

    saveAs(file, "Finance_Report.xlsx")
  }

  const categories = useMemo(() => {
    if (!data) return []
    return [...new Set(data.expenses.map((e) => e.category).filter(Boolean))]
  }, [data])

  const pieColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2"
  ]

  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">Reports</h2>

        <button
          onClick={exportToExcel}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Export to Excel
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={fetchReports}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Income</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{Number(data.totalIncome || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-red-100 text-red-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Expense</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{Number(data.totalExpense || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h3 className="font-semibold">Balance</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{Number(data.balance || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-100 text-purple-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Budget</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{Number(data.totalBudget || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Expense by Category</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {data.categoryData.map((_, index) => (
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

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Income vs Expense</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#16a34a" />
                <Bar dataKey="expense" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Savings Trend</h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h3 className="font-semibold mb-4">Expense Records</h3>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No expense records found
                </td>
              </tr>
            )}

            {data.expenses.map((e) => (
              <tr key={e._id}>
                <td className="border p-2">{e.title}</td>
                <td className="border p-2">{symbol}{e.amount}</td>
                <td className="border p-2">{e.category}</td>
                <td className="border p-2">
                  {new Date(e.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports