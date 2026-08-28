import { getAccessToken } from './googleAuth';

export interface CalendarOfficeEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
}

/**
 * Fetch upcoming office calendar events
 */
export const listCalendarEvents = async (): Promise<CalendarOfficeEvent[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=10&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to fetch Google Calendar events');
  }

  const data = await res.json();
  return data.items || [];
};

/**
 * Add a Matatu Departure & Office Exit slot event into Google Calendar
 */
export const createCommuteCalendarEvent = async (params: {
  vehicleName: string;
  route: string;
  pickupStage: string;
  destinationStage: string;
  seatNumber: number;
  departureTimeStr: string;
}): Promise<CalendarOfficeEvent> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const now = new Date();
  const startTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins from now
  const endTime = new Date(startTime.getTime() + 45 * 60 * 1000); // 45 min ride

  const eventBody = {
    summary: `🐟🚌 Urban Fishstick: Boarding ${params.vehicleName} (${params.route})`,
    description: `Nairobi Commute Guaranteed Booking\nSeat #${params.seatNumber}\nPickup: ${params.pickupStage}\nDestination: ${params.destinationStage}\n\n100% M-Pesa refund automatically protects your fare if delayed at the office.`,
    start: {
      dateTime: startTime.toISOString()
    },
    end: {
      dateTime: endTime.toISOString()
    },
    location: `${params.pickupStage}, Nairobi`,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 5 },
        { method: 'popup', minutes: 15 }
      ]
    }
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventBody)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to create Google Calendar event');
  }

  return await res.json();
};

/**
 * Delete / Cancel a calendar commute event
 */
export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to delete Google Calendar event');
  }
};
