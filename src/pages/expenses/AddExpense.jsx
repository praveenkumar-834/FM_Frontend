import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../api/axios"

function AddExpense() {
  const navigate = useNavigate()

  const storedUser = JSON.parse(localStorage.getItem("user")) || {}
  const initialCustomCategories = storedUser.customCategories || []

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [customCategories, setCustomCategories] = useState(initialCustomCategories)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const defaultExpenseCategories = [
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
    return [...new Set([...defaultExpenseCategories, ...customCategories])]
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
      await API.post("/expenses/add", {
        title,
        amount,
        category,
        date,
        description,
        isRecurring,
        recurringType: isRecurring ? recurringType : null
      })

      setMessage("Expense added successfully")

      setTimeout(() => {
        navigate("/expenses")
      }, 800)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to add expense")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Expense</h2>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Expense Category</option>
            {categoryOptions.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

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

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            rows="4"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recurring Expense
          </label>

          {isRecurring && (
            <select
              value={recurringType}
              onChange={(e) => setRecurringType(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Recurring Type</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
              Add Expense
            </button>

            <button
              type="button"
              onClick={() => navigate("/expenses")}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpense