import { useEffect, useState } from "react"
import API from "../../api/axios"

import {
BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import useCurrency from "../../hooks/useCurrency"

const { symbol } = useCurrency()

function Dashboard(){

const [income,setIncome] = useState([])
const [expenses,setExpenses] = useState([])

useEffect(()=>{
fetchData()
},[])

const fetchData = async()=>{
try{
const incomeRes = await API.get("/income")
const expenseRes = await API.get("/expenses")

setIncome(incomeRes.data)
setExpenses(expenseRes.data)

}catch(err){
console.log(err)
}
}

// TOTALS
const totalIncome = income.reduce((sum,i)=> sum + Number(i.amount),0)

const totalExpense = expenses.reduce((sum,e)=> sum + Number(e.amount),0)

const balance = totalIncome - totalExpense

// CHART DATA
const chartData = [
{ name:"Income", amount: totalIncome },
{ name:"Expense", amount: totalExpense }
]

// EXPORT EXCEL
const exportToExcel = ()=>{

const data = [
...income.map(item=>({
Type:"Income",
Source:item.source,
Amount:item.amount,
Date:new Date(item.date).toLocaleDateString()
})),

...expenses.map(item=>({
Type:"Expense",
Source:item.category || item.source,
Amount:item.amount,
Date:new Date(item.date).toLocaleDateString()
}))
]

const worksheet = XLSX.utils.json_to_sheet(data)
const workbook = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(workbook, worksheet, "Finance Report")

const excelBuffer = XLSX.write(workbook,{
bookType:"xlsx",
type:"array"
})

const file = new Blob([excelBuffer],{
type:"application/octet-stream"
})

saveAs(file,"Finance_Report.xlsx")
}

return(

<div className="p-6">

{/* HEADER */}
<h2 className="text-2xl font-bold mb-6">
Dashboard
</h2>

{/* CARDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

<div className="bg-green-100 p-4 rounded shadow">
<h3 className="font-bold">Total Income</h3>
<p className="text-lg font-semibold">
{symbol}{totalIncome.toLocaleString()}
</p>
</div>

<div className="bg-red-100 p-4 rounded shadow">
<h3 className="font-bold">Total Expense</h3>
<p className="text-lg font-semibold">
{symbol}{totalExpense.toLocaleString()}
</p>
</div>

<div className="bg-blue-100 p-4 rounded shadow">
<h3 className="font-bold">Balance</h3>
<p className="text-lg font-semibold">
{symbol}{balance.toLocaleString()}
</p>
</div>

</div>

{/* CHART */}
<div className="bg-white p-4 shadow rounded mt-6 overflow-x-auto">

<h3 className="font-bold mb-3">
Income vs Expense
</h3>

<BarChart width={500} height={300} data={chartData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Bar dataKey="amount" />
</BarChart>

</div>

{/* EXPORT BUTTON */}
<button
onClick={exportToExcel}
className="bg-purple-600 text-white px-4 py-2 rounded mt-6"
>
Export to Excel
</button>

</div>

)

}

export default Dashboard

