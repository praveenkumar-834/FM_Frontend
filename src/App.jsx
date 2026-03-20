import { BrowserRouter, Routes, Route,useLocation  } from "react-router-dom"

import Navbar from "./components/Navbar.jsx"


import Login from "./pages/auth/Login.jsx"
import Register from "./pages/auth/Register.jsx"
import ForgotPassword from "./pages/auth/ForgotPassword.jsx"
import ResetPassword from "./pages/auth/ResetPassword.jsx"

import Home from "./pages/Home.jsx"
import Dashboard from "./pages/dashboard/Dashboard.jsx"

import BudgetForm from "./pages/budgets/BudgetForm.jsx"
import BudgetList from "./pages/budgets/BudgetList.jsx"

import AddExpense from "./pages/expenses/AddExpense.jsx"
import ExpenseList from "./pages/expenses/ExpenseList.jsx"
import EditExpense from "./pages/expenses/EditExpense.jsx"

import GoalList from "./pages/goals/GoalList.jsx"
import AddGoal from "./pages/goals/AddGoal.jsx"

import AddIncome from "./pages/income/AddIncome.jsx"
import IncomeList from "./pages/income/IncomeList.jsx"

import Reports from "./pages/reports/Reports.jsx"

import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import UsersList from "./pages/admin/UsersList.jsx"
import ExpensesReport from "./pages/admin/ExpensesReport.jsx"

import ProtectedRoute from "./components/ProtectedRoute.jsx"
import AdminRoute from "./components/AdminRoute.jsx"
import EditBudget from "./pages/budgets/EditBudget.jsx"

import EditIncome from "./pages/income/EditIncome"
import EditGoal from "./pages/goals/EditGoal.jsx"
import Sidebar from "./components/Sidebar.jsx"
import UserDashboard from "./pages/user/UserDashboard.jsx"
import EditProfile from "./pages/user/EditProfile.jsx"
import Forecast from "./pages/ForeCast.jsx"
import UserLayout from "./pages/user/UserLayout.jsx"
function Layout(){

const location = useLocation()

return(

<>

{/* Show Navbar only on Home page */}
{location.pathname === "/" && <Navbar />}



<Routes>

<Route path="/" element={<Home />} />

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route path="/forgot-password" element={<ForgotPassword />} />

<Route path="/reset-password/:token" element={<ResetPassword />} />



</Routes>

</>

)

}
function App() {

return (



<BrowserRouter>

<Layout />


<Routes>

<Route path="/" element={<Home />} />

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route path="/forgot-password" element={<ForgotPassword />} />

<Route path="/reset-password/:token" element={<ResetPassword />} />

{/* USER DASHBOARD */}

<Route
path="/profile"
element={
<ProtectedRoute>
  
<EditProfile/>

</ProtectedRoute>
}
/>

<Route
path="/user-dashboard"
element={
<ProtectedRoute>
<UserDashboard/>
</ProtectedRoute>
}
/>
<Route
path="/dashboard"
element={
<ProtectedRoute>
  <UserLayout>
<Dashboard/>
</UserLayout>
</ProtectedRoute>
}
/>

<Route
path="/sidebar"
element={
<ProtectedRoute>
<Sidebar/>
</ProtectedRoute>
}
/>

{/* BUDGET */}

<Route
path="/budget/add"
element={
<ProtectedRoute>
  <UserLayout>
<BudgetForm/>
</UserLayout>
</ProtectedRoute>
}
/>

<Route
path="/budget/list"
element={
<ProtectedRoute>
  <UserLayout>
<BudgetList/>
</UserLayout>
</ProtectedRoute>
}
/>

<Route
  path="/budget/edit/:id"
  element={
    <ProtectedRoute>
      <UserLayout>
      <EditBudget />
      </UserLayout>
    </ProtectedRoute>
  }
/>


{/* EXPENSE */}

<Route
path="/expenses"
element={
<ProtectedRoute>
  <UserLayout>
<ExpenseList/>
</UserLayout>
</ProtectedRoute>
}
/>

<Route
path="/expenses/add"
element={
<ProtectedRoute>
  <UserLayout>
<AddExpense/>
</UserLayout>
</ProtectedRoute>
}
/>

<Route
path="/expenses/edit/:id"
element={
<ProtectedRoute>
  <UserLayout>
<EditExpense/>
</UserLayout>
</ProtectedRoute>
}
/>

{/* GOALS */}

<Route
path="/goals"
element={
<ProtectedRoute>
  <UserLayout>
<GoalList/>
</UserLayout>
</ProtectedRoute>
}
/>

<Route
path="/goals/add"
element={
<ProtectedRoute>
  <UserLayout>
<AddGoal/>
</UserLayout>
</ProtectedRoute>
}
/>
<Route 
path="/goals/edit/:id" 
element={
<ProtectedRoute>
  <UserLayout>
<EditGoal />
</UserLayout>
</ProtectedRoute>
}
/>
{/* INCOME */}

<Route
  path="/income"
  element={
    <ProtectedRoute>
      <UserLayout>
        <IncomeList />
      </UserLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/income/add"
  element={
    <ProtectedRoute>
      <UserLayout>
        <AddIncome />
      </UserLayout>
    </ProtectedRoute>
  }
/>


<Route
path="/income/edit/:id"
element={
<ProtectedRoute>
  <UserLayout>
<EditIncome />
</UserLayout>
</ProtectedRoute>
}
/>





{/* ADMIN */}

<Route
path="/admin-dashboard"
element={
<AdminRoute>
<AdminDashboard/>
</AdminRoute>
}
/>

<Route
path="/admin/users"
element={
<AdminRoute>
<UsersList/>
</AdminRoute>
}
/>

<Route
path="/admin/expenses"
element={
<AdminRoute>
<ExpensesReport/>
</AdminRoute>
}
/>
{/* FORECAST */}
<Route
  path="/forecast"
  element={
    <ProtectedRoute>
      <UserLayout>
      <Forecast />
      </UserLayout>
    </ProtectedRoute>
  }
/>

{/* REPORT */}
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <UserLayout>
      <Reports />
      </UserLayout>
    </ProtectedRoute>
  }
/>
</Routes>

</BrowserRouter>

)

}

export default App