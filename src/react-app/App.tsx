// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";

function App() {
	// ...existing code...


	type Transaction = { type: 'income' | 'expense'; description: string; amount: number };
	type DayType = 'Travel' | 'Show' | 'OFF' | 'Travel/Show' | '';
	type Run = {
		id: string;
		title: string;
		startDate: string;
		endDate: string;
		transactions: Transaction[];
		dayTypes?: Record<string, DayType>;
		dayTimes?: Record<string, string>; // date -> time string (e.g. '08:00')
		showPays?: Record<string, string>; // date -> show pay
		gasEstimates?: Record<string, string>; // date -> gas estimate
		venues?: Record<string, string>; // date -> venue name
		travelFrom?: Record<string, string>; // date -> from location
		travelTo?: Record<string, string>; // date -> to location
	};
const handleVenueChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				venues: { ...run.venues, [date]: value },
			}
			: run
	));
};

const handleTravelFromChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				travelFrom: { ...run.travelFrom, [date]: value },
			}
			: run
	));
};

const handleTravelToChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				travelTo: { ...run.travelTo, [date]: value },
			}
			: run
	));
};
const handleShowPayChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				showPays: { ...run.showPays, [date]: value },
			}
			: run
	));
};

const handleGasEstimateChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				gasEstimates: { ...run.gasEstimates, [date]: value },
			}
			: run
	));
};
const handleDayTimeChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				dayTimes: { ...run.dayTimes, [date]: value },
			}
			: run
	));
};

	const [runs, setRuns] = useState<Run[]>(() => {
		const saved = localStorage.getItem('runs');
		return saved ? JSON.parse(saved) : [];
	});
	const handleDayTypeChange = (date: string, value: DayType) => {
		if (!selectedRun) return;
		setRuns((prev: Run[]) => prev.map(run =>
			run.id === selectedRun.id
				? {
						...run,
						dayTypes: { ...run.dayTypes, [date]: value },
					}
				: run
		));
	};

	function getDayTypeColor(type: DayType): string {
		switch (type) {
			case 'Show': return '#1e7e34'; // green
			case 'Travel': return '#ffc107'; // yellow
			case 'OFF': return '#007bff'; // blue
			case 'Travel/Show': return '#b8860b'; // dark yellow/gold
			default: return '#222';
		}
	}
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
		if (!newRunTitle.trim()) return;
		const id = Date.now().toString();
		const newRun: Run = {
			id,
			title: newRunTitle.trim(),
			startDate: newRunStartDate,
			endDate: newRunEndDate,
			transactions: []
		};
		setRuns(prev => [newRun, ...prev]);
		setSelectedRunId(id);
		setNewRunTitle('');
		setNewRunStartDate('');
		setNewRunEndDate('');
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



	// Helper: get all dates in the run as array of strings (YYYY-MM-DD)
	function getRunDates(run: Run): string[] {
		if (!run.startDate || !run.endDate) return [];
		const dates: string[] = [];
		let d = new Date(run.startDate);
		const end = new Date(run.endDate);
		while (d <= end) {
			dates.push(d.toISOString().slice(0, 10));
			d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
		}
		return dates;
	}

	// Group transactions by date (assume description starts with date, e.g. '2025-12-27: ...')
	function groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
		const map: Record<string, Transaction[]> = {};
		for (const t of transactions) {
			const match = t.description.match(/^(\d{4}-\d{2}-\d{2}):/);
			const date = match ? match[1] : 'other';
			if (!map[date]) map[date] = [];
			map[date].push(t);
		}
		return map;
	}

	const total = selectedRun ? selectedRun.transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0) : 0;
	const runDates = selectedRun ? getRunDates(selectedRun) : [];
	const txByDate = selectedRun ? groupTransactionsByDate(selectedRun.transactions) : {};

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
												<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
													<label>
														Start:
														<input
															type="date"
															value={selectedRun.startDate}
															onChange={e => {
																const newDate = e.target.value;
																setRuns((prev: Run[]) => prev.map(run =>
																	run.id === selectedRun.id
																		? { ...run, startDate: newDate }
																		: run
																));
															}}
															style={{ marginLeft: 6 }}
														/>
													</label>
													<label>
														End:
														<input
															type="date"
															value={selectedRun.endDate}
															onChange={e => {
																const newDate = e.target.value;
																setRuns((prev: Run[]) => prev.map(run =>
																	run.id === selectedRun.id
																		? { ...run, endDate: newDate }
																		: run
																));
															}}
															style={{ marginLeft: 6 }}
														/>
													</label>
												</div>
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
								<h2>Calendar for: {selectedRun.title}</h2>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
									{runDates.map(date => {
										const dayType = selectedRun?.dayTypes?.[date] || '';
										const dayTime = selectedRun?.dayTimes?.[date] || '';
										// Show pay and gas expense (user configurable)
										const showPay = selectedRun?.showPays?.[date] ?? '200';
										const gasExpense = selectedRun?.gasEstimates?.[date] ?? '75';
										// autoLine is no longer needed; logic is handled inline below
										return (
											<div
												key={date}
												style={{
													border: '1px solid #444',
													borderRadius: 8,
													padding: 8,
													minHeight: 140,
													background: getDayTypeColor(dayType),
													color: dayType === 'Travel' || dayType === 'Travel/Show' ? '#222' : '#fff',
													transition: 'background 0.2s',
												}}
											>
												<div style={{ fontWeight: 'bold', marginBottom: 4 }}>{date}</div>
												<select
													value={dayType}
													onChange={e => handleDayTypeChange(date, e.target.value as DayType)}
													style={{ marginBottom: 6, width: '100%' }}
												>
													<option value="">-- Mark Day --</option>
													<option value="Travel">Travel</option>
													<option value="Show">Show</option>
													<option value="OFF">OFF</option>
													<option value="Travel/Show">Travel/Show</option>
												</select>
												<div style={{ marginBottom: 6 }}>
													<label style={{ fontSize: 12 }}>
														{dayType === 'Show' ? 'Load-in Time:' : dayType === 'Travel' ? 'Travel Start:' : dayType === 'Travel/Show' ? 'Travel/Load-in:' : 'Time:'}
														<input
															type="time"
															value={dayTime}
															onChange={e => handleDayTimeChange(date, e.target.value)}
															style={{ marginLeft: 4, width: 90 }}
														/>
													</label>
													{dayTime && (
														<div style={{ fontSize: 12, marginTop: 2 }}>
															<strong>Start:</strong> {dayTime}
														</div>
													)}
												</div>
												<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
													{dayType === 'Show' || dayType === 'Travel/Show' ? (
														<>
															<li style={{ color: 'lightgreen', fontSize: 13, marginBottom: 2 }}>
																<strong>+${Number(showPay).toFixed(2)}</strong> Show Pay
																<input
																	type="number"
																	min="0"
																	step="1"
																	value={showPay}
																	onChange={e => handleShowPayChange(date, e.target.value)}
																	style={{ marginLeft: 8, width: 60, fontSize: 12 }}
																/>
															</li>
															<li style={{ fontSize: 13, marginBottom: 2 }}>
																<span>Venue:</span>
																<input
																	type="text"
																	value={selectedRun?.venues?.[date] || ''}
																	onChange={e => handleVenueChange(date, e.target.value)}
																	placeholder="Venue name"
																	style={{ marginLeft: 8, width: 90, fontSize: 12 }}
																/>
															</li>
														</>
													) : null}
													{dayType === 'Travel' ? (
														<>
															<li style={{ color: 'salmon', fontSize: 13, marginBottom: 2 }}>
																<strong>-${Number(gasExpense).toFixed(2)}</strong> Estimated Gas
																<input
																	type="number"
																	min="0"
																	step="1"
																	value={gasExpense}
																	onChange={e => handleGasEstimateChange(date, e.target.value)}
																	style={{ marginLeft: 8, width: 60, fontSize: 12 }}
																/>
															</li>
															<li style={{ fontSize: 13, marginBottom: 2 }}>
																<span>From:</span>
																<input
																	type="text"
																	value={selectedRun?.travelFrom?.[date] || ''}
																	onChange={e => handleTravelFromChange(date, e.target.value)}
																	placeholder="Start"
																	style={{ marginLeft: 4, width: 60, fontSize: 12 }}
																/>
																<span style={{ margin: '0 4px' }}>to</span>
																<input
																	type="text"
																	value={selectedRun?.travelTo?.[date] || ''}
																	onChange={e => handleTravelToChange(date, e.target.value)}
																	placeholder="Destination"
																	style={{ width: 60, fontSize: 12 }}
																/>
															</li>
														</>
													) : null}
													{(txByDate[date] || []).map(t => (
														<li key={t.description + t.amount} style={{ color: t.type === 'income' ? 'lightgreen' : 'salmon', fontSize: 13 }}>
															<strong>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</strong> {t.description.replace(/^\d{4}-\d{2}-\d{2}:/, '')}
														</li>
													))}
												</ul>
											</div>
										);
									})}
								</div>
								<h3 style={{ marginTop: 16 }}>Total: ${total.toFixed(2)}</h3>

								{/* Summary Table of all income, expenses, and net */}
								<div className="card" style={{ marginTop: 24, textAlign: 'left' }}>
									<h2>Summary Table</h2>
									<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
										<thead>
											<tr>
												<th style={{ borderBottom: '1px solid #888', textAlign: 'left' }}>Type</th>
												<th style={{ borderBottom: '1px solid #888', textAlign: 'left' }}>Description</th>
												<th style={{ borderBottom: '1px solid #888', textAlign: 'right' }}>Amount</th>
												<th style={{ borderBottom: '1px solid #888', textAlign: 'left' }}>Date</th>
											</tr>
										</thead>
										<tbody>
											{/* Show pay and gas estimates from calendar */}
											{runDates.map(date => {
												const dayType = selectedRun?.dayTypes?.[date] || '';
												const showPay = selectedRun?.showPays?.[date] ?? '200';
												const gasExpense = selectedRun?.gasEstimates?.[date] ?? '75';
												const venue = selectedRun?.venues?.[date] || '';
												const from = selectedRun?.travelFrom?.[date] || '';
												const to = selectedRun?.travelTo?.[date] || '';
												const rows = [];
												if (dayType === 'Show' || dayType === 'Travel/Show') {
													rows.push({
														type: 'Income',
														desc: `Show Pay${venue ? ' @ ' + venue : ''}`,
														amt: Number(showPay),
														date,
													});
												}
												if (dayType === 'Travel') {
													rows.push({
														type: 'Expense',
														desc: `Estimated Gas${from || to ? ` (${from} to ${to})` : ''}`,
														amt: -Number(gasExpense),
														date,
													});
												}
												return rows.map((row, i) => (
													<tr key={date + row.type + i}>
														<td>{row.type}</td>
														<td>{row.desc}</td>
														<td style={{ textAlign: 'right', color: row.type === 'Income' ? 'lightgreen' : 'salmon' }}>
															{row.amt < 0 ? '-' : ''}${Math.abs(row.amt).toFixed(2)}
														</td>
														<td>{row.date}</td>
													</tr>
												));
											})}
											{/* User-entered transactions */}
											{selectedRun?.transactions.map((t, i) => {
												// Try to extract date from description
												const match = t.description.match(/^(\d{4}-\d{2}-\d{2}):/);
												const date = match ? match[1] : '';
												return (
													<tr key={i + t.description}>
														<td>{t.type === 'income' ? 'Income' : 'Expense'}</td>
														<td>{t.description.replace(/^(\d{4}-\d{2}-\d{2}):/, '')}</td>
														<td style={{ textAlign: 'right', color: t.type === 'income' ? 'lightgreen' : 'salmon' }}>
															{t.type === 'expense' ? '-' : ''}${t.amount.toFixed(2)}
														</td>
														<td>{date}</td>
													</tr>
												);
											})}
										</tbody>
										<tfoot>
											<tr>
												<td colSpan={2} style={{ fontWeight: 'bold', textAlign: 'right' }}>Net:</td>
												<td style={{ fontWeight: 'bold', textAlign: 'right' }}>
													${(() => {
														let net = 0;
														runDates.forEach(date => {
															const dayType = selectedRun?.dayTypes?.[date] || '';
															const showPay = Number(selectedRun?.showPays?.[date] ?? '200');
															const gasExpense = Number(selectedRun?.gasEstimates?.[date] ?? '75');
															if (dayType === 'Show' || dayType === 'Travel/Show') net += showPay;
															if (dayType === 'Travel') net -= gasExpense;
														});
														if (selectedRun) {
															selectedRun.transactions.forEach(t => {
																net += t.type === 'income' ? t.amount : -t.amount;
															});
														}
														return net.toFixed(2);
													})()}
												</td>
												<td></td>
											</tr>
										</tfoot>
									</table>
								</div>
						</div>
				</>
			) : (
				<div className="card"><p>Please create and select a run to begin tracking.</p></div>
			)}
		</>
	);
}

export default App;
