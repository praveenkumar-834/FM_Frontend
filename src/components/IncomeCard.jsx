function IncomeCard({ amount }) {

return (

<div className="bg-green-500 text-white p-6 rounded shadow">

<h3 className="text-lg">Total Income</h3>

<p className="text-2xl font-bold mt-2">
₹{amount}
</p>

</div>

)

}

export default IncomeCard