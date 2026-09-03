export const STYLES = {
  'Mixed Illustrated + UGC': { prompt:'cohesive social carousel storytelling: illustrated character/problem scenes before the reveal, then authentic casual real-world product UGC after the reveal; preserve character continuity and product packaging accuracy', overlay:'dynamic' },
  'Illustrated Character': { prompt:'clean premium 2D social-media illustration, expressive recurring character, simple readable composition, light/off-white background on list/problem slides, modern editorial illustration feel, original character design', overlay:'clean' },
  'Casual UGC': { prompt:'casual everyday smartphone photo, authentic UGC feel, natural imperfect framing, ordinary real environment, realistic skin and materials, no studio polish, no commercial product photography, controlled everyday clutter, natural light', overlay:'shadow' },
  'Product UGC': { prompt:'casual smartphone product photo in a normal everyday setting, product naturally placed and clearly visible, slightly imperfect composition, real home or outdoor lighting, no studio sweep, product remains focal and entirely in frame', overlay:'shadow' },
  'Editorial Illustrated': { prompt:'high-detail editorial fashion illustration, premium magazine-like shading, expressive character, refined but social-media-native composition, original character design', overlay:'clean' }
};

export const ASPECTS = {
  '3:4': { width:1080, height:1440, aiSize:'1024x1536' },
  '9:16': { width:1080, height:1920, aiSize:'1024x1536' },
  '4:5': { width:1080, height:1350, aiSize:'1024x1536' }
};
