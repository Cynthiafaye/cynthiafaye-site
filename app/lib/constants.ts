export const READING_TYPES = [
  { id: 'diamond', name: 'Diamond Reading', price: 100, duration: 30, image: '/diamond.png' },
  { id: 'signature', name: 'Signature Reading', price: 180, duration: 30, image: '/signature.png' },
  { id: 'crossover', name: 'Crossover Reading', price: 180, duration: 30, image: '/crossover.png' },
] as const;

export type ReadingTypeId = typeof READING_TYPES[number]['id'];

export const READING_FORMATS = [
  { id: 'in-person', label: 'In Person', description: "Santa Rosa Beach at Cynthia's office — exact location revealed after booking" },
  { id: 'phone', label: 'Reading by Phone', description: "Cynthia can read for you anywhere in the world by phone" },
] as const;

export type ReadingFormatId = typeof READING_FORMATS[number]['id'];

export const OPERATING_HOURS = { start: 8, end: 20 };
export const SLOT_DURATION = 30;
