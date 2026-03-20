function ExpenseCard({ amount }) {

return (

<div className="bg-red-500 text-white p-6 rounded shadow">

<h3 className="text-lg">Total Expense</h3>

<p className="text-2xl font-bold mt-2">
₹{amount}
</p>

</div>

)

}

export default ExpenseCard