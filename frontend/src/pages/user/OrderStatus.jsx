import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function OrderStatus() {
	const [orders, setOrders] = useState([])
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const { data } = await apiClient.get('/orders/my')
				setOrders(data.data)
			} catch {
				setError('Unable to fetch order statuses.')
			}
		}

		fetchOrders()
	}, [])

	// Helper to determine status badge colors
	const getStatusStyles = (status) => {
		const s = status.toLowerCase();
		if (s.includes('pending')) return 'bg-amber-50 text-amber-700 border-amber-100';
		if (s.includes('complete') || s.includes('delivered')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
		if (s.includes('cancel')) return 'bg-red-50 text-red-700 border-red-100';
		return 'bg-indigo-50 text-indigo-700 border-indigo-100'; // Processing/Shipping
	};

	return (
		<PageShell
			title="Track Your Orders"
			links={[
				{ to: '/user/vendors', label: 'Vendor' },
				{ to: '/user/cart', label: 'Cart' },
			]}
		>
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Error Toast */}
				{error && (
					<div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
						⚠️ {error}
					</div>
				)}

				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Order Ref</th>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Summary</th>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Total Amount</th>
									<th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
									<th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{orders.map((order) => (
									<tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
												#{order._id.slice(-8).toUpperCase()}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-slate-600 font-medium">
												{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm font-bold text-slate-900">
												Rs {order.totalAmount.toLocaleString()}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
												{order.status.replaceAll('_', ' ')}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">
											{new Date(order.createdAt).toLocaleDateString('en-US', { 
												month: 'short', 
												day: 'numeric', 
												year: 'numeric' 
											})}
										</td>
									</tr>
								))}

								{orders.length === 0 && (
									<tr>
										<td className="px-6 py-20 text-center" colSpan={5}>
											<div className="flex flex-col items-center gap-3">
												<div className="text-4xl">📦</div>
												<div className="space-y-1">
													<p className="text-sm font-bold text-slate-800">No orders yet</p>
													<p className="text-xs text-slate-500">Once you place an order, it will appear here.</p>
												</div>
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

export default OrderStatus