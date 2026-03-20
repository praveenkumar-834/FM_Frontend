import { getCurrencySymbol } from "../utils/currency"

function useCurrency() {
  const user = JSON.parse(localStorage.getItem("user"))
  const currency = user?.currency || "INR"
  const symbol = getCurrencySymbol(currency)

  return { currency, symbol }
}

export default useCurrency