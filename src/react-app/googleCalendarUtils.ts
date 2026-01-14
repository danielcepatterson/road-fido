/**
 * Google Calendar OAuth utilities
 */

// Get Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Determine the correct redirect URI based on environment
const REDIRECT_URI = (() => {
	// For production, use the actual domain
	// For local development, use localhost:5173
	if (typeof window !== "undefined") {
		const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
		if (isDev) {
			return "http://localhost:5173/auth/callback";
		}
		return `${window.location.origin}/auth/callback`;
	}
	return "http://localhost:5173/auth/callback";
})();

/**
 * Validate that Client ID is configured
 */
export function validateGoogleConfig(): { isValid: boolean; error?: string } {
	if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "") {
		return {
			isValid: false,
			error: "Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env.local",
		};
	}
	if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
		return {
			isValid: false,
			error: "Google Client ID is not set. Please update your .env.local file",
		};
	}
	return { isValid: true };
}

/**
 * Generate Google OAuth login URL
 */
export function getGoogleAuthUrl(): string {
	const validation = validateGoogleConfig();
	if (!validation.isValid) {
		throw new Error(validation.error);
	}

	const params = new URLSearchParams({
		client_id: GOOGLE_CLIENT_ID!,
		redirect_uri: REDIRECT_URI,
		response_type: "code",
		scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
		access_type: "offline",
		prompt: "consent",
	});

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Debug helper - logs current configuration (safe to expose as it doesn't log secrets)
 */
export function getDebugInfo(): string {
	return `Google OAuth Config:
- Client ID: ${GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 10) + "..." : "NOT SET"}
- Redirect URI: ${REDIRECT_URI}
- Environment: ${import.meta.env.MODE}`;
}

/**
 * Exchange auth code for tokens via worker
 */
export async function exchangeAuthCode(code: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
	const response = await fetch("/api/auth/google-callback", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code }),
	});

	if (!response.ok) {
		throw new Error("Failed to exchange auth code");
	}

	const data = await response.json();
	return {
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresIn: data.expires_in,
	};
}

/**
 * Refresh access token via worker
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
	const response = await fetch("/api/auth/refresh-token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken }),
	});

	if (!response.ok) {
		throw new Error("Failed to refresh token");
	}

	const data = await response.json();
	return {
		accessToken: data.access_token,
		expiresIn: data.expires_in,
	};
}

/**
 * Create a single calendar event
 */
export async function createCalendarEvent(
	accessToken: string,
	event: {
		summary: string;
		description?: string;
		start: { date?: string; dateTime?: string; timeZone?: string };
		end: { date?: string; dateTime?: string; timeZone?: string };
		location?: string;
	}
): Promise<any> {
	const response = await fetch("/api/calendar/create-event", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ accessToken, event }),
	});

	if (!response.ok) {
		throw new Error("Failed to create calendar event");
	}

	return response.json();
}

/**
 * Create multiple calendar events for a run
 */
export async function createRunCalendarEvents(
	accessToken: string,
	runData: {
		title: string;
		startDate: string;
		endDate: string;
		dayTypes?: Record<string, string>;
		dayTimes?: Record<string, string>;
		venues?: Record<string, string>;
		travelFrom?: Record<string, string>;
		travelTo?: Record<string, string>;
		showPays?: Record<string, number>;
	}
): Promise<any> {
	const events = [];
	const dates: string[] = [];
	let d = new Date(runData.startDate);
	const end = new Date(runData.endDate);

	// Generate all dates in range
	while (d <= end) {
		dates.push(d.toISOString().slice(0, 10));
		d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
	}

	// Create events for each date
	for (const date of dates) {
		const dayType = runData.dayTypes?.[date] || "Run Day";
		const dayTime = runData.dayTimes?.[date] || "09:00";
		const venue = runData.venues?.[date] || "";
		const travelFrom = runData.travelFrom?.[date] || "";
		const travelTo = runData.travelTo?.[date] || "";
		const showPay = runData.showPays?.[date];

		let summary = `${runData.title} - ${dayType}`;
		if (venue) {
			summary += ` @ ${venue}`;
		}

		let description = `Date: ${date}\n`;
		description += `Type: ${dayType}\n`;

		if (dayType === "Show" || dayType === "Travel/Show") {
			description += `Show Pay: $${showPay || 200}\n`;
		}
		if (dayType === "Travel" || dayType === "Travel/Show") {
			description += `Travel: ${travelFrom} to ${travelTo}\n`;
		}

		// Parse time - assume format like "14:30"
		const [hours, minutes] = dayTime.split(":").map(Number);
		const eventStart = new Date(date);
		eventStart.setHours(hours || 9, minutes || 0, 0);

		const eventEnd = new Date(eventStart);
		eventEnd.setHours(eventEnd.getHours() + 2); // 2-hour default duration

		events.push({
			summary,
			description: description.trim(),
			start: {
				dateTime: eventStart.toISOString(),
				timeZone: "America/Chicago",
			},
			end: {
				dateTime: eventEnd.toISOString(),
				timeZone: "America/Chicago",
			},
			location: venue,
		});
	}

	const response = await fetch("/api/calendar/create-run-events", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ accessToken, events }),
	});

	if (!response.ok) {
		throw new Error("Failed to create run events");
	}

	return response.json();
}

/**
 * Store tokens in localStorage
 */
export function storeTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
	localStorage.setItem("google_access_token", accessToken);
	localStorage.setItem("google_refresh_token", refreshToken);
	localStorage.setItem("google_token_expires_at", expiresAt.toString());
}

/**
 * Retrieve tokens from localStorage
 */
export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null; expiresAt: number | null } {
	return {
		accessToken: localStorage.getItem("google_access_token"),
		refreshToken: localStorage.getItem("google_refresh_token"),
		expiresAt: localStorage.getItem("google_token_expires_at") ? Number(localStorage.getItem("google_token_expires_at")) : null,
	};
}

/**
 * Clear stored tokens
 */
export function clearTokens(): void {
	localStorage.removeItem("google_access_token");
	localStorage.removeItem("google_refresh_token");
	localStorage.removeItem("google_token_expires_at");
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: number | null): boolean {
	if (!expiresAt) return true;
	return Date.now() >= expiresAt;
}
