import { useState, useEffect } from "react";
import "./App.css";
import { 
  getGoogleAuthUrl, 
  exchangeAuthCode, 
  createRunCalendarEvents, 
  getStoredTokens, 
  isTokenExpired,
  refreshAccessToken,
  storeTokens,
  clearTokens 
} from "./googleCalendarUtils";

// ...copy all types and helpers from App.tsx....

// This is a read-only calendar view for a run
export default function CalendarView({ run }: { run: any }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // Check for authorization on mount and handle OAuth callback
  useEffect(() => {
    const checkAuth = async () => {
      // Check if we're in the OAuth callback flow
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          setIsLoading(true);
          const tokens = await exchangeAuthCode(code);
          const expiresAt = Date.now() + tokens.expiresIn * 1000;
          storeTokens(tokens.accessToken, tokens.refreshToken, expiresAt);
          setIsAuthorized(true);
          setExportStatus("✅ Successfully connected to Google Calendar!");
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error("OAuth error:", error);
          setExportStatus("❌ Failed to connect to Google Calendar");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Check if we have valid tokens
        const tokens = getStoredTokens();
        if (tokens.accessToken && !isTokenExpired(tokens.expiresAt)) {
          setIsAuthorized(true);
        }
      }
    };

    checkAuth();
  }, []);

  // Authorize with Google Calendar
  const handleAuthorize = () => {
    window.location.href = getGoogleAuthUrl();
  };

  // Export run to Google Calendar
  const handleExportToGoogle = async () => {
    setIsLoading(true);
    setExportStatus(null);

    try {
      let tokens = getStoredTokens();

      // Check if token needs refresh
      if (isTokenExpired(tokens.expiresAt)) {
        if (!tokens.refreshToken) {
          throw new Error("No refresh token available, please re-authorize");
        }
        const newTokens = await refreshAccessToken(tokens.refreshToken);
        const expiresAt = Date.now() + newTokens.expiresIn * 1000;
        storeTokens(newTokens.accessToken, tokens.refreshToken, expiresAt);
        tokens = { ...tokens, accessToken: newTokens.accessToken };
      }

      if (!tokens.accessToken) {
        throw new Error("No access token available");
      }

      setExportStatus("⏳ Exporting to Google Calendar...");
      const result = await createRunCalendarEvents(tokens.accessToken, run);

      const successCount = result.results.filter((r: any) => r.success).length;
      setExportStatus(`✅ Successfully exported ${successCount} events to Google Calendar!`);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus(`❌ Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setIsAuthorized(false);
    setExportStatus(null);
  };

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
      
      {/* Google Calendar Integration Section */}
      <div className="card" style={{ marginBottom: 16, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        {!isAuthorized ? (
          <div>
            <p style={{ marginBottom: 10 }}>Connect to Google Calendar to export this run's events</p>
            <button
              onClick={handleAuthorize}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              {isLoading ? '⏳ Connecting...' : '🔗 Connect Google Calendar'}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: 10, color: '#22863a' }}>✅ Connected to Google Calendar</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={handleExportToGoogle}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                {isLoading ? '⏳ Exporting...' : '📤 Export to Google Calendar'}
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
        {exportStatus && (
          <p style={{ marginTop: 12, fontSize: 14, color: exportStatus.includes('❌') ? '#d73a49' : '#22863a' }}>
            {exportStatus}
          </p>
        )}
      </div>

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
            const lodgingType = run.lodgingType?.[date] || '';
            const lodgingCost = run.lodgingCost?.[date] || '';
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
                  {/* Lodging line item */}
                  <li style={{ fontSize: 13, marginBottom: 2 }}>
                    <span style={{ fontWeight: 500 }}>Lodging:</span>
                    <span style={{ marginLeft: 6 }}>
                      {lodgingType ? (
                        <>
                          <span style={{ textTransform: 'capitalize' }}>{lodgingType}</span>
                          {lodgingCost && (
                            <span style={{ marginLeft: 8 }}>
                              <strong>${Number(lodgingCost).toFixed(2)}</strong>
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#aaa' }}>N/A</span>
                      )}
                    </span>
                  </li>
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
