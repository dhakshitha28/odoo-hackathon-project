/** First two letters of first name + first two of last name (John Doe → JODO). */
export function nameCode(firstName, lastName) {
  const two = (value) => {
    const letters = (value || '').replace(/[^a-zA-Z]/g, '').toUpperCase()
    if (!letters) return 'XX'
    if (letters.length === 1) return letters + letters
    return letters.slice(0, 2)
  }
  return `${two(firstName)}${two(lastName)}`
}

export function joiningYear(joiningDate) {
  return String(new Date(joiningDate || Date.now()).getFullYear())
}

/**
 * Login ID: OI + name code + year of joining + yearly serial.
 * Example: OIJODO20220001
 */
export function generateEmployeeId(firstName, lastName, joiningDate, existingIds = []) {
  const year = joiningYear(joiningDate)
  const code = nameCode(firstName, lastName)
  const yearPrefix = `OI${code}${year}`
  const serials = existingIds
    .map((id) => {
      const match = String(id).match(new RegExp(`^OI[A-Z]{4}${year}(\\d{4})$`))
      return match ? Number(match[1]) : 0
    })
    .filter(Boolean)
  const next = (serials.length ? Math.max(...serials) : 0) + 1
  return `${yearPrefix}${String(next).padStart(4, '0')}`
}

/** First-time password is the generated Login ID. */
export function generateTempPassword(loginId) {
  return loginId
}
