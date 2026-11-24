import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { sendContactMessage, type ContactMessage } from '../api/announcements';
import { school, telHref } from '../content/school';

const empty: ContactMessage = { name: '', email: '', phone: '', subject: 'Registration', message: '', consent: false };

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Until the backend is live, messages go by WhatsApp or email instead. */
function messageText(f: ContactMessage) {
  const lines = [`Hello ${school.name}, my name is ${f.name}.`, `Subject: ${f.subject}`, '', f.message.trim(), '', `Email: ${f.email}`];
  if (f.phone) lines.push(`Phone: ${f.phone}`);
  return lines.join('\n');
}

const whatsappNumber = '27' + school.phones[0].replace(/\s/g, '').replace(/^0/, '');

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
      <PageHero title="Contact & registration">
        Questions about registration, fees or after-school classes? Send us a message and we'll get back to you.
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
                <option>Registration</option>
                <option>After-school classes</option>
                <option>Robotics &amp; computer classes</option>
                <option>Fees</option>
                <option>Donations</option>
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
                Protection of Personal Information Act (POPIA). See our <Link to="/privacy">privacy policy</Link>. *
              </span>
            </label>

            <button className="btn btn--sun" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'sent' && <p className="notice notice--ok" role="status">Thank you. We'll be in touch soon.</p>}
            {status === 'error' && (
              <div className="notice notice--info" role="status">
                <p>
                  <strong>Almost done.</strong> Tap below to send your message to the school, or call us on {school.phones[0]}.
                </p>
                <div className="fallback">
                  <a className="btn btn--whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText(form))}`} target="_blank" rel="noreferrer">
                    Send on WhatsApp
                  </a>
                  {school.email && (
                    <a className="btn btn--outline" href={`mailto:${school.email}?subject=${encodeURIComponent(form.subject + ' enquiry')}&body=${encodeURIComponent(messageText(form))}`}>
                      Send by email
                    </a>
                  )}
                </div>
              </div>
            )}
          </form>

          <aside className="stack">
            <div className="card">
              <h2>Call or visit</h2>
              {school.phones.map((p) => (
                <p key={p}><a href={telHref(p)}>{p}</a></p>
              ))}
              {school.email && <p><a href={`mailto:${school.email}`}>{school.email}</a></p>}
              <p>{school.address.join(', ')}</p>
              {school.hours && <p>{school.hours}</p>}
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
