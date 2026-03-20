import { useEffect, useState } from "react";
import API from "../api/axios";
import useCurrency from "./../hooks/useCurrency"

const { symbol } = useCurrency()
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


function Forecast() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      const res = await API.get("/forecast");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Financial Forecast</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-semibold">Avg Income</h3>
          <p className="text-2xl font-bold">{symbol}{data.averages.avgIncome}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="font-semibold">Avg Expense</h3>
          <p className="text-2xl font-bold">{symbol}{data.averages.avgExpense}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="font-semibold">Avg Savings</h3>
          <p className="text-2xl font-bold">{symbol}{data.averages.avgSavings}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Monthly History</h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={data.monthlyHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#2563eb" />
              <Line type="monotone" dataKey="expense" stroke="#dc2626" />
              <Line type="monotone" dataKey="savings" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Next 6 Months Projection</h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={data.next6Months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projectedIncome" fill="#2563eb" />
              <Bar dataKey="projectedExpense" fill="#dc2626" />
              <Bar dataKey="projectedSavings" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Goal Forecast</h3>
        <div className="space-y-3">
          {data.goalForecasts.map((goal, index) => (
            <div key={index} className="border rounded p-3">
              <p className="font-semibold">{goal.title}</p>
              <p>Remaining: {symbol}{goal.remainingAmount}</p>
              <p>Estimated Months: {goal.estimatedMonthsToReach ?? "Not possible with current savings"}</p>
              <p>Months Left: {goal.monthsLeft}</p>
              <p className={goal.onTrack ? "text-green-600" : "text-red-600"}>
                {goal.onTrack ? "On Track" : "Off Track"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Suggestions</h3>
        <ul className="list-disc pl-5 space-y-1">
          {data.suggestions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;