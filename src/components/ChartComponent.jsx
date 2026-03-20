import { Bar } from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
)

function ChartComponent({ income, expense }) {

const data = {
labels: ["Income", "Expense"],
datasets: [
{
label: "Finance Overview",
data: [income, expense],
backgroundColor: ["green", "red"]
}
]
}

return (

<div className="bg-white shadow p-6 rounded">

<h2 className="text-xl font-semibold mb-4">
Income vs Expense
</h2>

<Bar data={data} />

</div>

)

}

export default ChartComponent