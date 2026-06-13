const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function mapsUrl(lat: number, lng: number, label?: string): string {
  const query = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Parse decimal degrees or DMS strings like `60°25'26"N`. */
export function parseCoordinate(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/,/g, "");

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    const value = Number(normalized);
    return Number.isFinite(value) ? value : null;
  }

  const dmsMatch = normalized.match(
    /^(-?\d+(?:\.\d+)?)\s*(?:°|º|d|deg)?\s*(\d+(?:\.\d+)?)?\s*(?:'|′|m|min)?\s*(\d+(?:\.\d+)?)?\s*(?:"|″|s|sec)?\s*([NSEW])?\s*$/i
  );

  if (!dmsMatch) return null;

  const degrees = Math.abs(Number(dmsMatch[1]));
  const minutes = dmsMatch[2] ? Number(dmsMatch[2]) : 0;
  const seconds = dmsMatch[3] ? Number(dmsMatch[3]) : 0;
  const direction = dmsMatch[4]?.toUpperCase();

  if ([degrees, minutes, seconds].some((part) => Number.isNaN(part))) {
    return null;
  }

  let value = degrees + minutes / 60 + seconds / 3600;

  if (direction === "S" || direction === "W") {
    value = -value;
  } else if (normalized.startsWith("-")) {
    value = -value;
  }

  return Number.isFinite(value) ? value : null;
}
