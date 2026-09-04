export const DECK_FORMULAS = [
  {id:'auto',name:'Auto — Pick Best',description:'Choose the strongest product-specific story formula after the reference style is selected.'},
  {id:'master_a',name:'Master A — Signs & Solution',description:'Recognition hook → relatable problems → product reveal → factual reasons → routine → CTA.',typical:'7–9'},
  {id:'master_b',name:'Master B — Social Story + Product',description:'Social problem → product/format discovery → factual feature → resolution → CTA.',typical:'4–8'},
  {id:'master_c',name:'Master C — Education',description:'Concern/feature education → product → how-to → CTA.',typical:'5–7'},
  {id:'gadget',name:'Gadget / Tool Story',description:'Problem → demonstration → feature → CTA.',typical:'4–6'},
  {id:'story_hybrid',name:'Story Hybrid',description:'Reference style first, with a secondary emotional story mechanism.',typical:'5–8'}
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

// Built from the user's Drive reference folders. These are creative systems, not loose art-style labels.
export const REFERENCE_STYLES = [
  {id:'auto_ref',name:'Auto — Choose from my reference styles',defaultSlides:7,description:'Pick the best of the saved reference systems for this product.',flow:['N1','N2','N2','N6','N4','N7','N8'],copyDNA:'Choose one reference system below and follow it consistently. Do not blend unrelated typography/layout systems.',imageDNA:'Use the chosen reference system exactly enough to feel like the same content family, while creating original characters/scenes.',layout:'single'},
  {id:'style1_cartoon',name:'Style 1 — Cartoon Signs → UGC',defaultSlides:8,description:'Clean white cartoon problem slides with editorial numbered copy, then an abrupt switch to casual real product UGC.',flow:['N1','N2','N2','N2','N6','N4','N5','N8'],copyDNA:'Cover: “3 signs of [relatable problem/need]” + small “and how to support it >>”. Problem slides: “1. [short sign]” + one parenthetical qualifier. Product reveal: very short “TRY THIS >>”. Product slides use simple labels/checkmarks and short routine/CTA copy. Never sound like an article.',imageDNA:'Original clean 2D cartoon character, white/off-white background, strong single pose/action, very little scenery. After reveal, switch to casual handheld smartphone product photos in ordinary outdoor/home settings.',layout:'single'},
  {id:'style2_animated_education',name:'Style 2 — Animated Education',defaultSlides:5,description:'Original yellow adult-animation-inspired character on white with a surprising hook, simple illustrated explainer, then real UGC product closer.',flow:['N1','N12','N12','N6','N8'],copyDNA:'Hook feels like “wait… why are people [unexpected behavior]?” with one oversized red keyword. Explainers use one bold term + one plain-English sentence, not dense copy. Finish with creator-like UGC CTA.',imageDNA:'Original yellow-skinned adult-animation-inspired character design (not an existing TV character), clean white background, pink/red accent objects, simple infographic arrows/icons. Final slide becomes casual real-world UGC.',layout:'single'},
  {id:'style3_social_dialogue',name:'Style 3 — Two-Character Social Dialogue',defaultSlides:4,description:'Full-environment animated conversation: one person voices the problem, the friend answers, product enters naturally, then resolution/CTA.',flow:['N3A','N3B','N4','N8'],copyDNA:'Use short conversational quotes. Slide 1: struggling person says the problem; knowledgeable friend offers to show what they use. Slide 2: natural follow-up question + product reveal. Avoid narrator/blog copy.',imageDNA:'One complete original adult-animation-inspired environment with two consistent characters, same location/outfits across paired slides, large outlined dialogue placed near the speaker. Product enters naturally in hand.',layout:'single'},
  {id:'style3_realistic_editorial',name:'Style 3B — Realistic Editorial Macro',defaultSlides:7,description:'Real macro problem photography with elegant black serif + burgundy italic emphasis, then simple product-in-hand solution slides.',flow:['N13','N13','N13','N13','N18','N7','N8'],copyDNA:'Cover: “3 signs your [problem] are [state]” + parenthetical “most people miss…”. Each problem slide: numbered short label with one or two explanatory lines. Product reveal copy is extremely short (“give this a go”). Closing copy is punchy and editorial, not salesy.',imageDNA:'Photorealistic extreme close-ups or tightly framed real-life problem details with natural texture and imperfect phone realism. Product reveal is clean handheld bathroom/home UGC with soft neutral background.',layout:'single'},
  {id:'style4_clean_animated',name:'Style 4 — Clean Animated Signs',defaultSlides:8,description:'White-background animated character deck: bold sign hook, individual problem/action slides, then real product UGC.',flow:['N1','N2','N2','N2','N2','N6','N4','N8'],copyDNA:'Cover: “4 signs your [body/routine] need support” with a red italic emphasis phrase + small “and how to support them >>”. Problem slides: “1. [very short problem]” and one tiny “try this:” cue when grounded. Keep copy sparse.',imageDNA:'Original yellow adult-animation-inspired character on pure/near-white background, centered expressive pose, isolated simple prop, almost no environment. Product closer switches to real casual UGC.',layout:'single'},
  {id:'style5_realistic_cover',name:'Style 5 — Realistic Problem Cover',defaultSlides:6,description:'Highly realistic issue-focused cover and problem slides, then clean product application/hold shots with editorial burgundy copy.',flow:['N19','N13','N13','N18','N7','N8'],copyDNA:'Cover is a blunt “4 signs [problem] need help” style hook with short numbered labels. Follow-ups stay concise. Product slides use large elegant black serif with burgundy italic emphasis such as “give this a go” / “I swear by this [product type]”.',imageDNA:'Photorealistic smartphone macro/detail photography. Cover may use a deliberate 2×2 issue montage because that is the defining reference layout; all non-cover slides are single-scene. Product shots are clean, close, handheld, naturally lit.',layout:'cover_4'},
  {id:'style6_fashion_two_slide',name:'Style 6 — Two-Slide Fashion',defaultSlides:2,description:'Exactly two slides: casual mirror fit check, then color/variant display. Blue editorial serif typography.',flow:['N14','N15'],copyDNA:'Slide 1: “This [item] is so cute” + short black parenthetical such as “(affordable too)” only if price/value is supported. Slide 2: “[N] colours / pick yours” + soft purchase-location line. Very little text.',imageDNA:'Photorealistic fashion UGC in a tasteful ordinary bedroom/home. Slide 1 mirror selfie/fit check. Slide 2 same item displayed in available colors/variants on bed/chair, natural phone photo. Preserve garment design exactly from references.',layout:'single'},
  {id:'style7_problem_solution',name:'Style 7 — Problem → Solution',defaultSlides:7,description:'Direct split problem/solution opener followed by very literal product feature/use slides and UGC closer.',flow:['N17','N4','N4','N4','N5','N7','N8'],copyDNA:'Be literal and fast. Opener labels “PROBLEM” and “SOLUTION” with one short problem phrase and the product/solution. Later slides use short product labels + one checkable support line. Avoid long persuasion copy.',imageDNA:'Opening slide may use one deliberate vertical split: illustrated/realistic problem on left and product/solution on right. Later slides use simple product UGC with bold labels, arrows and checkmarks.',layout:'split_problem_solution'},
  {id:'style8_chat_story',name:'Style 8 — Mobile Chat Story',defaultSlides:2,description:'Two-slide conversational hook: a generic mobile chat screenshot with embedded UGC photo, followed by a direct product UGC response/CTA.',flow:['N16','N8'],copyDNA:'Slide 1 is a believable two-person chat: friend asks where the product/snack/item came from; “Me” answers with a short tease. Slide 2 gives the product answer and factual offer/CTA only when supplied. Casual slang is allowed but should fit the audience.',imageDNA:'Slide 1 uses a generic mobile-chat UI (not branded as Snapchat) with one embedded casual UGC photo. Slide 2 is a raw product-on-desk/handheld phone photo with large outlined creator text.',layout:'chat'}
];

export const SLIDE_TYPES = {
  N1:{name:'Character Hook',kind:'illustrated',product:false,textStyle:'type2',instruction:'Simple hook composition with one expressive character and strong negative space.'},
  N2:{name:'Problem Character',kind:'illustrated',product:false,textStyle:'type1',instruction:'One relatable problem/action with one or two simple props. Do not show product before reveal.'},
  N3A:{name:'Problem Dialogue Scene',kind:'illustrated_scene',product:false,textStyle:'type4',instruction:'Two-character social scene with one frustration and one response. Preserve continuity.'},
  N3B:{name:'Resolution Dialogue Scene',kind:'illustrated_scene',product:true,textStyle:'type4',instruction:'Same people/location; product enters naturally and conversation advances.'},
  N3C:{name:'Continuous Scene Sequence',kind:'illustrated_scene',product:false,textStyle:'type4',instruction:'One frame of a continuous mini-story; match paired frame.'},
  N4:{name:'Feature Product Shot',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Casual real-world product photo with 1–2 checkable feature callouts rendered directly as part of the finished GPT Image 2 slide.'},
  N5:{name:'Ingredient / Feature Reveal',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Realistic product scene supporting supplied ingredients/features only.'},
  N6:{name:'UGC Hold & Tell',kind:'product_ugc',product:true,textStyle:'type4',instruction:'Casual hand/creator holding the real product in an ordinary setting.'},
  N7:{name:'How-To / Routine',kind:'product_ugc',product:true,textStyle:'type3',instruction:'One clear product-in-use/routine moment.'},
  N8:{name:'CTA Product Closer',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Strong but casual product closer; no invented deal/urgency.'},
  N10:{name:'Social Proof / Fact',kind:'product_ugc',product:true,textStyle:'type3',instruction:'Use only supplied factual proof. No invented ratings/reviews.'},
  N11:{name:'Secret Tip',kind:'product_ugc',product:true,textStyle:'type3',instruction:'One supported practical tip with product naturally visible.'},
  N12:{name:'Animated Explainer',kind:'illustrated',product:false,textStyle:'type2',instruction:'White-background original animated explainer with one character/diagram and a simple concept flow.'},
  N13:{name:'Realistic Macro Problem',kind:'realistic_macro',product:false,textStyle:'type1',instruction:'Photorealistic close-up showing one specific visible issue/detail with natural texture.'},
  N14:{name:'Fashion Mirror Selfie',kind:'fashion_ugc',product:true,textStyle:'type6',instruction:'Casual full-body mirror fit check in a normal tasteful room; garment is the hero.'},
  N15:{name:'Fashion Variant Display',kind:'fashion_ugc',product:true,textStyle:'type6',instruction:'Same garment/item displayed naturally in available variants/colors; no studio flat-lay polish.'},
  N16:{name:'Mobile Chat Story',kind:'chat',product:true,textStyle:'type7',instruction:'Generate the complete generic mobile-chat slide, including embedded casual UGC photo and exact readable chat text; do not imitate a real messaging-app brand.'},
  N17:{name:'Problem / Solution Compare',kind:'comparison',product:true,textStyle:'type8',instruction:'One intentional vertical split: problem subject on left, supplied product/solution on right.'},
  N18:{name:'Editorial Product Hold',kind:'product_ugc',product:true,textStyle:'type2',instruction:'Clean handheld product photo with soft neutral background and ample editorial text space.'},
  N19:{name:'Realistic 4-Issue Cover',kind:'realistic_macro',product:false,textStyle:'type2',instruction:'A deliberate 2×2 montage of four close-up issue details. This multipanel layout is allowed only for this reference cover.'}
};

export const COPY_STYLES = {
  type1:{name:'Type 1 — Editorial Serif',description:'Black serif/italic problem copy; short number + parenthetical or explanation.'},
  type2:{name:'Type 2 — Editorial Emphasis',description:'Black setup + oversized burgundy/red italic emphasis.'},
  type3:{name:'Type 3 — White Pill Box',description:'Rounded white labels with bold black UGC/product copy.'},
  type4:{name:'Type 4 — White Outline',description:'Bold white text with dark outline for dialogue/UGC.'},
  type5:{name:'Type 5 — Product Label',description:'Bold colored label treatment.'},
  type6:{name:'Type 6 — Blue Fashion Serif',description:'Large bright-blue italic serif + smaller black parenthetical.'},
  type7:{name:'Type 7 — Mobile Chat UI',description:'Generic mobile-chat UI with exact message text and embedded UGC photo.'},
  type8:{name:'Type 8 — Problem / Solution',description:'PROBLEM / SOLUTION headings, red arrow, split comparison overlay.'}
};

export const DANI = {
  id:'dani',name:'Dani — Original Skill Character',
  prompt:'Dani, a consistent illustrated Black woman character with medium warm-brown skin, very voluminous shoulder-length natural black 3C/4A curls forming a large round silhouette, green-hazel almond eyes, bold arched dark brows, full nude-mauve lips, subtle small nose ring, medium-to-large gold hoop earrings, layered delicate gold necklaces, athletic/curvy build. Hair volume, gold hoops, necklaces, eye color and identity remain consistent across slides.',
  expressions:{E1:'Neutral / unbothered',E2:'Slight smile / reassurance',E3:'Bored / tired',E4:'Side-eye / skeptical',E5:'Laughing / happy',E6:'Shocked / surprised'},
  poses:{P1:'Sitting/slouched',P2:'Standing confident',P3:'Standing with lifestyle props',P4:'Holding product toward camera',P5:'Close-up expression-forward portrait',P6:'Scene/dialogue interaction'}
};

export const CHARACTER_MODES = [
  {id:'reference',name:'Reference Style Character'},
  {id:'dani',name:'Dani — Original Skill Character'},
  {id:'custom',name:'Custom Recurring Character'},
  {id:'none',name:'No Recurring Character'}
];
export const CHARACTER_STYLES = [
  {id:'none',name:'None / Product Only'},
  {id:'flat_cel',name:'Flat / Cel-Shaded'},
  {id:'editorial',name:'Editorial Illustrated'},
  {id:'animated_dialogue',name:'Original Adult Animation'},
  {id:'premium_3d',name:'Premium 3D Illustration'},
  {id:'ugc',name:'Photorealistic UGC'}
];

export function formulaById(id){return DECK_FORMULAS.find(x=>x.id===id)||DECK_FORMULAS[0];}
export function slideTypeById(id){return SLIDE_TYPES[id]||SLIDE_TYPES.N1;}
export function referenceStyleById(id){return REFERENCE_STYLES.find(x=>x.id===id)||REFERENCE_STYLES[0];}
export function formulaFlow(id,count=7){const flows={master_a:['N1','N2','N2','N2','N6','N4','N7','N8','N8'],master_b:['N3A','N3B','N4','N5','N3B','N8','N8'],master_c:['N12','N12','N4','N5','N7','N8'],gadget:['N3C','N3C','N4','N7','N8'],story_hybrid:['N1','N2','N2','N6','N4','N7','N8'],auto:['N1','N2','N2','N6','N4','N7','N8']};return (flows[id]||flows.auto).slice(0,count);}
export function referenceFlow(id,count=7){const r=referenceStyleById(id);if(id==='auto_ref')return null;const out=[...r.flow];while(out.length<count)out.push(out[out.length-1]||'N8');return out.slice(0,count);}
