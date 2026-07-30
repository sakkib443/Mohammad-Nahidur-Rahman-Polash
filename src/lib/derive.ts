/**
 * Values shown on the page but not stored — computed from `birthDate` so the
 * age never goes stale the way a hard-coded "33 years" would.
 */

export function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const monthDiff = now.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < born.getDate())) {
    age -= 1;
  }
  return age >= 0 && age < 130 ? age : null;
}

export function formatBirthDate(birthDate: string): string {
  if (!birthDate) return "";
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return birthDate;
  return born.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function birthYear(birthDate: string): string {
  if (!birthDate) return "";
  const born = new Date(birthDate);
  return Number.isNaN(born.getTime())
    ? ""
    : String(born.getUTCFullYear());
}
