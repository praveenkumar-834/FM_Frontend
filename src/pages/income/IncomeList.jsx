import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../../api/axios"
import useCurrency from "../../hooks/useCurrency"

const { symbol } = useCurrency()
import {
PieChart, Pie, Cell, Tooltip,
BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts"

function IncomeList(){

const [income,setIncome] = useState([])
const [filteredIncome,setFilteredIncome] = useState([])

const [category,setCategory] = useState("")
const [startDate,setStartDate] = useState("")
const [endDate,setEndDate] = useState("")

useEffect(()=>{
fetchIncome()
},[])

const fetchIncome = async()=>{
try{
const res = await API.get("/income")
setIncome(res.data)
setFilteredIncome(res.data)
}catch(error){
console.log(error)
}
}

// DELETE
const deleteIncome = async(id)=>{
try{
await API.delete(`/income/${id}`)
fetchIncome()
}catch(error){
console.log(error)
}
}

// FILTER
const handleFilter = ()=>{

let data = [...income]

// Category
if(category){
data = data.filter(item =>
item.source === category
)
}

// Date
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

setFilteredIncome(data)
}

// RESET
const handleReset = ()=>{
setCategory("")
setStartDate("")
setEndDate("")
setFilteredIncome(income)
}

// TOTAL
const totalIncome = filteredIncome.reduce((sum,item)=>{
return sum + Number(item.amount)
},0)

// CATEGORY DROPDOWN
const categories = [...new Set(income.map(item => item.source))]

// MONTHLY DATA
const monthlyData = filteredIncome.reduce((acc,item)=>{
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
const categoryData = filteredIncome.reduce((acc,item)=>{
if(!acc[item.source]){
acc[item.source] = 0
}
acc[item.source] += Number(item.amount)
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
<h2 className="text-2xl font-bold">Income List</h2>

<div className="bg-green-100 text-green-800 px-4 py-2 rounded font-semibold shadow">
    Total:{symbol}{totalIncome.toLocaleString()}
</div>
</div>

<Link
to="/income/add"
className="bg-green-600 text-white px-4 py-2 rounded"
>
Add Income
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
<table className="w-full border mt-4">

<thead>
<tr className="bg-gray-200">
<th className="border p-2">Source</th>
<th className="border p-2">amount</th>
<th className="border p-2">Date</th>
<th className="border p-2">Action</th>
</tr>
</thead>

<tbody>

{filteredIncome.length === 0 && (
<tr>
<td colSpan="4" className="text-center p-4">
No income records found
</td>
</tr>
)}

{filteredIncome.map((inc)=>(

<tr key={inc._id}>

<td className="border p-2">{inc.source}</td>

<td className="border p-2">{inc.amount}</td>

<td className="border p-2">
{new Date(inc.date).toLocaleDateString()}
</td>

<td className="border p-2">

<Link
to={`/income/edit/${inc._id}`}
className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
>
Edit
</Link>

<button
onClick={()=>deleteIncome(inc._id)}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

{/* CHARTS */}
<div className="flex gap-6 flex-wrap mt-6">

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
<div className="bg-white p-4 shadow rounded">
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

export default IncomeList