export const DECK_FORMULAS = [
  {id:'auto',name:'Auto — Pick Best',description:'Choose the strongest product-specific formula from the original slide system, then use a secondary story angle for freshness.'},
  {id:'master_a',name:'Master A — Signs & Solution',description:'Recognition hook → relatable problem moments → earned product reveal → 2–3 factual reasons → use/routine → CTA. Best for supplements, wellness, haircare and problem/solution products.',typical:'7–9'},
  {id:'master_b',name:'Master B — Social Story + Product',description:'Two-character social scene → old/frustrating way → product/format reveal → factual features → resolution → CTA. Best for fitness, format upgrades and socially demonstrable products.',typical:'6–8'},
  {id:'master_c',name:'Master C — Skincare Education',description:'Product/system reveal → concern/variant explainers → how to use → routine placement → CTA. Best for skincare systems, variants and multi-SKU bundles.',typical:'6–7'},
  {id:'gadget',name:'Gadget / Tool Story',description:'Continuous problem scene → resolution scene → feature/demo → CTA. Best for tools, cooling, grooming, home gadgets and single-purpose products.',typical:'4–6'},
  {id:'story_hybrid',name:'Story Hybrid',description:'Use the original slide-type system with a Greymike-style story mechanism such as delayed recognition, POV, things that changed, or this helped me.',typical:'5–8'}
];

export const STORY_ANGLES = [
  {id:'recognition',name:'Signs / Recognition'},
  {id:'delayed_recognition',name:'Delayed Recognition'},
  {id:'things_changed',name:'Things That Changed'},
  {id:'pov',name:'POV You Finally…'},
  {id:'this_helped',name:'This Helped Me / What I Changed'},
  {id:'old_vs_new',name:'Old Way vs New Way'},
  {id:'social_dialogue',name:'Social Dialogue'},
  {id:'hidden_truth',name:'Nobody Talks About…'},
  {id:'comparison',name:'Comparison / Choice'}
];

export const SLIDE_TYPES = {
  N1:{name:'Character Hook',kind:'illustrated',product:false,textStyle:'type2',instruction:'White/off-white background. One recurring character in a clear emotional pose. Strong simple hook composition with generous negative space for exact overlay text.'},
  N2:{name:'Problem Character',kind:'illustrated',product:false,textStyle:'type1',instruction:'White/off-white background. Character visibly acts out one relatable problem with one or two scene-specific props. No product unless explicitly requested.'},
  N3A:{name:'Problem Dialogue Scene',kind:'illustrated_scene',product:false,textStyle:'type4',instruction:'One complete social scene with two characters. One has the frustration; the knowledgeable friend reacts. Preserve location/outfits across any paired resolution scene.'},
  N3B:{name:'Resolution Dialogue Scene',kind:'illustrated_scene',product:false,textStyle:'type4',instruction:'Same location, same two characters, same outfits as the matching problem scene; emotional state is now resolved/positive. Do not invent physical medical transformations.'},
  N3C:{name:'Continuous Scene Sequence',kind:'illustrated_scene',product:false,textStyle:'type4',instruction:'One frame in a continuous two-slide mini-story. Match background, outfits and identities exactly with the paired slide.'},
  N4:{name:'Feature Product Shot',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Realistic casual UGC product photo, product held or naturally placed, 2–3 supplied checkable feature callouts reserved for overlay. Product entirely in frame.'},
  N5:{name:'Ingredient / Feature Reveal',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Realistic casual product scene that visually supports supplied ingredients/features without invented loose powders, floating ingredients or fake text. Keep packaging exact.'},
  N6:{name:'UGC Hold & Tell',kind:'product_ugc',product:true,textStyle:'type4',instruction:'Casual creator/hand holding the real product in an ordinary outdoor or home environment. Authentic phone-photo feel, not studio polish.'},
  N7:{name:'How-To / Routine',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Single-scene product-in-use or routine placement image. Show one clear use moment rather than a multi-panel instruction grid.'},
  N8:{name:'CTA Product Closer',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Strong but casual product closer. Product entirely visible, clean background, room for exact CTA overlay. Do not invent sale/free-shipping/urgency unless supplied.'},
  N10:{name:'Social Proof / Fact',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Product-led credibility slide using only supplied or user-approved factual evidence. Do not fabricate screenshots, statistics, ratings or reviews.'},
  N11:{name:'Secret Tip',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Insider-feeling practical tip using only a genuinely supported product detail or user-provided tip. Product visible naturally.'}
};

export const COPY_STYLES = {
  type1:{name:'Type 1 — Editorial Problem',description:'Black editorial serif copy on light illustrated slides; numbered problem + parenthetical context.'},
  type2:{name:'Type 2 — Hook Keyword',description:'Black hook line + oversized deep-burgundy editorial emphasis + smaller supporting line.'},
  type3:{name:'Type 3 — White Pill Box',description:'Rounded white box with strong black copy for UGC/product slides.'},
  type4:{name:'Type 4 — Raw White Outline',description:'White text with dark outline for scenes and casual dialogue.'},
  type5:{name:'Type 5 — Product/Variant Label',description:'Bold rounded label treatment for variant/product education.'}
};

export const DANI = {
  id:'dani',
  name:'Dani — Original Skill Character',
  prompt:'Dani, a consistent illustrated Black woman character with medium warm-brown skin, very voluminous shoulder-length natural black 3C/4A curls forming a large round silhouette, green-hazel almond eyes, bold arched dark brows, full nude-mauve lips, subtle small nose ring, medium-to-large gold hoop earrings, layered delicate gold necklaces, athletic/curvy build. Hair volume, gold hoops, necklaces, eye color and identity remain consistent across slides.',
  expressions:{E1:'Neutral / unbothered',E2:'Slight smile / reassurance',E3:'Bored / tired',E4:'Side-eye / skeptical',E5:'Laughing / happy',E6:'Shocked / surprised'},
  poses:{P1:'Sitting/slouched',P2:'Standing confident',P3:'Standing with lifestyle props',P4:'Holding product toward camera',P5:'Close-up expression-forward portrait',P6:'Scene/dialogue interaction'}
};

export const CHARACTER_MODES = [
  {id:'dani',name:'Dani — Original Skill Default'},
  {id:'custom',name:'Custom Recurring Character'},
  {id:'none',name:'No Recurring Character'}
];

export const CHARACTER_STYLES = [
  {id:'none',name:'None / Product Only'},
  {id:'flat_cel',name:'Flat / Cel-Shaded'},
  {id:'editorial',name:'Editorial Illustrated'},
  {id:'animated_dialogue',name:'Original Animated Dialogue'},
  {id:'premium_3d',name:'Premium 3D Illustration'},
  {id:'ugc',name:'Photorealistic UGC'}
];

export function formulaById(id){return DECK_FORMULAS.find(x=>x.id===id)||DECK_FORMULAS[0];}
export function slideTypeById(id){return SLIDE_TYPES[id]||SLIDE_TYPES.N1;}

export function formulaFlow(id, count=7){
  const flows={
    master_a:['N1','N2','N2','N2','N6','N4','N7','N8','N8'],
    master_b:['N3A','N4','N5','N4','N4','N3B','N8','N8'],
    master_c:['N6','N2','N2','N2','N7','N7','N8'],
    gadget:['N3C','N3C','N4','N7','N8','N8'],
    story_hybrid:['N1','N2','N2','N2','N6','N4','N7','N8'],
    auto:['N1','N2','N2','N2','N6','N4','N7','N8']
  };
  return (flows[id]||flows.auto).slice(0,count);
}
