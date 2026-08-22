export function computeSalary(wage) {
  const w = Number(wage) || 0
  const basic = round(w * 0.5)
  const hra = round(basic * 0.5)
  const standardAllowance = 4167
  const performanceBonus = round(w * 0.0833)
  const leaveTravelAllowance = round(w * 0.08333)
  const others = basic + hra + standardAllowance + performanceBonus + leaveTravelAllowance
  const fixedAllowance = round(Math.max(0, w - others))
  const pf = round(basic * 0.12)
  const professionalTax = 200
  const componentsTotal = others + fixedAllowance
  return {
    monthlyWage: w,
    yearlyWage: w * 12,
    basic,
    hra,
    standardAllowance,
    performanceBonus,
    leaveTravelAllowance,
    fixedAllowance,
    pf,
    professionalTax,
    componentsTotal,
    withinWage: componentsTotal <= w + 0.5,
  }
}

function round(n) {
  return Math.round(n)
}
