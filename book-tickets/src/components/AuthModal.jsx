import { useState } from "react"

const Auth = ({ mode = "login", onClose, onSwitchMode }) => {
  const [active, setActive] = useState(mode)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`[v0] ${active} with`, form)
    onClose?.()
  }

  const switchTo = (m) => {
    setActive(m)
    onSwitchMode?.(m)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md mx-4 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{active === "login" ? "Login" : "Sign Up"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Removed in-modal switch buttons; navigation handled by link below */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {active === "signup" && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500" placeholder="Your name" />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-medium">{active === "login" ? "Login" : "Create Account"}</button>
        </form>

        {active === "login" ? (
          <p className="text-sm text-gray-400 mt-4">Don't have an account? <button onClick={() => switchTo("signup")} className="text-red-400 hover:text-red-300">Sign up</button></p>
        ) : (
          <p className="text-sm text-gray-400 mt-4">Already have an account? <button onClick={() => switchTo("login")} className="text-red-400 hover:text-red-300">Login</button></p>
        )}
      </div>
    </div>
  )
}

export default Auth


