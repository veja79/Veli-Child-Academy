import { useState, type FormEvent } from 'react';
import PageHero from '../components/PageHero';
import { sendContactMessage, type ContactMessage } from '../api/announcements';
import { school } from '../content/school';

const empty: ContactMessage = { name: '', email: '', phone: '', subject: 'Enrolment', message: '', consent: false };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [form, setForm] = useState<ContactMessage>(empty);
  const [status, setStatus] = useState<Status>('idle');

  function update<K extends keyof ContactMessage>(key: K, value: ContactMessage[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendContactMessage(form);
      setStatus('sent');
      setForm(empty);
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <PageHero title="Contact & enrolment">
        Questions about enrolment, fees or a visit? Send us a message and we'll get back to you.
      </PageHero>

      <section className="section">
        <div className="container grid grid--contact">
          <form className="card form" onSubmit={onSubmit} noValidate={false}>
            <div className="form__row">
              <label>
                Your name *
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" />
              </label>
              <label>
                Phone
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" />
              </label>
            </div>
            <label>
              Email *
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" />
            </label>
            <label>
              What is it about? *
              <select value={form.subject} onChange={(e) => update('subject', e.target.value)}>
                <option>Enrolment</option>
                <option>Book a visit</option>
                <option>Fees</option>
                <option>General question</option>
              </select>
            </label>
            <label>
              Message *
              <textarea required rows={5} maxLength={2000} value={form.message} onChange={(e) => update('message', e.target.value)} />
            </label>
            <label className="form__check">
              <input type="checkbox" required checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
              <span>
                I agree that {school.name} may use these details to respond to my enquiry, in line with the
                Protection of Personal Information Act (POPIA). *
              </span>
            </label>

            <button className="btn btn--sun" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'sent' && <p className="notice notice--ok" role="status">Thank you. We'll be in touch soon.</p>}
            {status === 'error' && (
              <p className="notice notice--error" role="alert">
                Sorry, the message couldn't be sent. Please call us on {school.phone} or email {school.email}.
              </p>
            )}
          </form>

          <aside className="stack">
            <div className="card">
              <h2>Call or visit</h2>
              <p><a href={`tel:${school.phone.replace(/\s/g, '')}`}>{school.phone}</a></p>
              <p><a href={`mailto:${school.email}`}>{school.email}</a></p>
              <p>{school.address.join(', ')}</p>
              <p>{school.hours}</p>
            </div>
            {school.mapEmbedUrl && (
              <iframe
                className="map"
                title={`Map to ${school.name}`}
                src={school.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
