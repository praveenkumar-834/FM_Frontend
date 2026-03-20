import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import useCurrency from "../../hooks/useCurrency"

const { symbol } = useCurrency()

function GoalList() {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await API.get("/goals");
      const data = res.data || [];
      setGoals(data);
      setFilteredGoals(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = () => {
    let data = [...goals];

    if (titleFilter.trim()) {
      data = data.filter((g) =>
        g.title?.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((g) => g.status === statusFilter);
    }

    setFilteredGoals(data);
  };

  const handleReset = () => {
    setTitleFilter("");
    setStatusFilter("");
    setFilteredGoals(goals);
  };

  const totalTarget = useMemo(() => {
    return filteredGoals.reduce(
      (sum, goal) => sum + Number(goal.targetAmount || 0),
      0
    );
  }, [filteredGoals]);

  const totalSaved = useMemo(() => {
    return filteredGoals.reduce(
      (sum, goal) => sum + Number(goal.savedAmount || 0),
      0
    );
  }, [filteredGoals]);

  const totalRemaining = useMemo(() => {
    return filteredGoals.reduce(
      (sum, goal) => sum + Number(goal.remainingAmount || 0),
      0
    );
  }, [filteredGoals]);

  const completedGoals = useMemo(() => {
    return filteredGoals.filter((goal) => goal.status === "completed").length;
  }, [filteredGoals]);

  const getStatusClass = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "missed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Goals</h2>

        <Link
          to="/goals/add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Goal
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Target</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{totalTarget.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Saved</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{totalSaved.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-100 text-red-800 p-4 rounded shadow">
          <h3 className="font-semibold">Total Remaining</h3>
          <p className="text-2xl font-bold mt-2">
            {symbol}{totalRemaining.toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-100 text-purple-800 p-4 rounded shadow">
          <h3 className="font-semibold">Completed Goals</h3>
          <p className="text-2xl font-bold mt-2">{completedGoals}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
        </select>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {filteredGoals.map((goal) => (
          <div key={goal._id} className="bg-white shadow rounded p-5">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div>
                <h3 className="text-lg font-bold">{goal.title}</h3>
                <p className="text-sm text-gray-500">
                  {goal.category || "General"}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${getStatusClass(
                  goal.status
                )}`}
              >
                {goal.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <p>
                <span className="font-semibold">Target:</span> {symbol}
                {Number(goal.targetAmount || 0).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Saved:</span> {symbol}
                {Number(goal.savedAmount || 0).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Remaining:</span> {symbol}
                {Number(goal.remainingAmount || 0).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Needed / Month:</span> {symbol}
                {Number(goal.neededPerMonth || 0).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Deadline:</span>{" "}
                {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{goal.progressPercent || 0}%</span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className={`h-3 rounded ${
                    goal.status === "completed"
                      ? "bg-green-600"
                      : goal.status === "missed"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${goal.progressPercent || 0}%` }}
                />
              </div>
            </div>

            {goal.notes && (
              <p className="text-sm text-gray-600 mb-4">{goal.notes}</p>
            )}

            <div className="flex gap-2">
              <Link
                to={`/goals/edit/${goal._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteGoal(goal._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Target</th>
              <th className="border p-2">Saved</th>
              <th className="border p-2">Remaining</th>
              <th className="border p-2">Progress</th>
              <th className="border p-2">Deadline</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGoals.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No goals found
                </td>
              </tr>
            )}

            {filteredGoals.map((goal) => (
              <tr key={goal._id}>
                <td className="border p-2">{goal.title}</td>
                <td className="border p-2">
                  {symbol}{Number(goal.targetAmount || 0).toLocaleString()}
                </td>
                <td className="border p-2">
                  {symbol}{Number(goal.savedAmount || 0).toLocaleString()}
                </td>
                <td className="border p-2">
                  {symbol}{Number(goal.remainingAmount || 0).toLocaleString()}
                </td>
                <td className="border p-2">{goal.progressPercent || 0}%</td>
                <td className="border p-2">
                  {new Date(goal.deadline).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(
                      goal.status
                    )}`}
                  >
                    {goal.status}
                  </span>
                </td>
                <td className="border p-2">
                  <Link
                    to={`/goals/edit/${goal._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GoalList;