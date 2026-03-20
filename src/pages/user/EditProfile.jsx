
import { useEffect, useState } from "react"
import API from "../../api/axios"

function Profile() {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    currency: "INR",
    twoFactorEnabled: false,
    notifications: {
      emailAlerts: false,
      incomeAlerts: false,
      expenseAlerts: false,
      budgetAlerts: false,
      goalReminders: false,
      recurringReminders: false
    },
    customCategories: []
  })
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile")
      setUser(res.data)

      setForm({
        username: res.data.username || res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        country: res.data.country || "",
        pincode: res.data.pincode || "",
        currency: res.data.currency || "INR",
        twoFactorEnabled: res.data.twoFactorEnabled || false,
        notifications: {
          emailAlerts: res.data.notifications?.emailAlerts || false,
          incomeAlerts: res.data.notifications?.incomeAlerts || false,
          expenseAlerts: res.data.notifications?.expenseAlerts || false,
          budgetAlerts: res.data.notifications?.budgetAlerts || false,
          goalReminders: res.data.notifications?.goalReminders || false,
          recurringReminders: res.data.notifications?.recurringReminders || false
        },
        customCategories: res.data.customCategories || []
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target

    setForm({
      ...form,
      notifications: {
        ...form.notifications,
        [name]: checked
      }
    })
  }

  const addCategory = () => {
    const value = newCategory.trim()
    if (!value) return
    if (form.customCategories.includes(value)) return

    setForm({
      ...form,
      customCategories: [...form.customCategories, value]
    })
    setNewCategory("")
  }

  const removeCategory = (category) => {
    setForm({
      ...form,
      customCategories: form.customCategories.filter((c) => c !== category)
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      const res = await API.put("/users/profile", form)

      setUser(res.data.user)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      setEditMode(false)
      alert("Profile Updated")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-6 flex justify-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        {!editMode ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.username || user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Address:</strong> {user?.address}</p>
                <p><strong>City:</strong> {user?.city}</p>
                <p><strong>State:</strong> {user?.state}</p>
                <p><strong>Country:</strong> {user?.country}</p>
                <p><strong>Pincode:</strong> {user?.pincode}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Financial Settings</h3>
              <div className="space-y-2">
                <p><strong>Currency:</strong> {user?.currency || "INR"}</p>
                <p><strong>Two Factor Authentication:</strong> {user?.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                <p>
                  <strong>Custom Categories:</strong>{" "}
                  {user?.customCategories?.length
                    ? user.customCategories.join(", ")
                    : "None"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
              <div className="space-y-2">
                <p><strong>Email Alerts:</strong> {user?.notifications?.emailAlerts ? "Enabled" : "Disabled"}</p>
                <p><strong>Income Alerts:</strong> {user?.notifications?.incomeAlerts ? "Enabled" : "Disabled"}</p>
                <p><strong>Expense Alerts:</strong> {user?.notifications?.expenseAlerts ? "Enabled" : "Disabled"}</p>
                <p><strong>Budget Alerts:</strong> {user?.notifications?.budgetAlerts ? "Enabled" : "Disabled"}</p>
                <p><strong>Goal Reminders:</strong> {user?.notifications?.goalReminders ? "Enabled" : "Disabled"}</p>
                <p><strong>Recurring Reminders:</strong> {user?.notifications?.recurringReminders ? "Enabled" : "Disabled"}</p>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="username" value={form.username} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Name" />
                <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Email" />
                <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Phone" />
                <input name="address" value={form.address} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Address" />
                <input name="city" value={form.city} onChange={handleChange} className="border p-2 w-full rounded" placeholder="City" />
                <input name="state" value={form.state} onChange={handleChange} className="border p-2 w-full rounded" placeholder="State" />
                <input name="country" value={form.country} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Country" />
                <input name="pincode" value={form.pincode} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Pincode" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Financial Settings</h3>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="border p-2 w-full rounded mb-3"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  name="twoFactorEnabled"
                  checked={form.twoFactorEnabled}
                  onChange={handleChange}
                />
                Enable Email Two-Factor Authentication
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Add custom category"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="bg-blue-600 text-white px-4 rounded"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.customCategories.map((category) => (
                  <div
                    key={category}
                    className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
                  >
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Notification Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="emailAlerts" checked={form.notifications.emailAlerts} onChange={handleNotificationChange} />
                  Email Alerts
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="incomeAlerts" checked={form.notifications.incomeAlerts} onChange={handleNotificationChange} />
                  Income Alerts
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="expenseAlerts" checked={form.notifications.expenseAlerts} onChange={handleNotificationChange} />
                  Expense Alerts
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="budgetAlerts" checked={form.notifications.budgetAlerts} onChange={handleNotificationChange} />
                  Budget Alerts
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="goalReminders" checked={form.notifications.goalReminders} onChange={handleNotificationChange} />
                  Goal Reminders
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="recurringReminders" checked={form.notifications.recurringReminders} onChange={handleNotificationChange} />
                  Recurring Reminders
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-green-600 text-white p-2 w-full rounded">
                Update
              </button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white p-2 w-full rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile