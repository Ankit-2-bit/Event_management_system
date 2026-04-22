import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleHome = {
  admin: '/admin',
  vendor: '/vendor',
  user: '/user',
}

function PageShell({ title, links = [], children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-xl border border-slate-300 bg-slate-200 p-6 shadow-lg">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold tracking-wide text-white sm:text-lg">
            {title}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user?.role && (
              <Link
                to={roleHome[user.role] || '/'}
                className="rounded-md border border-emerald-400 bg-white px-5 py-2 text-sm font-medium text-slate-700"
              >
                Home
              </Link>
            )}

            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md border border-emerald-400 bg-white px-5 py-2 text-sm font-medium text-slate-700"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-emerald-400 bg-white px-5 py-2 text-sm font-medium text-slate-700"
            >
              Log Out
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}

export default PageShell
