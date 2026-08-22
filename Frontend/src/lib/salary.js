export function computeSalary(wage, workingDaysPerWeek = 5, breakTimeHours = 1) {
  const w = Number(wage) || 0
  const basic = round(w * 0.5)
  const hra = round(basic * 0.5)
  const standardAllowance = 4167
  const performanceBonus = round(basic * 0.0833)
  const leaveTravelAllowance = round(basic * 0.0833)
  const others = basic + hra + standardAllowance + performanceBonus + leaveTravelAllowance
  const fixedAllowance = round(Math.max(0, w - others))
  const employeePf = round(basic * 0.12)
  const employerPf = round(basic * 0.12)
  const professionalTax = 200
  const fixedPercent = w > 0 ? round((fixedAllowance / w) * 10000) / 100 : 0

  return {
    monthlyWage: w,
    yearlyWage: round(w * 12),
    workingDaysPerWeek: Number(workingDaysPerWeek) || 5,
    breakTimeHours: Number(breakTimeHours) || 1,
    salaryComponents: [
      component('Basic Salary', basic, '50.00 %', 'Define Basic salary from company cost compute it based on monthly Wages.'),
      component('House Rent Allowance', hra, '50.00 %', 'HRA provided to employees 50% of the basic salary.'),
      component('Standard Allowance', standardAllowance, '16.67 %', 'A standard allowance is a predetermined, fixed amount provided to employee as part of their salary.'),
      component('Performance Bonus', performanceBonus, '8.33 %', 'Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary.'),
      component('Leave Travel Allowance', leaveTravelAllowance, '8.33 %', 'LTA is paid by the company to employees to cover their travel expenses and calculated as a % of the basic salary.'),
      component('Fixed Allowance', fixedAllowance, `${fixedPercent.toFixed(2)} %`, 'fixed allowance portion of wages is determined after calculating all salary components.'),
    ],
    pfContributions: [
      component('Employee PF', employeePf, '12.00 %', 'PF is calculated based on the basic salary.'),
      component('Employer PF', employerPf, '12.00 %', 'PF is calculated based on the basic salary.'),
    ],
    taxDeductions: [
      component('Professional Tax', professionalTax, '', 'Professional Tax deducted from the Gross salary.'),
    ],
    basic,
    hra,
    standardAllowance,
    performanceBonus,
    leaveTravelAllowance,
    fixedAllowance,
    pf: employeePf,
    professionalTax,
  }
}

function component(label, amount, percentLabel, note) {
  return { label, amount, percentLabel, note }
}

function round(n) {
  return Math.round(n * 100) / 100
}
