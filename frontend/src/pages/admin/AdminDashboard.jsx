import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    memberships: 0,
    openRequests: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get('/admin/dashboard')
        setStats(data.data)
      } catch {
        setStats({
          users: 0,
          vendors: 0,
          memberships: 0,
          openRequests: 0,
        })
      }
    }

    fetchStats()
  }, [])

  return (
    <PageShell
      title="Welcome Admin"
      links={[
        { to: '/admin/users', label: 'Maintain User/Vendor' },
        { to: '/admin/memberships', label: 'Memberships' },
      ]}
    >
      {/* Stats Section */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300">
          <p className="text-sm opacity-80">Users</p>
          <h2 className="text-3xl font-bold mt-2">{stats.users}</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300">
          <p className="text-sm opacity-80">Vendors</p>
          <h2 className="text-3xl font-bold mt-2">{stats.vendors}</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300">
          <p className="text-sm opacity-80">Memberships</p>
          <h2 className="text-3xl font-bold mt-2">{stats.memberships}</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-red-600 p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300">
          <p className="text-sm opacity-80">Open Requests</p>
          <h2 className="text-3xl font-bold mt-2">{stats.openRequests}</h2>
        </div>
      </section>

      {/* Action Section */}
      <section className="grid gap-6 md:grid-cols-2 mt-8">
        <Link
          to="/admin/users"
          className="group rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
        >
          <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600">
            Maintain Users
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            View and manage all users & vendors
          </p>
        </Link>

        <Link
          to="/admin/memberships"
          className="group rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
        >
          <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600">
            Manage Memberships
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Create and update membership plans
          </p>
        </Link>
      </section>
    </PageShell>
  )
}

export default AdminDashboard