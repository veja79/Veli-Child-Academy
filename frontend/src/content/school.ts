/**
 * All school details live here so they can be updated in one place.
 * Details come from the school's flyer. Anything marked TODO still needs confirming.
 */
export const school = {
  name: 'Veli Child Academy',
  motto: 'Student-centred learning',
  tagline: 'Building future leaders',
  intro:
    'A caring foundation phase school in Ivory Park, offering Grade R to Grade 3, with robotics, computer classes, swimming lessons and extra lessons for Grades 1 to 12.',

  phones: ['060 666 2087', '071 646 3498'],
  email: 'velindukuya29@gmail.com',
  address: ['12498 Khoza Street', 'Ivory Park', 'Midrand, 1685'],
  hours: '', // TODO: e.g. 'Monday to Friday, 07:00 to 17:00'
  mapEmbedUrl: 'https://www.google.com/maps?q=12498+Khoza+Street,+Ivory+Park,+Midrand&output=embed',

  about: {
    // TODO: replace with the school's own story when available
    story:
      'Veli Child Academy puts each learner at the centre of their education. We build strong foundations in reading, writing and maths, and open young minds to the world through technology and hands-on experiences.',
    mission:
      'To give every child a strong foundation phase education in a safe, caring and stimulating environment, preparing them to grow into confident future leaders.',
    vision: 'Building future leaders, one child at a time.',
    values: [
      { title: 'Student-centred', text: 'Teaching that starts with each child’s needs and interests.' },
      { title: 'Curiosity', text: 'Excursions and themed days that bring learning to life.' },
      { title: 'Future-ready', text: 'Robotics and computer skills from an early age.' },
      { title: 'Partnership', text: 'Parents and teachers working together.' },
    ],
  },

  grades: [
    { name: 'Grade R', text: 'Play-based school readiness: early literacy, numeracy and social skills.' },
    { name: 'Grade 1', text: 'Reading, writing and number foundations in small, supported classes.' },
    { name: 'Grade 2', text: 'Building fluency in reading and maths, with growing independence.' },
    { name: 'Grade 3', text: 'Completing the foundation phase, ready for the intermediate phase.' },
  ],

  extras: [
    { name: 'Robotics', text: 'Hands-on building and problem solving.', badge: 'New' },
    { name: 'Computer literacy', text: 'Confident, safe use of computers and the internet.', badge: 'New' },
    { name: 'Computer numeracy', text: 'Maths skills practised through technology.', badge: 'New' },
    { name: 'Swimming lessons', text: 'Learning to swim with confidence and water safety.', badge: 'New' },
    { name: 'After-school classes', text: 'Extra lessons for Grades 1 to 12 to help improve results.', badge: '' },
  ],

  /**
   * Organisations that work with the school. TODO: confirm the full list, how each one
   * should be described, and that each is happy to be named (and to have its logo shown).
   */
  partners: [
    { name: 'Adopt A Child', text: 'Building futures through education.', logo: '/images/partners/adopt-a-child.png' },
    { name: 'SHEBBA Media', text: 'Co-presenter of the Ivory Park Family Fun Day.', logo: '' },
    { name: 'KasieOlympics', text: 'Runs the indigenous games tournament at the Family Fun Day.', logo: '' },
  ],

  social: {
    facebook: '', // TODO: add links; empty ones are hidden
    instagram: '',
    whatsapp: '',
  },
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;

/** WhatsApp click-to-chat link for the school's main number, with an optional pre-filled message. */
export const whatsappHref = (text?: string) =>
  `https://wa.me/27${school.phones[0].replace(/\D/g, '').replace(/^0/, '')}` +
  (text ? `?text=${encodeURIComponent(text)}` : '');

/**
 * Registration details. TODO: confirm the document list with the principal and add fees when available.
 */
export const registration = {
  grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3'],
  documents: [
    "Copy of the child's birth certificate",
    "Copy of the child's Road to Health (clinic) card, for Grade R",
    "Copies of the parents' or guardians' ID documents",
    'Proof of residence',
    'Latest school report, if moving from another school',
  ],
  fees: '', // e.g. 'Registration R500 · Monthly fee R1 500'. Empty shows "contact us for fees".
};
