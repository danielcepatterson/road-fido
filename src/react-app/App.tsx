// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";
import CalendarView from "./CalendarView";
import { DocumentManager, Document } from "./DocumentManager";

type Transaction = { type: 'income' | 'expense'; description: string; amount: number };
type DayType = 'Travel' | 'Show' | 'OFF' | 'Travel/Show' | '';
type Run = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  transactions: Transaction[];
  dayTypes?: Record<string, DayType>;
  dayTimes?: Record<string, string>;
  showPays?: Record<string, string>;
  gasEstimates?: Record<string, string>;
  venues?: Record<string, string>;
  venueCities?: Record<string, string>;
  venueAddresses?: Record<string, string>;
  venueContacts?: Record<string, string>;
  supportBands?: Record<string, string>;
  lodgingAccommodations?: Record<string, string>;
  lodgingAddresses?: Record<string, string>;
  hostNames?: Record<string, string>;
  passcodes?: Record<string, string>;
  vehicles?: Record<string, string>;
  headCounts?: Record<string, string>;
  loadInTimes?: Record<string, string>;
  soundcheckTimes?: Record<string, string>;
  loadInNotes?: Record<string, string>;
  loadInParking?: Record<string, string>;
  loadInContact?: Record<string, string>;
  vanCall?: Record<string, string>;
  arrivalTime?: Record<string, string>;
  hospitality?: Record<string, string>;
  ticketLink?: Record<string, string>;
  ticketCost?: Record<string, string>;
  merchSales?: Record<string, string>;
  numberOfSets?: Record<string, string>;
  travelFrom?: Record<string, string>;
  travelTo?: Record<string, string>;
  documents?: Document[];
};

interface EditRunsPageProps {
  runs: Run[];
  setRuns: React.Dispatch<React.SetStateAction<Run[]>>;
  selectedRunId: string | null;
  setSelectedRunId: React.Dispatch<React.SetStateAction<string | null>>;
}

function EditRunsPage({ runs, setRuns, selectedRunId, setSelectedRunId }: EditRunsPageProps) {
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

const handleVenueCityChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				venueCities: { ...run.venueCities, [date]: value },
			}
			: run
	));
};

const handleVenueAddressChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				venueAddresses: { ...run.venueAddresses, [date]: value },
			}
			: run
	));
};

const handleVenueContactChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				venueContacts: { ...run.venueContacts, [date]: value },
			}
			: run
	));
};

const handleSupportBandChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				supportBands: { ...run.supportBands, [date]: value },
			}
			: run
	));
};

const handleLodgingAccommodationChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				lodgingAccommodations: { ...run.lodgingAccommodations, [date]: value },
			}
			: run
	));
};

const handleVehicleChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				vehicles: { ...run.vehicles, [date]: value },
			}
			: run
	));
};

const handleHeadCountChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				headCounts: { ...run.headCounts, [date]: value },
			}
			: run
	));
};

const handleLodgingAddressChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				lodgingAddresses: { ...run.lodgingAddresses, [date]: value },
			}
			: run
	));
};

const handleHostNameChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				hostNames: { ...run.hostNames, [date]: value },
			}
			: run
	));
};

const handlePasscodeChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				passcodes: { ...run.passcodes, [date]: value },
			}
			: run
	));
};

const handleLoadInTimeChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				loadInTimes: { ...run.loadInTimes, [date]: value },
			}
			: run
	));
};

const handleSoundcheckTimeChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				soundcheckTimes: { ...run.soundcheckTimes, [date]: value },
			}
			: run
	));
};

const handleLoadInNotesChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				loadInNotes: { ...run.loadInNotes, [date]: value },
			}
			: run
	));
};

const handleLoadInParkingChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				loadInParking: { ...run.loadInParking, [date]: value },
			}
			: run
	));
};

const handleLoadInContactChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				loadInContact: { ...run.loadInContact, [date]: value },
			}
			: run
	));
};

const handleVanCallChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				vanCall: { ...run.vanCall, [date]: value },
			}
			: run
	));
};

const handleArrivalTimeChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				arrivalTime: { ...run.arrivalTime, [date]: value },
			}
			: run
	));
};

const handleHospitalityChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				hospitality: { ...run.hospitality, [date]: value },
			}
			: run
	));
};

const handleTicketLinkChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				ticketLink: { ...run.ticketLink, [date]: value },
			}
			: run
	));
};

const handleTicketCostChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				ticketCost: { ...run.ticketCost, [date]: value },
			}
			: run
	));
};

const handleMerchSalesChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				merchSales: { ...run.merchSales, [date]: value },
			}
			: run
	));
};

