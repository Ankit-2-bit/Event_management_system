import React from 'react'
import { Link } from 'react-router-dom'

const roleCards = [
	{
		title: 'Admin',
		description: 'Maintain users, vendors, memberships, and overall platform operations.',
		to: '/login?role=admin',
	},
	{
		title: 'Vendor',
		description: 'Add products, receive requests, and update order execution status.',
		to: '/login?role=vendor',
	},
	{
		title: 'User',
		description: 'Browse vendors, build cart, manage guests, and track your event order.',
		to: '/login?role=user',
	},
]

function Index() {
	return (
		<div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-xl border border-slate-300 bg-slate-200 p-6 shadow-lg">
				<header className="space-y-3">
					<div className="rounded-md bg-blue-600 px-6 py-4 text-center text-lg font-semibold text-white sm:text-2xl">
						Event Management System
					</div>
					<p className="text-center text-sm text-slate-700 sm:text-base">
						Plan and manage users, vendors, guest lists, cart checkout, and order status in one place.
					</p>
				</header>

				<section className="grid gap-4 md:grid-cols-3">
					{roleCards.map((card) => (
						<article
							key={card.title}
							className="rounded-xl border border-blue-300 bg-blue-600/90 p-5 text-white shadow-md"
						>
							<h2 className="text-xl font-semibold">{card.title}</h2>
							<p className="mt-2 text-sm text-blue-100">{card.description}</p>
							<Link
								to={card.to}
								className="mt-5 inline-flex rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
							>
								Continue as {card.title}
							</Link>
						</article>
					))}
				</section>

				<section className="flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white p-4 text-center sm:flex-row">
					<span className="text-sm text-slate-700">Create account:</span>
					<Link
						to="/user/signup"
						className="rounded-md bg-blue-500 px-5 py-2 text-sm font-semibold text-white"
					>
						User Sign Up
					</Link>
					<Link
						to="/vendor/signup"
						className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
					>
						Vendor Sign Up
					</Link>
				</section>
			</div>
		</div>
	)
}

export default Index
