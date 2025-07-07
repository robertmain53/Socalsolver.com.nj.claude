import Calculator from "@/components/Calculator"
import { compoundInterest } from "@/lib/formulas/compoundInterest"

const variables = [
  { name: "principal", label: "Principal", unit: "$", defaultValue: 1000 },
  { name: "rate", label: "Interest Rate", unit: "", defaultValue: 0.05 },
  { name: "timesPerYear", label: "Compoundings per Year", unit: "", defaultValue: 12 },
  { name: "years", label: "Years", unit: "", defaultValue: 5 }
]

export default function Page() {
  return (
    <div className="max-w-lg mx-auto p-8">
      <Calculator
        title="Compound Interest Calculator"
        variables={variables}
        formula={compoundInterest}
      />
    </div>
  )
}
