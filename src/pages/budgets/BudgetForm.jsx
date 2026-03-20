
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../api/axios"

function BudgetForm() {
  const navigate = useNavigate()

  const storedUser = JSON.parse(localStorage.getItem("user")) || {}
  const initialCustomCategories = storedUser.customCategories || []

  const [category, setCategory] = useState("")
  const [limit, setLimit] = useState("")
  const [month, setMonth] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [customCategories, setCustomCategories] = useState(initialCustomCategories)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const defaultBudgetCategories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Rent",
    "Transport",
    "Other"
  ]

  const categoryOptions = useMemo(() => {
    return [...new Set([...defaultBudgetCategories, ...customCategories])]
  }, [customCategories])

  const addCustomCategory = async () => {
    const value = newCategory.trim()

    if (!value) return

    const exists = categoryOptions.some(
      (cat) => cat.toLowerCase() === value.toLowerCase()
    )

    if (exists) {
      setCategory(value)
      setNewCategory("")
      return
    }

    try {
      const updatedCategories = [...customCategories, value]

      const res = await API.put("/users/profile", {
        customCategories: updatedCategories
      })

      const updatedUser = res.data.user

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setCustomCategories(updatedUser.customCategories || updatedCategories)
      setCategory(value)
      setNewCategory("")
      setMessage("Custom category added")
      setError("")
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to add custom category")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    try {
      await API.post("/budgets", {
        category,
        limit,
        month
      })

      setMessage("Budget added successfully")

      setCategory("")
      setLimit("")
      setMonth("")

      setTimeout(() => {
        navigate("/budget/list")
      }, 800)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to add budget")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Budget</h2>

        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Budget Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Budget Category</option>
              {categoryOptions.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Add Your Own Category</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Type custom category"
              />
              <button
                type="button"
                onClick={addCustomCategory}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>

          <input
            type="number"
            placeholder="Budget Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">
              Add Budget
            </button>

            <button
              type="button"
              onClick={() => navigate("/budget/list")}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetForm