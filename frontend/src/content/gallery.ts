export interface Photo {
  src: string;
  alt: string;
  /** portrait photos take two rows in the gallery grid */
  tall?: boolean;
}

export interface Album {
  id: string;
  title: string;
  text: string;
  photos: Photo[];
}

const img = (name: string) => `/images/${name}.jpg`;

/** Photos of learners: only publish with parents' consent (POPIA). */
export const albums: Album[] = [
  {
    id: 'school-life',
    title: 'School life',
    text: 'Our learners in their Veli Child Academy uniforms at school in Ivory Park.',
    photos: [
      { src: img('class-photo'), alt: 'Learners in summer uniform outside the after-school class building. Photo: Tshepo_Shoots' },
      { src: img('winter-uniform-2'), alt: 'Five learners in winter uniform at the school gate', tall: true },
      { src: img('learners-street'), alt: 'Learners lined up along the school wall', tall: true },
      { src: img('winter-uniform-1'), alt: 'Learners in navy jerseys under the school sign', tall: true },
    ],
  },
  {
    id: 'aviation',
    title: 'Aviation excursion',
    text: 'Our learners explored historic aircraft, sat in a real cabin and got up close to a helicopter.',
    photos: [
      { src: img('aviation-walk-3'), alt: 'Learners walking past vintage aircraft' },
      { src: img('aviation-engine-1'), alt: 'Three learners sitting inside a jet engine', tall: true },
      { src: img('aviation-stairs'), alt: 'Learners coming down the aircraft stairs' },
      { src: img('aviation-curious'), alt: 'A learner pointing up with excitement' },
      { src: img('helicopter-visit'), alt: 'Learners meeting a helicopter pilot' },
      { src: img('aviation-seats'), alt: 'Learners sitting in a row of aircraft seats' },
      { src: img('aviation-cabin'), alt: 'Learners walking through an aircraft cabin' },
      { src: img('aviation-engine-2'), alt: 'Learners smiling inside a jet engine' },
      { src: img('aviation-walk-1'), alt: 'Learners walking in front of a propeller plane' },
      { src: img('aviation-museum'), alt: 'Learners looking at museum displays' },
      { src: img('aviation-walk-2'), alt: 'Learners in uniform at the aviation museum' },
    ],
  },
  {
    id: 'career-day',
    title: 'Career day',
    text: 'Future doctors, firefighters, pilots and police officers dressed up for the day.',
    photos: [
      { src: img('career-day-3'), alt: 'Learners dressed as different careers at the school gate' },
      { src: img('career-day-medical'), alt: 'Learners dressed as doctors and nurses', tall: true },
      { src: img('career-day-1'), alt: 'Learners cheering in career costumes' },
      { src: img('career-day-2'), alt: 'Learners waving hats in career costumes' },
    ],
  },
  {
    id: 'pyjama-day',
    title: 'Pyjama day',
    text: 'Cosy gowns, teddy bears and big smiles at the school gate.',
    photos: [
      { src: img('pyjama-day-1'), alt: 'Learners in pyjamas smiling at the school gate' },
      { src: img('pyjama-day-3'), alt: 'Learners in pyjamas waving' },
      { src: img('pyjama-day-2'), alt: 'Learners in pyjamas with a teacher' },
    ],
  },
];

export const heroPhoto = img('aviation-walk-3');
export const aboutPhoto = img('class-photo');
export const welcomePhoto = img('winter-uniform-2');

export const uniformPhotos: Photo[] = [
  { src: img('uniform-summer'), alt: 'Summer uniform: grey golf shirt and navy shorts with the school logo' },
  { src: img('uniform-tracksuit'), alt: 'School tracksuit, golf shirt and shorts with the school logo' },
];

/** Short highlights for the home page, linking into the gallery. */
export const highlights = [
  { src: img('aviation-engine-1'), title: 'Excursions', text: 'Learning beyond the classroom, like our aviation museum visit.', album: 'aviation' },
  { src: img('career-day-medical'), title: 'Themed days', text: 'Career day, pyjama day and more to keep learning fun.', album: 'career-day' },
  { src: img('learners-street'), title: 'Proud learners', text: 'Smart uniforms and a strong school community.', album: 'school-life' },
];
