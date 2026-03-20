

import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../../api/axios"

function EditGoal() {
  const { id } = useParams()
  const navigate = useNavigate()

  const storedUser = JSON.parse(localStorage.getItem("user")) || {}
  const initialCustomCategories = storedUser.customCategories || []

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("General")
  const [targetAmount, setTargetAmount] = useState("")
  const [savedAmount, setSavedAmount] = useState("")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [customCategories, setCustomCategories] = useState(initialCustomCategories)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const defaultGoalCategories = [
    "General",
    "Travel",
    "Vehicle",
    "Emergency Fund",
    "Education",
    "Home",
    "Investment"
  ]

  const categoryOptions = useMemo(() => {
    return [...new Set([...defaultGoalCategories, ...customCategories])]
  }, [customCategories])

  useEffect(() => {
    fetchGoal()
  }, [])

  const fetchGoal = async () => {
    try {
      const res = await API.get(`/goals/${id}`)

      setTitle(res.data.title || "")
      setCategory(res.data.category || "General")
      setTargetAmount(res.data.targetAmount || "")
      setSavedAmount(res.data.savedAmount || "")
      setDeadline(res.data.deadline ? res.data.deadline.split("T")[0] : "")
      setNotes(res.data.notes || "")
    } catch (err) {
      console.log(err)
      setError("Failed to load goal")
    }
  }

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
      const res = await API.put(`/goals/${id}`, {
        title,
        category,
        targetAmount,
        savedAmount,
        deadline,
        notes
      })

      setMessage(res.data.message || "Goal updated successfully")

      setTimeout(() => {
        navigate("/goals")
      }, 800)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to update goal")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Goal</h2>

        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <div>
            <label className="block mb-2 font-medium">Goal Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 w-full rounded"
            >
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
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="number"
            placeholder="Saved Amount"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 w-full rounded"
            rows="4"
          />

          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
              Update Goal
            </button>

            <button
              type="button"
              onClick={() => navigate("/goals")}
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

export default EditGoal