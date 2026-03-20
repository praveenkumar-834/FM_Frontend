import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../../api/axios"
import useCurrency from "../../hooks/useCurrency"

const { symbol } = useCurrency()
import {
PieChart, Pie, Cell, Tooltip,
BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts"

function ExpenseList(){

const [expenses,setExpenses] = useState([])
const [filteredExpenses,setFilteredExpenses] = useState([])

const [category,setCategory] = useState("")
const [startDate,setStartDate] = useState("")
const [endDate,setEndDate] = useState("")

useEffect(()=>{
fetchExpenses()
},[])

const fetchExpenses = async()=>{
try{
const res = await API.get("/expenses")
setExpenses(res.data)
setFilteredExpenses(res.data)
}catch(error){
console.log(error)
}
}

// DELETE
const deleteExpense = async(id)=>{
try{
await API.delete(`/expenses/${id}`)
fetchExpenses()
}catch(error){
console.log(error)
}
}

// FILTER
const handleFilter = ()=>{

let data = [...expenses]

// CATEGORY
if(category){
data = data.filter(item =>
item.category === category
)
}

// DATE
if(startDate){
data = data.filter(item =>
new Date(item.date) >= new Date(startDate)
)
}

if(endDate){
data = data.filter(item =>
new Date(item.date) <= new Date(endDate)
)
}

setFilteredExpenses(data)
}

// RESET
const handleReset = ()=>{
setCategory("")
setStartDate("")
setEndDate("")
setFilteredExpenses(expenses)
}

// TOTAL
const totalExpense = filteredExpenses.reduce((sum,item)=>{
return sum + Number(item.amount)
},0)

// CATEGORY DROPDOWN
const categories = [...new Set(expenses.map(item => item.category))]

// MONTHLY DATA
const monthlyData = filteredExpenses.reduce((acc,item)=>{
const month = new Date(item.date).toLocaleString("default",{
month:"short",
year:"numeric"
})

if(!acc[month]){
acc[month] = 0
}

acc[month] += Number(item.amount)

return acc
},{})

const monthlyArray = Object.keys(monthlyData).map(key=>({
month:key,
amount:monthlyData[key]
}))

// CATEGORY DATA (PIE)
const categoryData = filteredExpenses.reduce((acc,item)=>{
if(!acc[item.category]){
acc[item.category] = 0
}
acc[item.category] += Number(item.amount)
return acc
},{})

const categoryArray = Object.keys(categoryData).map(key=>({
name:key,
value:categoryData[key]
}))

return(

<div className="p-6">

{/* HEADER */}
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold">Expense List</h2>

<div className="bg-red-100 text-red-800 px-4 py-2 rounded font-semibold shadow">
Total: {symbol}{totalExpense.toLocaleString()}
</div>
</div>

<Link
to="/expenses/add"
className="bg-green-600 text-white px-4 py-2 rounded"
>
Add Expense
</Link>

{/* FILTER */}
<div className="bg-white p-4 shadow rounded mt-4 flex gap-3 flex-wrap">

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
className="border p-2"
>
<option value="">All Categories</option>
{categories.map((cat,index)=>(
<option key={index} value={cat}>{cat}</option>
))}
</select>

<input
type="date"
value={startDate}
onChange={(e)=>setStartDate(e.target.value)}
className="border p-2"
/>

<input
type="date"
value={endDate}
onChange={(e)=>setEndDate(e.target.value)}
className="border p-2"
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

{/* TABLE */}
<div className="overflow-x-auto">
<table className="w-full border mt-4">

<thead>
<tr className="bg-gray-200">
<th className="border p-2">Title</th>
<th className="border p-2">Amount</th>
<th className="border p-2">Category</th>
<th className="border p-2">Date</th>
<th className="border p-2">Action</th>
<th className="border p-2">Recurring</th>
</tr>
</thead>

<tbody>

{filteredExpenses.length === 0 && (
<tr>
<td colSpan="5" className="text-center p-4">
No expense records found
</td>
</tr>
)}

{filteredExpenses.map((exp)=>(

<tr key={exp._id}>

<td className="border p-2">{exp.title}</td>

<td className="border p-2">{symbol}{exp.amount}</td>

<td className="border p-2">{exp.category}</td>

<td className="border p-2">
{new Date(exp.date).toLocaleDateString()}
</td>

<td className="border p-2">

<Link
to={`/expenses/edit/${exp._id}`}
className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
>
Edit
</Link>

<button
onClick={()=>deleteExpense(exp._id)}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Delete
</button>

</td>
<td className="border p-2">
{exp.isRecurring ? (
<span className="text-green-600 font-semibold">
{exp.recurringType}
</span>
) : "No"}
</td>
</tr>

))}

</tbody>

</table>
</div>

{/* CHARTS */}
<div className="flex flex-col md:flex-row gap-6 mt-6">

{/* PIE */}
<div className="bg-white p-4 shadow rounded">
<h3 className="font-bold mb-3">Category-wise</h3>

<PieChart width={300} height={300}>
<Pie
data={categoryArray}
dataKey="value"
nameKey="name"
outerRadius={100}
label
>
{categoryArray.map((entry,index)=>(
<Cell key={index} />
))}
</Pie>
<Tooltip/>
</PieChart>

</div>

{/* BAR */}
<div className="bg-white p-4 shadow rounded overflow-x-auto">
<h3 className="font-bold mb-3">Monthly</h3>

<BarChart width={500} height={300} data={monthlyArray}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Legend />
<Bar dataKey="amount" />
</BarChart>

</div>

</div>

</div>

)

}

export default ExpenseList