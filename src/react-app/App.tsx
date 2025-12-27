// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";

function App() {
	// ...existing code...


	type Transaction = { type: 'income' | 'expense'; description: string; amount: number };
	type Lodging = { date: string; location: string; cost: string };
	type Run = {
		id: string;
		title: string;
		startDate: string;
		endDate: string;
		transactions: Transaction[];
		lodging: Lodging[];
	};

	const [runs, setRuns] = useState<Run[]>(() => {
		const saved = localStorage.getItem('runs');
		return saved ? JSON.parse(saved) : [];
	});
	const [selectedRunId, setSelectedRunId] = useState<string | null>(() => {
		const saved = localStorage.getItem('selectedRunId');
		return saved || null;
	});
	const [newRunTitle, setNewRunTitle] = useState('');
	const [newRunStartDate, setNewRunStartDate] = useState('');
	const [newRunEndDate, setNewRunEndDate] = useState('');
	const [form, setForm] = useState<{ type: 'income' | 'expense'; description: string; amount: string }>({
		type: 'expense',
		description: '',
		amount: '',
	});
	const [lodgingEdits, setLodgingEdits] = useState<Record<string, { location: string; cost: string }>>({});

	// Save runs and selectedRunId to localStorage
	useEffect(() => {
		localStorage.setItem('runs', JSON.stringify(runs));
	}, [runs]);
	useEffect(() => {
		if (selectedRunId) localStorage.setItem('selectedRunId', selectedRunId);
	}, [selectedRunId]);

	const selectedRun = runs.find(r => r.id === selectedRunId) || null;

	const handleCreateRun = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newRunTitle.trim() || !newRunStartDate || !newRunEndDate) return;
		// Generate lodging line items for each day in the range
		const start = new Date(newRunStartDate);
		const end = new Date(newRunEndDate);
		const lodging: Lodging[] = [];
		for (
			let d = new Date(start);
			d <= end;
			d = new Date(d.getTime() + 24 * 60 * 60 * 1000)
		) {
			lodging.push({ date: d.toISOString().slice(0, 10), location: '', cost: '' });
		}
		const id = Date.now().toString();
		const newRun: Run = {
			id,
			title: newRunTitle.trim(),
			startDate: newRunStartDate,
			endDate: newRunEndDate,
			transactions: [],
			lodging,
		};
		setRuns(prev => [newRun, ...prev]);
		setSelectedRunId(id);
		setNewRunTitle('');
		setNewRunStartDate('');
		setNewRunEndDate('');
	};
const handleLodgingChange = (date: string, field: 'location' | 'cost', value: string) => {
	setLodgingEdits(prev => ({
		...prev,
		[date]: {
			...prev[date],
			[field]: value,
		},
	}));
};

const handleSaveLodging = (date: string) => {
	if (!selectedRun) return;
	const edit = lodgingEdits[date];
	if (!edit) return;
	setRuns(prev => prev.map(run =>
		run.id === selectedRun.id
			? {
					...run,
					lodging: run.lodging.map(l =>
						l.date === date ? { ...l, ...edit } : l
					),
				}
			: run
	));
	setLodgingEdits(prev => {
		const { [date]: _, ...rest } = prev;
		return rest;
	});
};

	const handleSelectRun = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedRunId(e.target.value);
	};


	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};


	const handleAddTransaction = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.description || !form.amount || isNaN(Number(form.amount)) || !selectedRun) return;
		const tx: Transaction = { type: form.type, description: form.description, amount: Number(form.amount) };
		setRuns(prev => prev.map(run => run.id === selectedRun.id ? { ...run, transactions: [tx, ...run.transactions] } : run));
		setForm({ type: 'expense', description: '', amount: '' });
	};


	const total = selectedRun ? selectedRun.transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0) : 0;

	return (
		<>
			<h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
				Road Fido <span role="img" aria-label="running dog" style={{ fontSize: '1.2em' }}>🐕‍🦺🏃‍♂️</span>
			</h1>
			<form onSubmit={handleCreateRun} className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
				<input
					value={newRunTitle}
					onChange={e => setNewRunTitle(e.target.value)}
					placeholder="New Run Title"
					style={{ flex: 2, minWidth: 120 }}
					required
				/>
				<input
					type="date"
					value={newRunStartDate}
					onChange={e => setNewRunStartDate(e.target.value)}
					placeholder="Start Date"
					style={{ flex: 1, minWidth: 120 }}
					required
				/>
				<input
					type="date"
					value={newRunEndDate}
					onChange={e => setNewRunEndDate(e.target.value)}
					placeholder="End Date"
					style={{ flex: 1, minWidth: 120 }}
					required
				/>
				<button type="submit">Create Run</button>
			</form>
			<div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
				<label htmlFor="run-select">Select Run:</label>
				<select id="run-select" value={selectedRunId || ''} onChange={handleSelectRun} style={{ flex: 1 }}>
					<option value="" disabled>
						-- Choose a run --
					</option>
					{runs.map(run => (
						<option key={run.id} value={run.id}>{run.title}</option>
					))}
				</select>
			</div>
			{selectedRun ? (
				<>
					<div className="card" style={{ marginBottom: 16, textAlign: 'left' }}>
						<h2>{selectedRun.title}</h2>
						<div>Start: {selectedRun.startDate || 'N/A'}</div>
						<div>End: {selectedRun.endDate || 'N/A'}</div>
					</div>
					<div className="card" style={{ marginBottom: 16, textAlign: 'left' }}>
						<h3>Lodging by Day</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr>
									<th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Date</th>
									<th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Location</th>
									<th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Cost</th>
									<th style={{ borderBottom: '1px solid #ccc' }}></th>
								</tr>
							</thead>
							<tbody>
								{selectedRun.lodging.map(l => (
									<tr key={l.date}>
										<td>{l.date}</td>
										<td>
											<input
												type="text"
												value={lodgingEdits[l.date]?.location ?? l.location}
												onChange={e => handleLodgingChange(l.date, 'location', e.target.value)}
												placeholder="Lodging location"
												style={{ width: 140 }}
											/>
										</td>
										<td>
											<input
												type="number"
												value={lodgingEdits[l.date]?.cost ?? l.cost}
												onChange={e => handleLodgingChange(l.date, 'cost', e.target.value)}
												placeholder="Cost"
												min="0"
												step="0.01"
												style={{ width: 80 }}
											/>
										</td>
										<td>
											<button type="button" onClick={() => handleSaveLodging(l.date)} disabled={!(lodgingEdits[l.date]?.location || lodgingEdits[l.date]?.cost)}>
												Save
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
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
						<h2>Transactions for: {selectedRun.title}</h2>
						{selectedRun.transactions.length === 0 ? (
							<p>No transactions yet.</p>
						) : (
							<ul style={{ listStyle: 'none', padding: 0 }}>
								{selectedRun.transactions.map((t, i) => (
									<li key={i} style={{ color: t.type === 'income' ? 'lightgreen' : 'salmon', marginBottom: 4 }}>
										<strong>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</strong> — {t.description}
									</li>
								))}
							</ul>
						)}
						<h3>Total: ${total.toFixed(2)}</h3>
					</div>
				</>
			) : (
				<div className="card"><p>Please create and select a run to begin tracking.</p></div>
			)}
		</>
	);
}

export default App;
