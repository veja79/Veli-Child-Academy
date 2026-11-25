import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FieldErrors, submitApplication, type ApplicationForm } from '../api/applications';
import PageHero from '../components/PageHero';
import { registration, school, telHref, whatsappHref } from '../content/school';

const thisYear = new Date().getFullYear();
const startYears = [thisYear, thisYear + 1, thisYear + 2];

const empty = (): ApplicationForm => ({
  childFirstName: '', childLastName: '', childBirthDate: '', grade: 'Grade R',
  startYear: new Date().getMonth() >= 8 ? thisYear + 1 : thisYear,
  previousSchool: '', parentName: '', relationship: 'Mother', phone: '', email: '', address: '', notes: '', consent: false,
});

type Status = 'idle' | 'sending' | 'sent' | 'offline';

/** Plain-text summary used when the application has to go by WhatsApp instead. */
function summary(f: ApplicationForm) {
  const lines = (...items: (string | false)[]) => items.filter(Boolean).join('\n');
  return [
    `Hello ${school.name}, I would like to apply.`,
    lines(
      `Child: ${f.childFirstName} ${f.childLastName}`,
      `Date of birth: ${f.childBirthDate}`,
      `Grade: ${f.grade} (${f.startYear})`,
      !!f.previousSchool && `Current school: ${f.previousSchool}`,
    ),
    lines(
      `Parent/guardian: ${f.parentName} (${f.relationship})`,
      `Phone: ${f.phone}`,
      !!f.email && `Email: ${f.email}`,
      !!f.address && `Address: ${f.address}`,
      !!f.notes && `Notes: ${f.notes}`,
    ),
  ].join('\n\n');
}

export default function Register() {
  const [form, setForm] = useState<ApplicationForm>(empty);
  const [status, setStatus] = useState<Status>('idle');
  const [reference, setReference] = useState<number | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  function set<K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setFields({});
    try {
      setReference(await submitApplication(form));
      setStatus('sent');
    } catch (err) {
      if (err instanceof FieldErrors) {
        setFields(err.fields);
        setStatus('idle');
      } else {
        setStatus('offline');
      }
    }
  }

  const fieldError = (name: string) => fields[name] && <span className="field-error">{fields[name]}</span>;

  return (
    <>
      <PageHero title="Register your child">
        Registrations are open for {registration.grades.join(', ').replace(/, ([^,]*)$/, ' and $1')}. Apply online in a few minutes.
      </PageHero>

      <section className="section">
        <div className="container grid grid--contact">
          <div>
            {status === 'sent' ? (
              <div className="card success">
                <h2>Application received</h2>
                <p className="lead">
                  Thank you, {form.parentName.split(' ')[0]}. Your reference number is <strong>#{reference}</strong>.
                </p>
                <p>The school will contact you on {form.phone} to arrange a visit and the next steps.</p>
                <button className="btn btn--outline" onClick={() => { setForm(empty()); setStatus('idle'); }}>
                  Apply for another child
                </button>
              </div>
            ) : (
              <form className="card form" onSubmit={onSubmit}>
                <h2>About your child</h2>
                <div className="form__row">
                  <label>
                    First name *
                    <input required maxLength={80} value={form.childFirstName} onChange={(e) => set('childFirstName', e.target.value)} />
                    {fieldError('childFirstName')}
                  </label>
                  <label>
                    Surname *
                    <input required maxLength={80} value={form.childLastName} onChange={(e) => set('childLastName', e.target.value)} />
                    {fieldError('childLastName')}
                  </label>
                </div>
                <div className="form__row">
                  <label>
                    Date of birth *
                    <input type="date" required max={new Date().toISOString().slice(0, 10)} value={form.childBirthDate} onChange={(e) => set('childBirthDate', e.target.value)} />
                    {fieldError('childBirthDate')}
                  </label>
                  <label>
                    Applying for *
                    <select value={form.grade} onChange={(e) => set('grade', e.target.value)}>
                      {registration.grades.map((g) => <option key={g}>{g}</option>)}
                    </select>
                    {fieldError('grade')}
                  </label>
                </div>
                <div className="form__row">
                  <label>
                    Starting in *
                    <select value={form.startYear} onChange={(e) => set('startYear', Number(e.target.value))}>
                      {startYears.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Current school <span className="hint">(if any)</span></span>
                    <input maxLength={150} value={form.previousSchool} onChange={(e) => set('previousSchool', e.target.value)} />
                  </label>
                </div>

                <h2 className="form__section">Parent or guardian</h2>
                <div className="form__row">
                  <label>
                    Full name *
                    <input required maxLength={100} autoComplete="name" value={form.parentName} onChange={(e) => set('parentName', e.target.value)} />
                    {fieldError('parentName')}
                  </label>
                  <label>
                    Relationship *
                    <select value={form.relationship} onChange={(e) => set('relationship', e.target.value)}>
                      <option>Mother</option>
                      <option>Father</option>
                      <option>Guardian</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <div className="form__row">
                  <label>
                    Phone number *
                    <input type="tel" required maxLength={30} autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    {fieldError('phone')}
                  </label>
                  <label>
                    <span>Email <span className="hint">(optional)</span></span>
                    <input type="email" maxLength={150} autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                    {fieldError('email')}
                  </label>
                </div>
                <label>
                  <span>Home address <span className="hint">(optional)</span></span>
                  <input maxLength={300} autoComplete="street-address" value={form.address} onChange={(e) => set('address', e.target.value)} />
                </label>
                <label>
                  <span>Anything we should know? <span className="hint">(optional, e.g. allergies or interest in swimming or robotics)</span></span>
                  <textarea rows={3} maxLength={2000} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                </label>
                <label className="form__check">
                  <input type="checkbox" required checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
                  <span>
                    I agree that {school.name} may use these details to process this application, in line with POPIA.
                    See our <Link to="/privacy">privacy policy</Link>. *
                  </span>
                </label>
                {fieldError('consent')}

                <button className="btn btn--sun" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Submit application'}
                </button>

                {status === 'offline' && (
                  <div className="notice notice--info" role="status">
                    <p><strong>Almost done.</strong> Tap below to send your application to the school on WhatsApp, or call {school.phones[0]}.</p>
                    <div className="fallback">
                      <a className="btn btn--whatsapp" href={whatsappHref(summary(form))} target="_blank" rel="noreferrer">
                        Send on WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          <aside className="stack">
            <div className="card">
              <h2>How it works</h2>
              <ol className="steps">
                <li><strong>Apply online</strong> with this form. It takes about 3 minutes.</li>
                <li><strong>We call you</strong> to answer questions and book a visit.</li>
                <li><strong>Bring the documents</strong> listed below when you visit.</li>
                <li><strong>Welcome to Veli!</strong> We confirm your child's place.</li>
              </ol>
            </div>
            <div className="card">
              <h2>Documents to bring</h2>
              <ul className="checklist">
                {registration.documents.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <div className="card card--accent">
              <h2>Fees</h2>
              {registration.fees ? (
                <p>{registration.fees}</p>
              ) : (
                <p>Please contact the school for the current fees.</p>
              )}
              <p>
                <a href={telHref(school.phones[0])}>{school.phones[0]}</a> · <a href={telHref(school.phones[1])}>{school.phones[1]}</a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
