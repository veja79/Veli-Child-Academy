/**
 * All school details live here so they can be updated in one place.
 * Anything marked TODO is a placeholder: replace it with the school's real details.
 */
export const school = {
  name: 'Veli Child Academy',
  tagline: 'Where little minds grow big',
  intro:
    'A warm, safe and play-based environment where every child is known by name, encouraged to explore and supported to reach their potential.',

  // TODO: confirm with the school
  phone: '000 000 0000',
  whatsapp: '000 000 0000',
  email: 'info@velichildacademy.co.za',
  address: ['Street address', 'Suburb', 'City, Postcode'],
  hours: 'Monday to Friday, 06:30 to 17:30',
  mapEmbedUrl: '', // paste a Google Maps "Embed a map" URL here

  // TODO: confirm with the school
  about: {
    story:
      'Veli Child Academy was founded to give families a place they can trust: a school where children feel at home, learn through play and build the confidence they need for big school.',
    mission:
      'To provide quality early childhood education in a caring environment that nurtures each child socially, emotionally, physically and academically.',
    vision: 'Happy, confident children who love learning.',
    values: [
      { title: 'Care', text: 'Every child is safe, seen and loved.' },
      { title: 'Curiosity', text: 'We learn by asking, exploring and playing.' },
      { title: 'Respect', text: 'For ourselves, each other and our environment.' },
      { title: 'Partnership', text: 'Parents and teachers working together.' },
    ],
  },

  // TODO: confirm age groups and names with the school
  programmes: [
    { name: 'Babies', ages: '3 to 18 months', text: 'Gentle routines, sensory play and lots of cuddles.' },
    { name: 'Toddlers', ages: '18 months to 3 years', text: 'Language, movement and early independence.' },
    { name: 'Pre-school', ages: '3 to 5 years', text: 'Early literacy, numeracy, art and outdoor play.' },
    { name: 'Grade R', ages: '5 to 6 years', text: 'School readiness, aligned with the CAPS curriculum.' },
  ],

  social: {
    facebook: '', // TODO: add links, empty ones are hidden
    instagram: '',
  },
} as const;
