import PageHero from '../components/PageHero';
import { school } from '../content/school';

/**
 * POPIA privacy notice. TODO before launch: have the principal (the school's Information Officer)
 * read and approve this, and fill in their name below.
 */
const UPDATED = '24 November 2026';

export default function Privacy() {
  return (
    <>
      <PageHero title="Privacy policy">How {school.name} handles personal information, in line with the Protection of Personal Information Act (POPIA).</PageHero>

      <section className="section">
        <div className="container prose">
          <p className="muted">Last updated: {UPDATED}</p>

          <h2>Who we are</h2>
          <p>
            {school.name} ({school.address.join(', ')}) is responsible for the personal information collected
            through this website. Our Information Officer is the school principal. You can reach us on{' '}
            {school.phones.join(' or ')}{school.email ? ` or at ${school.email}` : ''}.
          </p>

          <h2>What we collect and why</h2>
          <p>When you use the contact form we collect your name, email address, phone number (optional) and your message.</p>
          <p>
            We use these details only to respond to your enquiry, for example about registration, fees or classes. We do not
            sell your information or use it for marketing without your permission.
          </p>
          <p>This website does not use advertising or tracking cookies.</p>

          <h2>Photos of learners</h2>
          <p>
            We only publish photos of learners with their parent's or guardian's consent. If you would like a photo removed,
            contact us and we will remove it promptly.
          </p>

          <h2>Who can see your information</h2>
          <p>
            Only authorised school staff can read messages sent through the website. Our website and email providers store the
            information on our behalf and may not use it for their own purposes.
          </p>

          <h2>How long we keep it</h2>
          <p>We keep enquiries only as long as we need them to respond and follow up, and delete them after that.</p>

          <h2>Your rights</h2>
          <p>
            You may ask us what personal information we hold about you, ask us to correct or delete it, or object to how we use
            it. Contact us using the details above.
          </p>
          <p>
            If you are not happy with how we handle your information, you can complain to the Information Regulator: call
            0800 017 160, email enquiries@inforegulator.org.za, or visit{' '}
            <a href="https://inforegulator.org.za" target="_blank" rel="noreferrer">inforegulator.org.za</a>.
          </p>
        </div>
      </section>
    </>
  );
}
