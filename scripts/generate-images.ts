import fs from 'fs';
import path from 'path';

// Ensure directories exist
const dirs = [
  'client/public/images',
  'client/public/images/showcase',
  'client/public/images/avatars'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate hero image
const heroSvg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#EAF3FC"/>
  <rect x="50" y="50" width="700" height="500" fill="#CB6A9A" opacity="0.1" rx="8"/>
  <text x="400" y="300" font-family="Arial" font-size="24" fill="#20232A" text-anchor="middle">
    HERO IMAGE PLACEHOLDER
  </text>
</svg>
`;

fs.writeFileSync(
  path.join('client/public/images', 'hero-meeting.jpg'),
  heroSvg
);

// Generate vision learning image
const visionSvg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#EAF3FC"/>
  <rect x="50" y="50" width="700" height="500" fill="#CB6A9A" opacity="0.1" rx="8"/>
  <text x="400" y="300" font-family="Arial" font-size="24" fill="#20232A" text-anchor="middle">
    VISION LEARNING IMAGE
  </text>
</svg>
`;

fs.writeFileSync(
  path.join('client/public/images', 'vision-learning.jpg'),
  visionSvg
);

// Generate showcase images
const showcaseTypes = [
  'meeting-1',
  'meeting-2',
  'meeting-3',
  'interface',
  'student',
  'technology'
];

showcaseTypes.forEach((type, index) => {
  const showcaseSvg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#EAF3FC"/>
      <rect x="50" y="50" width="700" height="500" fill="#CB6A9A" opacity="0.1" rx="8"/>
      <text x="400" y="300" font-family="Arial" font-size="24" fill="#20232A" text-anchor="middle">
        ${type.replace('-', ' ').toUpperCase()}
      </text>
    </svg>
  `;

  fs.writeFileSync(
    path.join('client/public/images/showcase', `${type}.svg`),
    showcaseSvg
  );
});

// Generate avatar images
const avatars = ['sarah', 'david', 'jessica'];
avatars.forEach((name, index) => {
  const avatarSvg = `
    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" fill="#EAF3FC" rx="64"/>
      <text x="64" y="64" font-family="Arial" font-size="14" fill="#20232A" text-anchor="middle" dominant-baseline="middle">
        ${name.toUpperCase()}
      </text>
    </svg>
  `;

  fs.writeFileSync(
    path.join('client/public/images/avatars', `${name}.svg`),
    avatarSvg
  );
});

console.log('Generated all placeholder images!');