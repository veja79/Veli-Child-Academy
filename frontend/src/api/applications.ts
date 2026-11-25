const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

export interface ApplicationForm {
  childFirstName: string;
  childLastName: string;
  childBirthDate: string;
  grade: string;
  startYear: number;
  previousSchool: string;
  parentName: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  consent: boolean;
}

/** Thrown when the backend rejects some fields. */
export class FieldErrors extends Error {
  constructor(public fields: Record<string, string>) {
    super('Please check the highlighted fields');
  }
}

/** Returns the application's reference number. */
export async function submitApplication(form: ApplicationForm): Promise<number> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}));
    throw new FieldErrors(body.fields ?? {});
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return ((await res.json()) as { reference: number }).reference;
}
