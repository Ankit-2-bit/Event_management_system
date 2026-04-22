import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const defaultGuest = {
	name: '',
	email: '',
	phone: '',
}

function GuestList() {
	const [guest, setGuest] = useState(defaultGuest)
	const [guests, setGuests] = useState([])
	const [error, setError] = useState('')

	const refreshGuests = async () => {
		try {
			const { data } = await apiClient.get('/user/guests')
			setGuests(data.data)
		} catch {
			setError('Unable to fetch guest list.')
		}
	}

	useEffect(() => {
		let ignore = false
		const loadInitialGuests = async () => {
			try {
				const { data } = await apiClient.get('/user/guests')
				if (!ignore) setGuests(data.data)
			} catch {
				if (!ignore) setError('Unable to fetch guest list.')
			}
		}
		loadInitialGuests()
		return () => { ignore = true }
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			await apiClient.post('/user/guests', guest)
			setGuest(defaultGuest)
			refreshGuests()
		} catch {
			setError('Unable to add guest right now.')
		}
	}

	const handleDelete = async (guestId) => {
		try {
			await apiClient.delete(`/user/guests/${guestId}`)
			refreshGuests()
		} catch {
			setError('Unable to delete guest.')
		}
	}

	const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none placeholder:text-slate-400";
	const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

	return (
		<PageShell
			title="Guest List Management"
			links={[
				{ to: '/user/vendors', label: 'Vendor' },
				{ to: '/user/cart', label: 'Cart' },
				{ to: '/user/order-status', label: 'Order Status' },
			]}
		>
			<div className="max-w-6xl mx-auto">
				<section className="grid gap-8 lg:grid-cols-12 items-start">
					
					{/* Add Guest Form */}
					<div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
						<div className="bg-slate-50 border-b border-slate-200 p-4">
							<h2 className="font-bold text-slate-800 uppercase tracking-tight">Add New Guest</h2>
						</div>
						<form onSubmit={handleSubmit} className="p-5 space-y-4">
							<div>
								<label className={labelClass}>Full Name</label>
								<input
									value={guest.name}
									onChange={(e) => setGuest((p) => ({ ...p, name: e.target.value }))}
									className={inputClass}
									placeholder="e.g. Jane Smith"
									required
								/>
							</div>

							<div>
								<label className={labelClass}>Email Address</label>
								<input
									type="email"
									value={guest.email}
									onChange={(e) => setGuest((p) => ({ ...p, email: e.target.value }))}
									className={inputClass}
									placeholder="jane@example.com"
								/>
							</div>

							<div>
								<label className={labelClass}>Phone Number</label>
								<input
									value={guest.phone}
									onChange={(e) => setGuest((p) => ({ ...p, phone: e.target.value }))}
									className={inputClass}
									placeholder="+1 (555) 000-0000"
								/>
							</div>

							<button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98]">
								Add to List
							</button>
						</form>
					</div>

					{/* Guests List Area */}
					<div className="lg:col-span-8 space-y-4">
						<div className="flex items-center justify-between px-2">
							<h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Confirmed Guests ({guests.length})</h2>
							{error && <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">⚠️ {error}</span>}
						</div>

						<div className="grid gap-3">
							{guests.map((item) => (
								<article key={item._id} className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm uppercase">
											{item.name.charAt(0)}
										</div>
										<div>
											<h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
											<div className="flex gap-4 mt-0.5">
												{item.email && (
													<span className="text-xs text-slate-500 flex items-center gap-1">
														📧 {item.email}
													</span>
												)}
												{item.phone && (
													<span className="text-xs text-slate-500 flex items-center gap-1">
														📞 {item.phone}
													</span>
												)}
											</div>
										</div>
									</div>

									<button
										type="button"
										onClick={() => handleDelete(item._id)}
										className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100"
									>
										Remove
									</button>
								</article>
							))}

							{guests.length === 0 && (
								<div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
									<div className="text-3xl mb-2">👥</div>
									<p className="text-slate-400 text-sm font-medium">Your guest list is currently empty.</p>
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</PageShell>
	)
}

export default GuestList