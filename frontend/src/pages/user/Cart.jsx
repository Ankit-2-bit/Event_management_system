import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function UserManagement() {
	const [role, setRole] = useState('all')
	const [items, setItems] = useState([])
	const [error, setError] = useState('')

	const refreshUsers = async () => {
		try {
			const query = role === 'all' ? '' : `?role=${role}`
			const { data } = await apiClient.get(`/admin/users${query}`)
			setItems(data.data)
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to fetch users at the moment.')
		}
	}

	useEffect(() => {
		let ignore = false
		const loadInitialUsers = async () => {
			try {
				const query = role === 'all' ? '' : `?role=${role}`
				const { data } = await apiClient.get(`/admin/users${query}`)
				if (!ignore) setItems(data.data)
			} catch (requestError) {
				if (!ignore) setError(requestError?.response?.data?.message || 'Unable to fetch users.')
			}
		}
		loadInitialUsers()
		return () => { ignore = true }
	}, [role])

	const toggleStatus = async (userId) => {
		try {
			await apiClient.patch(`/admin/users/${userId}/status`)
			refreshUsers()
		} catch {
			setError('Unable to update user status right now.')
		}
	}

	const cancelMembership = async (userId) => {
		try {
			await apiClient.patch(`/admin/users/${userId}/membership/cancel`)
			refreshUsers()
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to cancel membership.')
		}
	}

	return (
		<PageShell title="User And Vendor Management" links={[{ to: '/admin/memberships', label: 'Memberships' }]}>
			<div className="max-w-7xl mx-auto space-y-6">
				
				{/* Header & Filters */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
					<div>
						<h2 className="text-lg font-bold text-slate-800">Directory</h2>
						<p className="text-xs text-slate-500">Manage access and status for all registered accounts</p>
					</div>
					
					<div className="flex items-center gap-3">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter By Role</label>
						<select
							value={role}
							onChange={(event) => setRole(event.target.value)}
							className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
						>
							<option value="all">All Roles</option>
							<option value="user">Users</option>
							<option value="vendor">Vendors</option>
							<option value="admin">Admins</option>
						</select>
					</div>
				</div>

				{/* Error Toast */}
				{error && (
					<div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
						⚠️ {error}
					</div>
				)}

				{/* Table Container */}
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Identity</th>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Access Level</th>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Membership</th>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">System Status</th>
									<th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 bg-white">
								{items.map((item) => (
									<tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex flex-col">
												<span className="text-sm font-bold text-slate-900">{item.name}</span>
												<span className="text-xs text-slate-500">{item.email}</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight border ${
												item.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
												item.role === 'vendor' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-700 border-slate-200'
											}`}>
												{item.role}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{item.membership ? (
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
													<span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
													Premium
												</span>
											) : (
												<span className="text-[11px] font-bold text-slate-400">Standard</span>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
												item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
											}`}>
												{item.isActive ? 'Active' : 'Blocked'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
											<button
												type="button"
												onClick={() => toggleStatus(item._id)}
												className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
													item.isActive 
													? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' 
													: 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
												}`}
											>
												{item.isActive ? 'Restrict Access' : 'Restore Access'}
											</button>
											{item.membership && (
												<button
													type="button"
													onClick={() => cancelMembership(item._id)}
													className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 transition-all"
												>
													Revoke Plan
												</button>
											)}
										</td>
									</tr>
								))}

								{items.length === 0 && (
									<tr>
										<td className="px-6 py-20 text-center" colSpan={5}>
											<div className="flex flex-col items-center gap-2">
												<div className="text-3xl">📂</div>
												<p className="text-sm font-medium text-slate-400">No users found matching your criteria.</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</PageShell>
	)
}

export default UserManagement