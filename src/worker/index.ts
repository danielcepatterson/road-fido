import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

/**
 * Google Calendar API endpoint to exchange OAuth code for tokens
 */
app.post("/api/auth/google-callback", async (c) => {
	const { code } = await c.req.json();

	if (!code) {
		return c.json({ error: "Missing authorization code" }, 400);
	}

	try {
		const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				code,
				client_id: c.env.GOOGLE_CLIENT_ID,
				client_secret: c.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: c.env.GOOGLE_REDIRECT_URI,
				grant_type: "authorization_code",
			}).toString(),
		});

		if (!tokenResponse.ok) {
			const error = await tokenResponse.text();
			return c.json({ error: `Google auth failed: ${error}` }, 400);
		}

		const tokens = await tokenResponse.json();
		return c.json(tokens);
	} catch (error) {
		console.error("Auth error:", error);
		return c.json({ error: "Authentication failed" }, 500);
	}
});

/**
 * Endpoint to refresh Google access token using refresh token
 */
app.post("/api/auth/refresh-token", async (c) => {
	const { refreshToken } = await c.req.json();

	if (!refreshToken) {
		return c.json({ error: "Missing refresh token" }, 400);
	}

	try {
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: c.env.GOOGLE_CLIENT_ID,
				client_secret: c.env.GOOGLE_CLIENT_SECRET,
				refresh_token: refreshToken,
				grant_type: "refresh_token",
			}).toString(),
		});

		if (!response.ok) {
			return c.json({ error: "Token refresh failed" }, 400);
		}

		const tokens = await response.json();
		return c.json(tokens);
	} catch (error) {
		console.error("Token refresh error:", error);
		return c.json({ error: "Token refresh failed" }, 500);
	}
});

/**
 * Endpoint to create Google Calendar event
 */
app.post("/api/calendar/create-event", async (c) => {
	const { accessToken, event } = await c.req.json();

	if (!accessToken || !event) {
		return c.json({ error: "Missing accessToken or event data" }, 400);
	}

	try {
		const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(event),
		});

		if (!response.ok) {
			const error = await response.text();
			return c.json({ error: `Failed to create event: ${error}` }, 400);
		}

		const createdEvent = await response.json();
		return c.json(createdEvent);
	} catch (error) {
		console.error("Event creation error:", error);
		return c.json({ error: "Failed to create event" }, 500);
	}
});

/**
 * Endpoint to create multiple calendar events (for entire run)
 */
app.post("/api/calendar/create-run-events", async (c) => {
	const { accessToken, events } = await c.req.json();

	if (!accessToken || !events) {
		return c.json({ error: "Missing accessToken or events data" }, 400);
	}

	try {
		const results = [];
		for (const event of events) {
			const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(event),
			});

			if (response.ok) {
				const createdEvent = await response.json();
				results.push({ success: true, event: createdEvent });
			} else {
				const error = await response.text();
				results.push({ success: false, error });
			}
		}

		return c.json({ results });
	} catch (error) {
		console.error("Batch event creation error:", error);
		return c.json({ error: "Failed to create events" }, 500);
	}
});

export default app;
