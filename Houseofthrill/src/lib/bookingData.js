const bookingApiBase = () =>
  (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');

const ACTIVITIES_TTL_MS = 5 * 60 * 1000;
const SLOTS_TTL_MS = 60 * 1000;

let activitiesCache = null;
let activitiesInflight = null;

const slotsCache = new Map();
const slotsInflight = new Map();

function slotsKey(activityId, date) {
  return `${activityId}:${date}`;
}

async function fetchActivitiesFromApi() {
  const res = await fetch(`${bookingApiBase()}/api/activities`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load activities');
  }
  return res.json();
}

export async function getActivities({ force = false } = {}) {
  const now = Date.now();
  if (!force && activitiesCache && now - activitiesCache.at < ACTIVITIES_TTL_MS) {
    return activitiesCache.data;
  }

  if (!force && activitiesInflight) {
    return activitiesInflight;
  }

  activitiesInflight = fetchActivitiesFromApi()
    .then((data) => {
      activitiesCache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      activitiesInflight = null;
    });

  return activitiesInflight;
}

export function primeActivities(data) {
  if (!Array.isArray(data)) return;
  activitiesCache = { data, at: Date.now() };
}

export async function getSlots({ activityId, date, force = false } = {}) {
  const key = slotsKey(activityId, date);
  const now = Date.now();
  const cached = slotsCache.get(key);

  if (!force && cached && now - cached.at < SLOTS_TTL_MS) {
    return cached.data;
  }

  if (!force && slotsInflight.has(key)) {
    return slotsInflight.get(key);
  }

  const params = new URLSearchParams({ activityId: String(activityId), date });
  const request = fetch(`${bookingApiBase()}/api/bookings/slots?${params.toString()}`)
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to fetch slots');
      }
      return res.json();
    })
    .then((data) => {
      slotsCache.set(key, { data, at: Date.now() });
      return data;
    })
    .finally(() => {
      slotsInflight.delete(key);
    });

  slotsInflight.set(key, request);
  return request;
}

export function invalidateSlots(activityId, date) {
  slotsCache.delete(slotsKey(activityId, date));
}

export function prefetchBookingPageData() {
  return getActivities().catch(() => null);
}

export { bookingApiBase };
