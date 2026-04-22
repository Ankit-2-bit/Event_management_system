import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function VendorDashboard() {
	const [stats, setStats] = useState({ products: 0, requests: 0, pendingOrders: 0 })
	const [profileImage, setProfileImage] = useState('')
	const [phone, setPhone] = useState('')
	const [category, setCategory] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)
	const [updating, setUpdating] = useState(false)

	// ✅ Fetch Dashboard + Profile Data
	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				const { data } = await apiClient.get('/vendor/dashboard')
				setStats(data.data)
			} catch (err) {
				console.error('Dashboard error:', err)
				setStats({ products: 0, requests: 0, pendingOrders: 0 })
			}
		}

		const fetchProfile = async () => {
			try {
				const { data } = await apiClient.get('/vendor/profile')
				setProfileImage(data.profileImage || '')
				setPhone(data.phone || '')
				setCategory(data.category || '')
			} catch (err) {
				console.error('Profile fetch error:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchDashboard()
		fetchProfile()
	}, [])

	// ✅ Handle Profile Update
	const handleUpdateProfile = async () => {
		try {
			setError('')
			setMessage('')

			if (!profileImage && !phone && !category) {
				setError('Please fill at least one field to update.')
				return
			}

			// ✅ Phone validation
			if (phone && !/^\+?\d{10,15}$/.test(phone)) {
				setError('Enter a valid phone number.')
				return
			}

			setUpdating(true)

			await apiClient.patch('/vendor/profile', {
				profileImage: profileImage || undefined,
				phone: phone || undefined,
				category: category || undefined,
			})

			setMessage('Profile updated successfully!')
		} catch (err) {
			setError(err?.response?.data?.message || 'Unable to update profile.')
		} finally {
			setUpdating(false)
		}
	}

	// ✅ Loading UI
	if (loading) {
		return (
			<PageShell title="Welcome Vendor">
				<p className="text-center text-slate-600">Loading dashboard...</p>
			</PageShell>
		)
	}

	return (
		<PageShell
			title="Welcome Vendor"
			links={[
				{ to: '/vendor/products', label: 'Your Item' },
				{ to: '/vendor/request-item', label: 'Request Item' },
				{ to: '/vendor/product-status', label: 'Product Status' },
			]}
		>
			{/* ✅ Stats Section */}
			<section className="grid gap-4 md:grid-cols-3">
				<article className="rounded-md bg-blue-600 p-5 text-white">
					<p className="text-sm text-blue-100">Products</p>
					<p className="text-2xl font-bold">{stats.products}</p>
				</article>

				<article className="rounded-md bg-blue-600 p-5 text-white">
					<p className="text-sm text-blue-100">Request Items</p>
					<p className="text-2xl font-bold">{stats.requests}</p>
				</article>

				<article className="rounded-md bg-blue-600 p-5 text-white">
					<p className="text-sm text-blue-100">Pending Orders</p>
					<p className="text-2xl font-bold">{stats.pendingOrders}</p>
				</article>
			</section>

			{/* ✅ Navigation Section */}
			<section className="grid gap-4 md:grid-cols-3">
				<Link
					to="/vendor/products"
					className="rounded-md border border-slate-300 bg-white p-5 text-center font-semibold text-slate-800"
				>
					Manage Products
				</Link>

				<Link
					to="/vendor/request-item"
					className="rounded-md border border-slate-300 bg-white p-5 text-center font-semibold text-slate-800"
				>
					Raise Request
				</Link>

				<Link
					to="/vendor/product-status"
					className="rounded-md border border-slate-300 bg-white p-5 text-center font-semibold text-slate-800"
				>
					View Status
				</Link>
			</section>

			{/* ✅ Profile Update Section */}
			<section className="rounded-md border border-slate-300 bg-white p-6">
				<h2 className="text-lg font-semibold text-slate-800">Update Your Profile</h2>
				<p className="mt-1 text-sm text-slate-600">
					Add or update your profile image, phone, and category
				</p>

				{error && (
					<p className="mt-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
						{error}
					</p>
				)}

				{message && (
					<p className="mt-3 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">
						{message}
					</p>
				)}

				<div className="mt-4 space-y-4">
					<div>
						<label className="block text-sm font-semibold text-slate-700">
							Profile Image URL
						</label>
						<input
							type="text"
							placeholder="https://example.com/image.jpg"
							value={profileImage}
							onChange={(e) => setProfileImage(e.target.value)}
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-slate-700">
							Phone Number
						</label>
						<input
							type="tel"
							placeholder="+91 9876543210"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-slate-700">
							Category
						</label>
						<input
							type="text"
							placeholder="e.g., Catering, Photography, Venue"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
						/>
					</div>

					<button
						type="button"
						onClick={handleUpdateProfile}
						disabled={updating}
						className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
					>
						{updating ? 'Updating...' : 'Update Profile'}
					</button>
				</div>
			</section>
		</PageShell>
	)
}

export default VendorDashboard