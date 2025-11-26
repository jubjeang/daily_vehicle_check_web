// src/utils/auth.js
export function getAuthToken() {
  try {
    return (
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      JSON.parse(localStorage.getItem('user') || 'null')?.token ||
      JSON.parse(sessionStorage.getItem('user') || 'null')?.token ||
      null
    )
  } catch {
    return null
  }
}

export function clearAuth() {
  try {
    // เคลียร์ทั้งสองที่ ป้องกันเหลือค้าง
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
  } catch {}
}
