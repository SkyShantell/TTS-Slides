export const SKELETONS = [
  { id:'signs', name:'Signs You…', description:'Recognition-driven hook that transitions into a practical product solution.', flow:['hook','sign','sign','recognition','bridge','product','benefit','cta'] },
  { id:'delayed_recognition', name:'Delayed Recognition', description:'Relatable frustration builds before a later routine/product reveal.', flow:['hook','problem','problem','realization','bridge','product','result','cta'] },
  { id:'things_changed', name:'Things That Changed', description:'First-person changes create curiosity before the cause is revealed.', flow:['hook','change','change','change','reveal','benefit','proof','cta'] },
  { id:'nobody_talks', name:'Nobody Talks About…', description:'Under-discussed pain point, short education, then product solution.', flow:['hook','problem','context','mistake','better_way','product','benefit','cta'] },
  { id:'pov', name:'POV / Finally', description:'Lifestyle-forward story built around finally finding a simpler routine.', flow:['hook','before','friction','discovery','product','use','after','cta'] },
  { id:'before_you_buy', name:'Before You Buy', description:'Buyer-intent format that teaches what to look for before product reveal.', flow:['hook','criteria','criteria','avoid','what_to_choose','product','why_fit','cta'] },
  { id:'problem_solution', name:'Problem → Solution', description:'Direct-response structure from obvious pain to product/use/benefit.', flow:['hook','problem','problem','friction','product','use','benefit','cta'] },
  { id:'checklist', name:'Checklist', description:'Save-worthy education that positions the product naturally.', flow:['hook','check','check','check','check','product','summary','cta'] },
  { id:'routine_reset', name:'Routine Reset', description:'Old routine → friction → simplified new routine.', flow:['hook','old_routine','problem','reset','product','use','new_routine','cta'] },
  { id:'comparison', name:'Simple Comparison', description:'Compares approaches without attacking competitors.', flow:['hook','option_a','option_b','difference','who_needs_what','product','fit','cta'] }
];

export const STYLES = {
  'Casual UGC': { prompt:'casual everyday smartphone photo, authentic UGC feel, natural imperfect framing, ordinary real environment, realistic skin and materials, no studio polish, no commercial product photography, controlled everyday clutter, natural light, product entirely in frame when shown', overlay:'shadow' },
  'Illustrated Carousel': { prompt:'clean premium 2D social-media illustration, expressive character, simple readable composition, light or white background, obvious visual storytelling, consistent character appearance, modern editorial vector feel, not photorealistic', overlay:'clean' },
  'Product UGC': { prompt:'casual smartphone product photo in a normal everyday setting, product naturally placed and clearly visible, slightly imperfect composition, real home lighting, no studio sweep, product remains focal and entirely in frame', overlay:'shadow' },
  'Mixed Story': { prompt:'social carousel storytelling with varied but cohesive visuals: relatable problem scenes first, then natural product lifestyle imagery after reveal; believable environments, clear subject focus, no studio-ad look', overlay:'shadow' }
};

export const ASPECTS = {
  '3:4': { width:1080, height:1440, aiSize:'1080x1440' },
  '9:16': { width:1080, height:1920, aiSize:'1080x1920' },
  '4:5': { width:1080, height:1350, aiSize:'1080x1350' }
};
