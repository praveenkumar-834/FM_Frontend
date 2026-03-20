function BudgetAlert({ budget, expense }) {

if (!budget) return null

if (expense > budget) {
return (
<div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
⚠️ Warning: Your expenses exceeded the budget!
</div>
)
}

if (expense > budget * 0.8) {
return (
<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mb-4">
⚠️ Alert: You have used more than 80% of your budget.
</div>
)
}

return (
<div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded mb-4">
✅ Budget is under control.
</div>
)

}

export default BudgetAlert