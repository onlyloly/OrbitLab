export type PlanetId = 'moon' | 'mars' | 'saturn' | 'neptune' | 'jupiter' | 'nova';

export interface PlanetInfo {
  id: PlanetId;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
  diameter: string;
  atmosphere: { en: string; ru: string };
  distanceFromSun: string;
  facts: { en: string[]; ru: string[] };
  color: string;
  accentColor: string;
  glowColor: string;
}

export const PLANETS: PlanetInfo[] = [
  {
    id: 'moon',
    name: { en: 'Moon', ru: 'Луна' },
    description: {
      en: "Earth's only natural satellite, a world of ancient craters and silent seas, reflecting sunlight across the cosmos.",
      ru: 'Единственный естественный спутник Земли — мир древних кратеров и безмолвных морей.',
    },
    diameter: '3,474 km',
    atmosphere: { en: 'Virtually none', ru: 'Практически отсутствует' },
    distanceFromSun: '149.6M km (via Earth)',
    facts: {
      en: [
        'The Moon moves 3.8 cm farther from Earth each year',
        'Only 12 humans have ever walked on the Moon',
        'Lunar gravity is 1/6th of Earth\'s gravity',
      ],
      ru: [
        'Луна удаляется от Земли на 3,8 см каждый год',
        'Только 12 человек когда-либо ходили по Луне',
        'Лунная гравитация составляет 1/6 от земной',
      ],
    },
    color: '#a0a0b0',
    accentColor: '#c8c8d8',
    glowColor: 'rgba(200, 200, 220, 0.3)',
  },
  {
    id: 'mars',
    name: { en: 'Mars', ru: 'Марс' },
    description: {
      en: 'The Red Planet — a frozen desert world with towering volcanoes, vast canyons, and the possibility of ancient life.',
      ru: 'Красная планета — замёрзший пустынный мир с гигантскими вулканами и огромными каньонами.',
    },
    diameter: '6,779 km',
    atmosphere: { en: '95% Carbon Dioxide', ru: '95% диоксида углерода' },
    distanceFromSun: '228M km',
    facts: {
      en: [
        'Olympus Mons is the largest volcano in the solar system',
        'A Martian day is 24 hours and 37 minutes',
        'Mars has two small moons: Phobos and Deimos',
      ],
      ru: [
        'Олимп — крупнейший вулкан в Солнечной системе',
        'Марсианские сутки составляют 24 часа 37 минут',
        'У Марса два небольших спутника: Фобос и Деймос',
      ],
    },
    color: '#c1440e',
    accentColor: '#e05a20',
    glowColor: 'rgba(220, 80, 20, 0.35)',
  },
  {
    id: 'saturn',
    name: { en: 'Saturn', ru: 'Сатурн' },
    description: {
      en: 'The jewel of the solar system, adorned with magnificent rings of ice and rock spanning 282,000 kilometers.',
      ru: 'Жемчужина Солнечной системы, украшенная великолепными кольцами из льда и камня.',
    },
    diameter: '116,460 km',
    atmosphere: { en: '96% Hydrogen, 3% Helium', ru: '96% водорода, 3% гелия' },
    distanceFromSun: '1.43 billion km',
    facts: {
      en: [
        'Saturn could float in water — it\'s less dense than water',
        'Saturn\'s rings are only about 20 meters thick on average',
        'Saturn has 146 known moons, including the large Titan',
      ],
      ru: [
        'Сатурн мог бы плавать в воде — он менее плотный, чем вода',
        'Кольца Сатурна в среднем всего около 20 метров толщиной',
        'У Сатурна 146 известных спутников, включая крупный Титан',
      ],
    },
    color: '#c8a96e',
    accentColor: '#e8c88a',
    glowColor: 'rgba(220, 180, 80, 0.3)',
  },
  {
    id: 'neptune',
    name: { en: 'Neptune', ru: 'Нептун' },
    description: {
      en: 'The dark, cold, and incredibly windy ice giant — the most distant planet with winds reaching 2,100 km/h.',
      ru: 'Тёмный, холодный и невероятно ветреный ледяной гигант — самая далёкая планета Солнечной системы.',
    },
    diameter: '49,528 km',
    atmosphere: { en: '80% Hydrogen, 19% Helium', ru: '80% водорода, 19% гелия' },
    distanceFromSun: '4.5 billion km',
    facts: {
      en: [
        'Neptune\'s winds are the fastest in the solar system at 2,100 km/h',
        'A year on Neptune lasts 165 Earth years',
        'Neptune was the first planet located through mathematical prediction',
      ],
      ru: [
        'Ветры Нептуна — самые быстрые в Солнечной системе: 2100 км/ч',
        'Год на Нептуне длится 165 земных лет',
        'Нептун — первая планета, обнаруженная с помощью математических расчётов',
      ],
    },
    color: '#2060c8',
    accentColor: '#4090e8',
    glowColor: 'rgba(40, 100, 220, 0.4)',
  },
  {
    id: 'jupiter',
    name: { en: 'Jupiter', ru: 'Юпитер' },
    description: {
      en: 'The king of planets — a colossal gas giant with a centuries-old storm larger than Earth itself.',
      ru: 'Король планет — колоссальный газовый гигант с вековым штормом размером больше Земли.',
    },
    diameter: '139,820 km',
    atmosphere: { en: '89% Hydrogen, 10% Helium', ru: '89% водорода, 10% гелия' },
    distanceFromSun: '778.5M km',
    facts: {
      en: [
        'The Great Red Spot has been raging for over 350 years',
        'Jupiter has the shortest day — just 10 hours long',
        'Jupiter\'s magnetic field is 20,000 times stronger than Earth\'s',
      ],
      ru: [
        'Большое красное пятно бушует уже более 350 лет',
        'У Юпитера самые короткие сутки — всего 10 часов',
        'Магнитное поле Юпитера в 20 000 раз сильнее земного',
      ],
    },
    color: '#c8884a',
    accentColor: '#e0a060',
    glowColor: 'rgba(210, 140, 60, 0.3)',
  },
  {
    id: 'nova',
    name: { en: 'Nova', ru: 'Нова' },
    description: {
      en: 'A mythical world beyond the edge of the known cosmos, pulsing with quantum energy and crystalline light.',
      ru: 'Мифический мир за краем известного космоса, пульсирующий квантовой энергией и кристаллическим светом.',
    },
    diameter: '∞ unknown',
    atmosphere: { en: 'Quantum plasma fields', ru: 'Квантовые плазменные поля' },
    distanceFromSun: 'Beyond measurement',
    facts: {
      en: [
        'Nova exists at the intersection of multiple quantum realities',
        'Its surface crystallizes and reforms every 7 seconds',
        'The aurora here is visible from 40 light-years away',
      ],
      ru: [
        'Нова существует на пересечении нескольких квантовых реальностей',
        'Её поверхность кристаллизуется и обновляется каждые 7 секунд',
        'Северное сияние здесь видно с расстояния 40 световых лет',
      ],
    },
    color: '#8b5cf6',
    accentColor: '#06b6d4',
    glowColor: 'rgba(139, 92, 246, 0.5)',
  },
];
