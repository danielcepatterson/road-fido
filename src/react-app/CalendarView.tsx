import { useState, useEffect } from "react";
import "./App.css";

// ...copy all types and helpers from App.tsx...

// This is a read-only calendar view for a run
export default function CalendarView({ run }: { run: any }) {
  // Helper: get all dates in the run as array of strings (YYYY-MM-DD)
  function getRunDates(run: any): string[] {
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
  function getDayTypeColor(type: string): string {
    switch (type) {
      case 'Show': return '#1e7e34';
      case 'Travel': return '#ffc107';
      case 'OFF': return '#007bff';
      case 'Travel/Show': return '#b8860b';
      default: return '#222';
    }
  }
  // Group transactions by date (assume description starts with date, e.g. '2025-12-27: ...')
  function groupTransactionsByDate(transactions: any[]): Record<string, any[]> {
    const map: Record<string, any[]> = {};
    for (const t of transactions) {
      const match = t.description.match(/^(\d{4}-\d{2}-\d{2}):/);
      const date = match ? match[1] : 'other';
      if (!map[date]) map[date] = [];
      map[date].push(t);
    }
    return map;
  }
  const runDates = getRunDates(run);
  const txByDate = groupTransactionsByDate(run.transactions);
  return (
    <div>
      <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {run.title} <span role="img" aria-label="calendar" style={{ fontSize: '1.2em' }}>📅</span>
      </h1>
      <div className="card" style={{ marginBottom: 16, textAlign: 'left' }}>
        <div style={{ fontWeight: 'bold' }}>Run Dates: {run.startDate} to {run.endDate}</div>
      </div>
      <div className="card" style={{ textAlign: 'left' }}>
        <h2>Calendar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {runDates.map(date => {
            const dayType = run.dayTypes?.[date] || '';
            const dayTime = run.dayTimes?.[date] || '';
            const showPay = run.showPays?.[date] ?? '200';
            const gasExpense = run.gasEstimates?.[date] ?? '75';
            const venue = run.venues?.[date] || '';
            const from = run.travelFrom?.[date] || '';
            const to = run.travelTo?.[date] || '';
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
                <div style={{ marginBottom: 6, fontSize: 13 }}>
                  {dayType && <span style={{ fontWeight: 'bold' }}>{dayType}</span>}
                  {dayTime && <span style={{ marginLeft: 8 }}>Start: {dayTime}</span>}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(dayType === 'Show' || dayType === 'Travel/Show') && (
                    <>
                      <li style={{ color: 'lightgreen', fontSize: 13, marginBottom: 2 }}>
                        <strong>+${Number(showPay).toFixed(2)}</strong> Show Pay
                        {venue && <span style={{ marginLeft: 8 }}>@ {venue}</span>}
                      </li>
                    </>
                  )}
                  {dayType === 'Travel' && (
                    <>
                      <li style={{ color: 'salmon', fontSize: 13, marginBottom: 2 }}>
                        <strong>-${Number(gasExpense).toFixed(2)}</strong> Estimated Gas
                        {(from || to) && <span style={{ marginLeft: 8 }}>{from} to {to}</span>}
                      </li>
                    </>
                  )}
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
      </div>
    </div>
  );
}
