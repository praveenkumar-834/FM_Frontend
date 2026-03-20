// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../api/axios";

// function EditBudget() {
//   const { id } = useParams(); // budget id from URL
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [limit, setLimit] = useState("");
//   const [category, setCategory] = useState("");
//   const [message, setMessage] = useState("");

//   // Fetch budget details to prefill the form
//   useEffect(() => {
//     const fetchBudget = async () => {
//       try {
//         const res = await API.get(`/budgets/${id}`);
//         setTitle(res.data.budget.title);
//         setLimit(res.data.budget.limit);
//         setCategory(res.data.budget.category);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchBudget();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.put(`/budgets/${id}`, { title, limit, category });
//       setMessage(res.data.message);
//       navigate("/budget/list"); // go back to budget list
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to update budget");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Budget</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="border p-2 w-full"
//         />
//         <input
//           type="number"
//           placeholder="Limit"
//           value={limit}
//           onChange={(e) => setLimit(e.target.value)}
//           required
//           className="border p-2 w-full"
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-2 w-full"
//         />
//         <button className="bg-blue-600 text-white p-2 rounded w-full">Update Budget</button>
//       </form>
//       {message && <p className="text-red-500 mt-2">{message}</p>}
//     </div>
//   );
// }

// export default EditBudget;
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../../api/axios"

function EditBudget() {
  const { id } = useParams()
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

  useEffect(() => {
    fetchBudget()
  }, [])

  const fetchBudget = async () => {
    try {
      const res = await API.get(`/budgets/${id}`)
      const budget = res.data.budget || res.data

      setCategory(budget.category || "")
      setLimit(budget.limit || "")
      setMonth(budget.month || "")
    } catch (err) {
      console.log(err)
      setError("Failed to load budget")
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
      const res = await API.put(`/budgets/${id}`, {
        category,
        limit,
        month
      })

      setMessage(res.data.message || "Budget updated successfully")

      setTimeout(() => {
        navigate("/budget/list")
      }, 800)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to update budget")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Budget</h2>

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
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
              Update Budget
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

export default EditBudget