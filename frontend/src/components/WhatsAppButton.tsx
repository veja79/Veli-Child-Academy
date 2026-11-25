import { school, whatsappHref } from '../content/school';

/** Floating "chat on WhatsApp" button shown on every public page. */
export default function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={whatsappHref(`Hello ${school.name}, I have a question.`)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${school.name} on WhatsApp`}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C8.8 3 3 8.6 3 15.6c0 2.5.8 4.9 2.1 6.9L3.6 28.6l6.4-1.6c1.9 1 4 1.6 6.1 1.6 7.2 0 13-5.6 13-12.6S23.2 3 16 3zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-3.8 1 1-3.6-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.7C5.4 10 10.1 5.4 16 5.4s10.6 4.6 10.6 10.2S21.9 26.1 16 26.1zm5.8-7.6c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.7-.4z"
        />
      </svg>
      <span className="wa-float__label">WhatsApp us</span>
    </a>
  );
}
