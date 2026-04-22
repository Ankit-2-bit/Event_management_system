import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const initialForm = {
	name: '',
	email: '',
	password: '',
	phone: '',
}

function UserSignup() {
	const [form, setForm] = useState(initialForm)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const { registerUser, loading } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setMessage('')

		try {
			await registerUser(form)
			setMessage('User account created successfully. Please login to continue.')
			setForm(initialForm)
			setTimeout(() => navigate('/login?role=user'), 900)
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to create user account.')
		}
	}

	return (
		<div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8">
			<div className="mx-auto w-full max-w-4xl rounded-xl border border-slate-300 bg-slate-200 p-6 shadow-lg">
				<div className="rounded-md bg-blue-600 px-6 py-4 text-center text-lg font-semibold text-white sm:text-2xl">
					User Registration
				</div>

				<form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
					<input
						value={form.name}
						onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
						placeholder="Name"
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						required
					/>

					<input
						type="email"
						value={form.email}
						onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
						placeholder="Email"
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						required
					/>

					<input
						type="password"
						minLength={6}
						value={form.password}
						onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
						placeholder="Password"
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						required
					/>

					<input
						value={form.phone}
						onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
						placeholder="Phone Number"
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
					/>

					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 md:col-span-2">{error}</p>}
					{message && (
						<p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700 md:col-span-2">{message}</p>
					)}

					<div className="flex flex-wrap gap-3 md:col-span-2">
						<Link
							to="/"
							className="rounded-md border border-slate-400 bg-slate-300 px-5 py-2 font-medium text-slate-700"
						>
							Back
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-60"
						>
							{loading ? 'Submitting...' : 'Sign Up'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default UserSignup
