import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const termOptions = [
	{ label: '6 months', value: 6 },
	{ label: '1 year', value: 12 },
	{ label: '2 years', value: 24 },
]

const initialAddForm = {
	membershipNumber: '',
	name: '',
	price: '',
	durationMonths: 6,
	features: '',
}

const initialUpdateForm = {
	membershipNumber: '',
	action: 'extend',
	extensionMonths: 6,
}

function formatTerm(months) {
	if (Number(months) === 12) return '1 year'
	if (Number(months) === 24) return '2 years'
	return '6 months'
}

function MembershipManagement() {
	const [addForm, setAddForm] = useState(initialAddForm)
	const [updateForm, setUpdateForm] = useState(initialUpdateForm)
	const [memberships, setMemberships] = useState([])
	const [loadedMembership, setLoadedMembership] = useState(null)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const refreshMemberships = async () => {
		try {
			const { data } = await apiClient.get('/memberships')
			setMemberships(data.data)
		} catch {
			setError('Unable to load memberships right now.')
		}
	}

	useEffect(() => {
		let ignore = false
		const loadInitialMemberships = async () => {
			try {
				const { data } = await apiClient.get('/memberships')
				if (!ignore) setMemberships(data.data)
			} catch {
				if (!ignore) setError('Unable to load memberships right now.')
			}
		}
		loadInitialMemberships()
		return () => { ignore = true }
	}, [])

	const handleCreate = async (event) => {
		event.preventDefault()
		setError(''); setSuccess('')
		if (!addForm.features.trim()) {
			setError('All fields are mandatory. Please add at least one feature.')
			return
		}
		try {
			await apiClient.post('/memberships', {
				membershipNumber: addForm.membershipNumber.trim().toUpperCase(),
				name: addForm.name.trim(),
				price: Number(addForm.price),
				durationMonths: Number(addForm.durationMonths),
				features: addForm.features.split(',').map((v) => v.trim()).filter(Boolean),
			})
			setAddForm(initialAddForm)
			setSuccess('Membership added successfully.')
			refreshMemberships()
		} catch (err) {
			setError(err?.response?.data?.message || 'Unable to create membership.')
		}
	}

	const handleLoadMembership = async (event) => {
		event.preventDefault()
		setError(''); setSuccess('')
		if (!updateForm.membershipNumber.trim()) {
			setError('Membership Number is mandatory.')
			return
		}
		try {
			const { data } = await apiClient.get(`/memberships/number/${encodeURIComponent(updateForm.membershipNumber.trim().toUpperCase())}`)
			setLoadedMembership(data.data)
			setSuccess('Details loaded.')
		} catch (err) {
			setLoadedMembership(null)
			setError(err?.response?.data?.message || 'Membership not found.')
		}
	}

	const handleUpdateMembership = async (event) => {
		event.preventDefault()
		setError(''); setSuccess('')
		try {
			await apiClient.patch(`/memberships/number/${encodeURIComponent(updateForm.membershipNumber.trim().toUpperCase())}`, {
				action: updateForm.action,
				extensionMonths: Number(updateForm.extensionMonths),
			})
			const { data } = await apiClient.get(`/memberships/number/${encodeURIComponent(updateForm.membershipNumber.trim().toUpperCase())}`)
			setLoadedMembership(data.data)
			setSuccess(updateForm.action === 'cancel' ? 'Membership cancelled.' : 'Membership extended.')
			refreshMemberships()
		} catch (err) {
			setError(err?.response?.data?.message || 'Update failed.')
		}
	}

	const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none placeholder:text-slate-400";
	const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

	return (
		<PageShell title="Membership Management" links={[{ to: '/admin/users', label: 'Users' }]}>
			<div className="max-w-7xl mx-auto space-y-6">
				
				{/* Notifications */}
				{(error || success) && (
					<div className={`p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
						<p className="text-sm font-medium flex items-center gap-2">
							{error ? '⚠️ ' : '✅ '} {error || success}
						</p>
					</div>
				)}

				<section className="grid gap-6 lg:grid-cols-12 items-start">
					
					{/* Add Form */}
					<div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
						<div className="bg-slate-50 border-b border-slate-200 p-4">
							<h2 className="font-bold text-slate-800">Add New Member</h2>
						</div>
						<form onSubmit={handleCreate} className="p-5 space-y-4">
							<div>
								<label className={labelClass}>Membership ID</label>
								<input type="text" value={addForm.membershipNumber} onChange={(e) => setAddForm(p => ({ ...p, membershipNumber: e.target.value.toUpperCase() }))} placeholder="e.g. GOLD-001" className={inputClass} required />
							</div>
							<div>
								<label className={labelClass}>Full Name</label>
								<input type="text" value={addForm.name} onChange={(e) => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className={inputClass} required />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className={labelClass}>Price (Rs)</label>
									<input type="number" value={addForm.price} onChange={(e) => setAddForm(p => ({ ...p, price: e.target.value }))} placeholder="2999" className={inputClass} required />
								</div>
								<div>
									<label className={labelClass}>Duration</label>
									<select value={addForm.durationMonths} onChange={(e) => setAddForm(p => ({ ...p, durationMonths: Number(e.target.value) }))} className={inputClass}>
										{termOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
									</select>
								</div>
							</div>
							<div>
								<label className={labelClass}>Features</label>
								<textarea value={addForm.features} onChange={(e) => setAddForm(p => ({ ...p, features: e.target.value }))} placeholder="Gym, Pool, Yoga..." className={`${inputClass} min-h-[100px] resize-none`} required />
							</div>
							<button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm">
								Save Membership
							</button>
						</form>
					</div>

					{/* Update Form */}
					<div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
						<div className="bg-slate-50 border-b border-slate-200 p-4">
							<h2 className="font-bold text-slate-800">Update Status</h2>
						</div>
						<div className="p-5 space-y-6">
							<form onSubmit={handleLoadMembership} className="flex gap-2">
								<input type="text" value={updateForm.membershipNumber} onChange={(e) => setUpdateForm(p => ({ ...p, membershipNumber: e.target.value.toUpperCase() }))} placeholder="Member ID" className={inputClass} />
								<button type="submit" className="bg-slate-800 text-white px-4 rounded-lg font-medium text-sm hover:bg-slate-900">Load</button>
							</form>

							{loadedMembership && (
								<div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-2 text-sm">
									<div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800">{loadedMembership.name}</span></div>
									<div className="flex justify-between"><span className="text-slate-500">Expires:</span> <span className="font-semibold text-slate-800">{loadedMembership.endDate ? new Date(loadedMembership.endDate).toLocaleDateString() : '-'}</span></div>
									<div className="flex justify-center pt-2">
										<span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${loadedMembership.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>{loadedMembership.status}</span>
									</div>
								</div>
							)}

							<form onSubmit={handleUpdateMembership} className="space-y-4">
								<div className="flex p-1 bg-slate-100 rounded-lg">
									<button type="button" onClick={() => setUpdateForm(p => ({...p, action: 'extend'}))} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${updateForm.action === 'extend' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>EXTEND</button>
									<button type="button" onClick={() => setUpdateForm(p => ({...p, action: 'cancel'}))} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${updateForm.action === 'cancel' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}>CANCEL</button>
								</div>

								{updateForm.action === 'extend' && (
									<div>
										<label className={labelClass}>Extension Period</label>
										<select value={updateForm.extensionMonths} onChange={(e) => setUpdateForm(p => ({ ...p, extensionMonths: Number(e.target.value) }))} className={inputClass}>
											{termOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
										</select>
									</div>
								)}

								<button type="submit" className={`w-full font-bold py-2.5 rounded-lg transition-all ${updateForm.action === 'cancel' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
									Confirm {updateForm.action === 'extend' ? 'Extension' : 'Cancellation'}
								</button>
							</form>
						</div>
					</div>

					{/* List Area */}
					<div className="lg:col-span-4 space-y-4 h-[800px] overflow-y-auto pr-2 custom-scrollbar">
						<h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Active Memberships ({memberships.length})</h2>
						{memberships.map((m) => (
							<article key={m._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex justify-between items-start mb-3">
									<div>
										<h3 className="font-bold text-slate-900 leading-tight">{m.name}</h3>
										<code className="text-[10px] text-slate-400 font-mono">{m.membershipNumber}</code>
									</div>
									<span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${m.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{m.status}</span>
								</div>
								
								<div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
									<p>💰 <span className="font-medium text-slate-700">Rs {m.price}</span></p>
									<p>🗓️ <span className="font-medium text-slate-700">{formatTerm(m.durationMonths)}</span></p>
									<p className="col-span-2 text-[11px]">⌛ Exp: {m.endDate ? new Date(m.endDate).toLocaleDateString() : '-'}</p>
								</div>

								<div className="flex flex-wrap gap-1">
									{m.features?.map((f) => (
										<span key={f} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] border border-slate-200">{f}</span>
									))}
								</div>
							</article>
						))}
						{memberships.length === 0 && (
							<div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
								<p className="text-slate-400 text-sm">No memberships found.</p>
							</div>
						)}
					</div>

				</section>
			</div>
		</PageShell>
	)
}

export default MembershipManagement