export const SKELETONS = [
  { id:'s1', name:'Delayed Recognition', description:'A relatable problem is normalized at first, then the person realizes how much it has been affecting the routine before the product appears.', flow:['hook','normalization','problem','problem','realization','product_reveal','why_it_fits','cta'] },
  { id:'s2', name:'Signs You…', description:'Recognition-led story using several highly relatable signs or moments before connecting them to a simple product choice.', flow:['hook','sign','sign','sign','recognition','product_reveal','why_it_fits','cta'] },
  { id:'s3', name:'What Stopped Happening', description:'Starts with an intriguing change in everyday routine or friction and reveals what the person changed later.', flow:['hook','change','change','change','realization','product_reveal','routine','cta'] },
  { id:'s4', name:'Nobody Talks About…', description:'Leads with an under-discussed frustration or observation, builds recognition, then introduces the product naturally.', flow:['hook','hidden_pain','recognition','friction','realization','product_reveal','why_it_fits','cta'] },
  { id:'s5', name:'Things That Changed', description:'A list-style personal story where several routine changes create curiosity before the cause/product is revealed.', flow:['hook','change','change','change','reveal','product','why_it_fits','cta'] },
  { id:'s6', name:'POV You Finally…', description:'Identity/confession content about finally changing a recurring behavior, routine, or buying habit.', flow:['hook','before','friction','friction','turning_point','product_reveal','new_routine','cta'] },
  { id:'s7', name:'This Helped Me', description:'UGC-style conversion story: a specific frustration, what the person tried, then the product/routine they now prefer.', flow:['hook','frustration','what_i_tried','why_it_wasnt_it','discovery','product_reveal','why_i_keep_it','cta'] },
  { id:'s8', name:'Wrong Way / Shortcut', description:'A corrective or shortcut angle framed around an annoying/overcomplicated way versus a simpler choice.', flow:['hook','old_way','friction','mistake','shortcut','product_reveal','better_routine','cta'] },
  { id:'s9', name:'Hidden Value', description:'Starts with a desire, identity, or lifestyle payoff and only later reveals the product detail that makes the choice appealing.', flow:['hook','desire','friction','unexpected_detail','reveal','product','why_it_matters','cta'] },
  { id:'s10', name:'Judgment Game', description:'Interactive choice/judgment format for products with variants, routines, or competing preferences.', flow:['hook','choice','choice','judgment','what_it_says','product_reveal','my_pick','cta'] }
];

export const STYLES = {
  'Casual UGC': { prompt:'casual everyday smartphone photo, authentic UGC feel, natural imperfect framing, ordinary real environment, realistic skin and materials, no studio polish, no commercial product photography, controlled everyday clutter, natural light, product entirely in frame when shown', overlay:'shadow' },
  'Illustrated Carousel': { prompt:'clean premium 2D social-media illustration, expressive character, simple readable composition, light or white background, obvious visual storytelling, consistent character appearance, modern editorial vector feel, not photorealistic', overlay:'clean' },
  'Product UGC': { prompt:'casual smartphone product photo in a normal everyday setting, product naturally placed and clearly visible, slightly imperfect composition, real home lighting, no studio sweep, product remains focal and entirely in frame', overlay:'shadow' },
  'Mixed Story': { prompt:'social carousel storytelling with varied but cohesive visuals: relatable problem scenes first, then natural product lifestyle imagery after reveal; believable environments, clear subject focus, no studio-ad look', overlay:'shadow' }
};

// GPT-Image-2 supports flexible sizes, but using the documented portrait canvas here
// makes generation/editing more reliable. Sharp crops/resizes to the exact final output below.
export const ASPECTS = {
  '3:4': { width:1080, height:1440, aiSize:'1024x1536' },
  '9:16': { width:1080, height:1920, aiSize:'1024x1536' },
  '4:5': { width:1080, height:1350, aiSize:'1024x1536' }
};