const handleNumberOfSetsChange = (date: string, value: string) => {
	if (!selectedRun) return;
	setRuns((prev: Run[]) => prev.map(run =>
		run.id === selectedRun.id
			? {
				...run,
				numberOfSets: { ...run.numberOfSets, [date]: value },
			}
			: run
	));
};

  // State is managed in App, not here
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
	const [newRunTitle, setNewRunTitle] = useState('');
	const [newRunStartDate, setNewRunStartDate] = useState('');
	const [newRunEndDate, setNewRunEndDate] = useState('');
	const [expandedShowDetails, setExpandedShowDetails] = useState<Record<string, boolean>>({});
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

	const selectedRun = runs.find((r: Run) => r.id === selectedRunId) || null;

	const handleCreateRun = (e: React.FormEvent<HTMLFormElement>) => {
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


	const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
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

	const total = selectedRun ? selectedRun.transactions.reduce((sum: number, t: Transaction) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0) : 0;
	const runDates = selectedRun ? getRunDates(selectedRun) : [];
	const txByDate = selectedRun ? groupTransactionsByDate(selectedRun.transactions) : {};

	return (
		<>
			<h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
				Road Fido <span role="img" aria-label="running dog" style={{ fontSize: '1.2em' }}>🐕‍🦺🏃‍♂️</span> <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 8 }}>(Edit Runs Page)</span>
			</h1>
			{/* ...existing code for run creation and selection... */}
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
												{(dayType === 'Show' || dayType === 'Travel/Show') && (
													<div style={{ marginBottom: 6 }}>
														<label style={{ fontSize: 12 }}>
															🎬 Load-in Time:
															<input
																type="time"
																value={selectedRun?.loadInTimes?.[date] || ''}
																onChange={e => handleLoadInTimeChange(date, e.target.value)}
																style={{ marginLeft: 4, width: 90 }}
															/>
														</label>
													</div>
												)}
												{(dayType === 'Show' || dayType === 'Travel/Show') && (
													<div style={{ marginBottom: 8, padding: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
														<button
															onClick={() => setExpandedShowDetails(prev => ({ ...prev, [date]: !prev[date] }))}
															style={{
																width: '100%',
																padding: 6,
																marginBottom: 8,
																backgroundColor: 'rgba(100, 150, 255, 0.3)',
																color: '#fff',
																border: '1px solid rgba(100, 150, 255, 0.5)',
																borderRadius: 3,
																cursor: 'pointer',
																fontSize: 11,
																fontWeight: 'bold',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'space-between',
															}}
														>
															<span>📋 Show Details</span>
															<span>{expandedShowDetails[date] ? '▼' : '▶'}</span>
														</button>
														
														{expandedShowDetails[date] && (
															<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
																<div>
																	<label style={{ fontSize: 11 }}>🎵 Soundcheck:</label>
																	<input type="time" value={selectedRun?.soundcheckTimes?.[date] || ''} onChange={e => handleSoundcheckTimeChange(date, e.target.value)} style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>🎸 # of Sets:</label>
																	<input type="number" min="0" value={selectedRun?.numberOfSets?.[date] || ''} onChange={e => handleNumberOfSetsChange(date, e.target.value)} placeholder="1" style={{ marginLeft: 4, width: '70%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>📝 Load-in Notes:</label>
																	<input type="text" value={selectedRun?.loadInNotes?.[date] || ''} onChange={e => handleLoadInNotesChange(date, e.target.value)} placeholder="Notes" style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>🚗 Parking:</label>
																	<input type="text" value={selectedRun?.loadInParking?.[date] || ''} onChange={e => handleLoadInParkingChange(date, e.target.value)} placeholder="Parking info" style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>📞 Load-in Contact:</label>
																	<input type="text" value={selectedRun?.loadInContact?.[date] || ''} onChange={e => handleLoadInContactChange(date, e.target.value)} placeholder="Phone/Name" style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>🚐 Van Call:</label>
																	<input type="time" value={selectedRun?.vanCall?.[date] || ''} onChange={e => handleVanCallChange(date, e.target.value)} style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>⏰ Arrival Time:</label>
																	<input type="time" value={selectedRun?.arrivalTime?.[date] || ''} onChange={e => handleArrivalTimeChange(date, e.target.value)} style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>🍽️ Hospitality:</label>
																	<input type="text" value={selectedRun?.hospitality?.[date] || ''} onChange={e => handleHospitalityChange(date, e.target.value)} placeholder="Details" style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>🎟️ Ticket Link:</label>
																	<input type="text" value={selectedRun?.ticketLink?.[date] || ''} onChange={e => handleTicketLinkChange(date, e.target.value)} placeholder="URL" style={{ marginLeft: 4, width: '90%', fontSize: 11 }} />
																</div>
																
																<div>
																	<label style={{ fontSize: 11 }}>💵 Ticket Cost:</label>
																	<input type="number" min="0" value={selectedRun?.ticketCost?.[date] || ''} onChange={e => handleTicketCostChange(date, e.target.value)} placeholder="$" style={{ marginLeft: 4, width: '70%', fontSize: 11 }} />
																</div>
																
																<div style={{ gridColumn: '1 / -1' }}>
																	<label style={{ fontSize: 11 }}>🎤 Merch Sales:</label>
																	<input type="text" value={selectedRun?.merchSales?.[date] || ''} onChange={e => handleMerchSalesChange(date, e.target.value)} placeholder="Notes/Amount" style={{ marginLeft: 4, width: '100%', fontSize: 11 }} />
																</div>
															</div>
														)}
													</div>
												)}
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
																<span style={{ fontWeight: 'bold' }}>Venue:</span>
																<input
																	type="text"
																	value={selectedRun?.venues?.[date] || ''}
																	onChange={e => handleVenueChange(date, e.target.value)}
																	placeholder="Venue name"
																	style={{ marginLeft: 8, width: 85, fontSize: 12 }}
																/>
															</li>
															<li style={{ fontSize: 13, marginBottom: 2 }}>
																<span style={{ fontSize: 11 }}>City:</span>
																<input
																	type="text"
																	value={selectedRun?.venueCities?.[date] || ''}
																	onChange={e => handleVenueCityChange(date, e.target.value)}
																	placeholder="City"
																	style={{ marginLeft: 8, width: 70, fontSize: 12 }}
																/>
															</li>
															<li style={{ fontSize: 13, marginBottom: 2 }}>
																<span style={{ fontSize: 11 }}>Address:</span>
																<input
																	type="text"
																	value={selectedRun?.venueAddresses?.[date] || ''}
																	onChange={e => handleVenueAddressChange(date, e.target.value)}
																	placeholder="Address"
																	style={{ marginLeft: 8, width: 70, fontSize: 12 }}
																/>
															</li>
															<li style={{ fontSize: 13, marginBottom: 2 }}>
																<span style={{ fontSize: 11 }}>Contact:</span>
																<input
																	type="text"
																	value={selectedRun?.venueContacts?.[date] || ''}
																	onChange={e => handleVenueContactChange(date, e.target.value)}
																	placeholder="Phone/Email"
																	style={{ marginLeft: 8, width: 70, fontSize: 12 }}
																/>
															</li>
															<li style={{ fontSize: 13, marginBottom: 2 }}>
																<span style={{ fontSize: 11 }}>Support/Post:</span>
																<input
																	type="text"
																	value={selectedRun?.supportBands?.[date] || ''}
																	onChange={e => handleSupportBandChange(date, e.target.value)}
																	placeholder="Band names"
																	style={{ marginLeft: 8, width: 70, fontSize: 12 }}
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
													<li style={{ fontSize: 13, marginBottom: 2 }}>
														<span style={{ fontSize: 11 }}>🛏️ Lodging:</span>
														<input
															type="text"
															value={selectedRun?.lodgingAccommodations?.[date] || ''}
															onChange={e => handleLodgingAccommodationChange(date, e.target.value)}
															placeholder="Hotel/Motel"
															style={{ marginLeft: 8, width: 70, fontSize: 12 }}
														/>
													</li>
													<li style={{ fontSize: 13, marginBottom: 2 }}>
														<span style={{ fontSize: 11 }}>📍 Lodging Address:</span>
														<input
															type="text"
															value={selectedRun?.lodgingAddresses?.[date] || ''}
															onChange={e => handleLodgingAddressChange(date, e.target.value)}
															placeholder="Address"
															style={{ marginLeft: 8, width: 70, fontSize: 12 }}
														/>
													</li>
													<li style={{ fontSize: 13, marginBottom: 2 }}>
														<span style={{ fontSize: 11 }}>👤 Host Name:</span>
														<input
															type="text"
															value={selectedRun?.hostNames?.[date] || ''}
															onChange={e => handleHostNameChange(date, e.target.value)}
															placeholder="Host name"
															style={{ marginLeft: 8, width: 70, fontSize: 12 }}
														/>
													</li>
													<li style={{ fontSize: 13, marginBottom: 2 }}>
														<span style={{ fontSize: 11 }}>🔐 Passcode:</span>
														<input
															type="text"
															value={selectedRun?.passcodes?.[date] || ''}
															onChange={e => handlePasscodeChange(date, e.target.value)}
															placeholder="Code/Instructions"
															style={{ marginLeft: 8, width: 70, fontSize: 12 }}
														/>
													</li>
													<li style={{ fontSize: 13, marginBottom: 2 }}>
														<span style={{ fontSize: 11 }}>🚐 Vehicle:</span>
														<input
															type="text"
															value={selectedRun?.vehicles?.[date] || ''}
															onChange={e => handleVehicleChange(date, e.target.value)}
															placeholder="Vehicle type"
															style={{ marginLeft: 8, width: 70, fontSize: 12 }}
														/>
													</li>
													<li style={{ fontSize: 13, marginBottom: 2 }}>
														<span style={{ fontSize: 11 }}>👥 Head Count:</span>
														<input
															type="number"
															min="0"
															value={selectedRun?.headCounts?.[date] || ''}
															onChange={e => handleHeadCountChange(date, e.target.value)}
															placeholder="# people"
															style={{ marginLeft: 8, width: 50, fontSize: 12 }}
														/>
													</li>
													{(txByDate[date] || []).map(t => (
														<li key={t.description + t.amount} style={{ color: t.type === 'income' ? 'lightgreen' : 'salmon', fontSize: 13 }}>
															<strong>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</strong> {t.description.replace(/^\d{4}-\d{2}-\d{2}:/, '')}
														</li>
													))}
												</ul>
												<DocumentManager
													date={date}
													documents={selectedRun?.documents || []}
													onAddDocument={(doc) => {
														if (!selectedRun) return;
														setRuns((prev: Run[]) => prev.map(run =>
															run.id === selectedRun.id
																? {
																	...run,
																	documents: [...(run.documents || []), doc],
																}
																: run
														));
													}}
													onRemoveDocument={(docId) => {
														if (!selectedRun) return;
														setRuns((prev: Run[]) => prev.map(run =>
															run.id === selectedRun.id
																? {
																	...run,
																	documents: (run.documents || []).filter(d => d.id !== docId),
																}
																: run
														));
													}}
												/>
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
														<td>
															<input
																type="text"
																value={t.description}
																onChange={e => {
																	const newDesc = e.target.value;
																	setRuns((prev: Run[]) => prev.map(run =>
																		run.id === selectedRun.id
																			? {
																					...run,
																					transactions: run.transactions.map((tx, j) =>
																						j === i ? { ...tx, description: newDesc } : tx
																					),
																				}
																			: run
																	));
																}}
																style={{ width: '90%', fontSize: 14 }}
															/>
														</td>
														<td style={{ textAlign: 'right', color: t.type === 'income' ? 'lightgreen' : 'salmon' }}>
															{t.type === 'expense' ? '-' : ''}${t.amount.toFixed(2)}
														</td>
														<td>{date}</td>
														<td>
															<button
																style={{ color: 'red', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}
																title="Delete"
																onClick={() => {
																	setRuns((prev: Run[]) => prev.map(run =>
																		run.id === selectedRun.id
																			? {
																					...run,
																					transactions: run.transactions.filter((_, j) => j !== i)
																				}
																			: run
																	));
																}}
															>
																✕
															</button>
														</td>
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

// Main App with page switcher
export default function App() {
	const [runs, setRuns] = useState<Run[]>(() => {
		const saved = localStorage.getItem('runs');
		return saved ? JSON.parse(saved) : [];
	});
	const [selectedRunId, setSelectedRunId] = useState<string | null>(() => {
		const saved = localStorage.getItem('selectedRunId');
		return saved || null;
	});
	useEffect(() => {
		localStorage.setItem('runs', JSON.stringify(runs));
	}, [runs]);
	useEffect(() => {
		if (selectedRunId) localStorage.setItem('selectedRunId', selectedRunId);
	}, [selectedRunId]);
	const selectedRun = runs.find((r: Run) => r.id === selectedRunId) || null;
	const [page, setPage] = useState<'edit' | 'calendar'>('edit');

	return (
		<div>
			<div style={{ display: 'flex', gap: 12, margin: '16px 0', justifyContent: 'center' }}>
				<button onClick={() => setPage('edit')} style={{ fontWeight: page === 'edit' ? 'bold' : undefined }}>Edit Runs Page</button>
				<button onClick={() => setPage('calendar')} style={{ fontWeight: page === 'calendar' ? 'bold' : undefined }}>Calendar View</button>
			</div>
			{page === 'edit' ? (
				<EditRunsPage
					runs={runs}
					setRuns={setRuns}
					selectedRunId={selectedRunId}
					setSelectedRunId={setSelectedRunId}
				/>
			) : (
				selectedRun ? <CalendarView run={selectedRun} /> : <div className="card">Please select a run to view the calendar.</div>
			)}
		</div>
	);
}
