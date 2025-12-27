// src/App.tsx

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);
	const [name, setName] = useState("unknown");

	// State for transactions
	const [transactions, setTransactions] = useState<Array<{ type: 'income' | 'expense'; description: string; amount: number }>>([]);
	const [form, setForm] = useState<{ type: 'income' | 'expense'; description: string; amount: string }>({
		type: 'expense',
		description: '',
		amount: '',
	});

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddTransaction = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.description || !form.amount || isNaN(Number(form.amount))) return;
		setTransactions((prev) => [
			{ type: form.type, description: form.description, amount: Number(form.amount) },
			...prev,
		]);
		setForm({ type: 'expense', description: '', amount: '' });
	};

	const total = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

	return (
		<>
			<h1>Road Trip Income & Expense Tracker</h1>
			<form className="card" onSubmit={handleAddTransaction} style={{ marginBottom: 24 }}>
				<select name="type" value={form.type} onChange={handleFormChange} style={{ marginRight: 8 }}>
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>
				<input
					name="description"
					placeholder="Description"
					value={form.description}
					onChange={handleFormChange}
					style={{ marginRight: 8 }}
					required
				/>
				<input
					name="amount"
					placeholder="Amount"
					type="number"
					value={form.amount}
					onChange={handleFormChange}
					min="0.01"
					step="0.01"
					required
					style={{ marginRight: 8, width: 100 }}
				/>
				<button type="submit">Add</button>
			</form>

			<div className="card" style={{ textAlign: 'left' }}>
				<h2>Transactions</h2>
				{transactions.length === 0 ? (
					<p>No transactions yet.</p>
				) : (
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{transactions.map((t, i) => (
							<li key={i} style={{ color: t.type === 'income' ? 'lightgreen' : 'salmon', marginBottom: 4 }}>
								<strong>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</strong> — {t.description}
							</li>
						))}
					</ul>
				)}
				<h3>Total: ${total.toFixed(2)}</h3>
			</div>
		</>
	);
}

export default App;
