import OpenAI, { toFile } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { STYLES, ASPECTS } from './config';
import { DECK_FORMULAS, STORY_ANGLES, REFERENCE_STYLES, SLIDE_TYPES, DANI, formulaById, formulaFlow, referenceStyleById, referenceFlow, slideTypeById } from './creative-system';

const openai=()=>{ if(!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing in Vercel.'); return new OpenAI({apiKey:process.env.OPENAI_API_KEY}); };
const textModel=()=>process.env.OPENAI_TEXT_MODEL||'gpt-5.6-sol';
const imageModel=()=>process.env.OPENAI_IMAGE_MODEL||'gpt-image-2';

async function structured(name,schema,prompt){
  const rsp=await openai().responses.create({ model:textModel(), reasoning:{effort:'high'}, input:prompt, text:{format:{type:'json_schema',name,schema,strict:true}} });
  if(!rsp.output_text) throw new Error('The text model returned no structured output.');
  return JSON.parse(rsp.output_text);
}

const formulaBrief=()=>DECK_FORMULAS.filter(x=>x.id!=='auto').map(x=>`${x.id}: ${x.name} — ${x.description}`).join('\n');
const angleBrief=()=>STORY_ANGLES.map(x=>`${x.id}: ${x.name}`).join('\n');

export async function generateConcepts(product, creativeDirection='', deckFormulaId='auto', characterMode='dani', referenceStyleId='auto_ref'){
  const schema={type:'object',additionalProperties:false,properties:{concepts:{type:'array',minItems:5,maxItems:5,items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},deck_formula_id:{type:'string'},angle_mechanism_id:{type:'string'},hook:{type:'string'},story_promise:{type:'string'},product_fact:{type:'string'},why_it_fits:{type:'string'},scores:{type:'object',additionalProperties:false,properties:{hook_strength:{type:'integer',minimum:1,maximum:5},relatability:{type:'integer',minimum:1,maximum:5},visual_potential:{type:'integer',minimum:1,maximum:5},buyer_intent:{type:'integer',minimum:1,maximum:5},product_fit:{type:'integer',minimum:1,maximum:5}},required:['hook_strength','relatability','visual_potential','buyer_intent','product_fit']}},required:['title','deck_formula_id','angle_mechanism_id','hook','story_promise','product_fact','why_it_fits','scores']}}},required:['concepts']};
  const chosen=formulaById(deckFormulaId);
  const ref=referenceStyleById(referenceStyleId);
  const prompt=`You are the creative director for a TikTok Shop PHOTO CAROUSEL system derived from a library of real high-performing product slide decks. Do NOT behave like a blog writer, generic supplement copywriter, buyer-guide writer, or corporate marketer.

The core system uses specific DECK FORMULAS and SLIDE TYPES. Greymike-style angles are SECONDARY mechanisms for freshness; they do not replace the product-slide formulas.

PRODUCT
Name: ${product.name}
Brand: ${product.brand||''}
Category: ${product.category||''}
Audience: ${product.audience||'Infer a plausible shopper context without inventing product effects.'}
Listing details: ${product.description||''}
Approved claims: ${product.approved_claims||''}
Prohibited claims: ${product.prohibited_claims||''}
User creative direction: ${creativeDirection||'None.'}
Character mode: ${characterMode}
Requested deck formula: ${chosen.name}
REFERENCE STYLE: ${ref.name}
Reference style description: ${ref.description}
Reference copy DNA: ${ref.copyDNA}
Reference image DNA: ${ref.imageDNA}

DECK FORMULAS
${formulaBrief()}

SECONDARY STORY ANGLES
${angleBrief()}

REFERENCE STYLE IS PRIMARY
- The named reference style controls the hook shape, text density, visual language and deck rhythm. Do not blend it with another reference style unless reference style is Auto.
- If the reference style has a fixed/short format (Fashion 2-slide, Chat 2-slide, Social Dialogue), concepts must be designed for that format.
- Use the reference copy DNA as a pattern, not as text to copy verbatim.

Create exactly FIVE strong campaign concepts.

HARD CREATIVE RULES
- Every concept must feel like a swipeable TikTok product story, not an article.
- If requested deck formula is not Auto, ALL five concepts must use that deck_formula_id and vary the hook/angle mechanism instead.
- If Auto, choose the formula that genuinely fits the product. You may use more than one formula across the five if appropriate.
- Master A should lead with recognizable signs/problems, then reveal the product later.
- Master B should feel social: dialogue, old-way/new-way, format/friction, then product.
- Master C is for systems/variants and concern-based education.
- Gadget is scene-first, demonstration-first.
- Story Hybrid keeps the original slide-type discipline but can use delayed recognition, POV, things-that-changed, etc.
- Hook language must be short, conversational, visual and native to TikTok.
- HARD BAN unless user explicitly asks: buyer checklist, label-reading lesson, “a simpler X routine”, “X comes in multiple forms”, “what the front label doesn’t tell you”, generic ingredient encyclopedia, generic benefit list, corporate wellness language.
- Product should NOT be the hook in Master A/Story Hybrid unless the product itself is inherently visually surprising.
- Ground every concept in at least one supplied product fact or format detail. If the listing lacks enough facts, use lifestyle/format/convenience storytelling and say that honestly in product_fact.
- No fake testimonials, fake ratings, fake statistics, unsupported medical/physical transformations, or invented sale/free-shipping urgency.
- Use only real product details supplied above.
- Think in visual scenes: couch, bathroom counter, gym bag, kitchen, mirror, hand-held product, social interaction, routine moment. One scene per slide.

SOURCE-SYSTEM DNA TO PRESERVE
- Recognition/problem decks should feel like: hook → relatable problem moments → product reveal → 2–3 factual reasons → use/routine → CTA.
- Social story decks should feel like: problem dialogue → frustrating old way → product/feature reveal → resolution → CTA.
- Product slides are different from character slides; do not make every slide the same visual type.
- CTA should be soft/native (“linked below”, “this is the one I’d look at”, etc.) and MUST NOT invent a sale.

For title, name the creative angle like a creator would internally, not like a blog headline.
For story_promise, summarize the emotional/story arc in one concise sentence.
For product_fact, cite the exact supplied fact/format detail anchoring the concept.`;
  const data=await structured('campaign_concepts_skill_v1',schema,prompt);
  const validFormulaIds=new Set(DECK_FORMULAS.filter(x=>x.id!=='auto').map(x=>x.id));
  const forced=deckFormulaId!=='auto'&&validFormulaIds.has(deckFormulaId)?deckFormulaId:null;
  data.concepts.forEach(c=>{ if(forced)c.deck_formula_id=forced; else if(!validFormulaIds.has(c.deck_formula_id))c.deck_formula_id='master_a'; c.total_score=Object.values(c.scores).reduce((a,b)=>a+b,0); });
  return data.concepts.sort((a,b)=>b.total_score-a.total_score);
}

export async function generatePlan({product,concept,deckFormulaId,slideCount,style,referenceStyleId='auto_ref',characterMode='dani',characterDescription='',creativeDirection=''}){
  const resolvedFormula=concept?.deck_formula_id||deckFormulaId||'master_a';
  const formula=formulaById(resolvedFormula);
  const ref=referenceStyleById(referenceStyleId);
  const suggestedTypes=referenceFlow(referenceStyleId,Number(slideCount))||formulaFlow(resolvedFormula,Number(slideCount));
  const slideTypeBrief=Object.entries(SLIDE_TYPES).map(([id,s])=>`${id}: ${s.name} — ${s.instruction}`).join('\n');
  const schema={type:'object',additionalProperties:false,properties:{name:{type:'string'},deck_formula_id:{type:'string'},slides:{type:'array',minItems:Number(slideCount),maxItems:Number(slideCount),items:{type:'object',additionalProperties:false,properties:{slide_index:{type:'integer'},role:{type:'string'},slide_type_id:{type:'string'},text:{type:'string'},emphasis_text:{type:'string'},visual:{type:'string'},product_visible:{type:'boolean'},text_style:{type:'string',enum:['type1','type2','type3','type4','type5','type6','type7','type8']},character_style:{type:'string',enum:['none','flat_cel','editorial','animated_dialogue','premium_3d','ugc']},expression_id:{type:'string',enum:['none','E1','E2','E3','E4','E5','E6']},pose_id:{type:'string',enum:['none','P1','P2','P3','P4','P5','P6']},stickers:{type:'string'},text_position:{type:'string',enum:['top','middle','bottom']},font_size:{type:'integer',minimum:40,maximum:110}},required:['slide_index','role','slide_type_id','text','emphasis_text','visual','product_visible','text_style','character_style','expression_id','pose_id','stickers','text_position','font_size']}}},required:['name','deck_formula_id','slides']};

  const characterInstruction=characterMode==='reference'
    ? `Use the recurring person/cast implied by ${ref.name}. Keep identity, outfit logic and environment continuity where the reference requires it. Do not copy any existing TV or social-media character.`
    : characterMode==='dani'
      ? `Use Dani on illustrated character slides. Dani identity: ${DANI.prompt} Dani is the knowledgeable/page-owner character in dialogue scenes, never the struggling before-person. Choose E1–E6 and P1–P6 intentionally per slide.`
      : characterMode==='custom'
        ? `Use one consistent custom recurring character on character slides: ${characterDescription||'user-defined recurring creator'}. Preserve identity, hair, clothing logic and accessories across the deck.`
        : 'Do not force a recurring character. Use product/lifestyle scenes or anonymous context-appropriate people when needed.';

  const prompt=`Build one complete ${slideCount}-slide TikTok Shop carousel using the ORIGINAL PRODUCT-SLIDE SYSTEM below. Return exactly ${slideCount} slides.

PRODUCT
${product.name}
Brand: ${product.brand||''}
Audience: ${product.audience||''}
Listing details: ${product.description||''}
Approved claims: ${product.approved_claims||''}
Do not claim: ${product.prohibited_claims||''}

APPROVED CONCEPT
Title: ${concept.title}
Hook direction: ${concept.hook}
Story promise: ${concept.story_promise||''}
Grounding fact: ${concept.product_fact||''}
Secondary angle: ${concept.angle_mechanism_id||''}
Deck formula: ${formula.name}
User creative direction: ${creativeDirection||''}
Visual preset: ${style}
REFERENCE STYLE: ${ref.name}
REFERENCE STYLE COPY DNA: ${ref.copyDNA}
REFERENCE STYLE IMAGE DNA: ${ref.imageDNA}
REFERENCE LAYOUT POLICY: ${ref.layout}

CHARACTER
${characterInstruction}

SUGGESTED SLIDE-TYPE FLOW
${suggestedTypes.join(' → ')}
You may swap a suggested slide type only when another listed type clearly fits the product/story better. Do not turn the whole deck into one repeated type.

AVAILABLE SLIDE TYPES
${slideTypeBrief}

COPY SYSTEM
- type1: editorial problem copy on light illustrated slide; short numbered/recognition language and optional relatable parenthetical.
- type2: hook typography; concise top line, a short visually dominant emphasis phrase, and a smaller support line. Put ONLY the phrase to emphasize into emphasis_text.
- type3: white pill-box product copy for UGC/product scenes.
- type4: raw white text with dark outline for dialogue/full-scene visuals.
- type5: variant/product labels when the product genuinely has variants.
- type6: bright-blue italic serif fashion copy with a smaller black parenthetical.
- type7: generic mobile-chat UI. Exact message text is rendered programmatically; visual generation should create only the embedded UGC photo.
- type8: problem/solution comparison overlay with clear headings and a red directional arrow.

MASTER FORMULA DNA
MASTER A — Signs & Solution: Character hook → 2–4 relatable problem moments → REAL product/UGC reveal → 2–3 checkable reasons/features → one use/routine moment → CTA.
MASTER B — Social Story + Product: Problem social scene → old/frustrating way → product/feature reveal → optional supported comparison → resolution scene with continuity → CTA.
MASTER C — Skincare Education: Product/system reveal → concern/variant explainers → how-to → routine placement → CTA. Use only if the listing truly has variants/system logic.
GADGET: Continuous problem scene → continuous resolution/demo → feature/demo → CTA.
STORY HYBRID: Use a Greymike-style emotional mechanism but still obey the slide-type and product-reveal discipline above.

REFERENCE-STYLE DISCIPLINE
- Follow ${ref.name} first. The slide-type flow above was selected from that reference when available.
- Copy should mimic the reference's LENGTH, RHYTHM, hierarchy and placement — not reuse its exact wording.
- If ${ref.name} is Style 6, keep the deck to two fashion slides and use type6.
- If ${ref.name} is Style 8, slide 1 must be N16/type7 chat and slide 2 must be raw product UGC.
- If ${ref.name} is Style 7, the opening N17 may use a deliberate split comparison.
- If ${ref.name} is Style 5, only N19 cover may use a deliberate 2×2 issue montage.
- For N16/type7, write text EXACTLY as two lines beginning 'Friend:' and 'Me:'. Keep each message short.
- For N17/type8, write text EXACTLY as two lines beginning 'PROBLEM:' and 'SOLUTION:'. Keep each side short.
- For type6 fashion, line 1 is the large blue phrase; line 2 may be a short parenthetical/value note only if supported.
- For type1 problem slides, lead with the number/sign label; keep any explanation to one short parenthetical or one concise line.

CURRENT USER RULES OVERRIDE OLD DATASET HABITS
- Default final aspect ratio is ${style} / ${slideCount} slides as selected by the user; do NOT assume 9:16.
- Default is ONE complete scene per slide. Exceptions ONLY when the selected reference explicitly requires it: N19 may use its controlled 2×2 cover montage; N17 may use its controlled problem/solution split; N16 is a single chat screen with one embedded image. No other collage/contact-sheet grids.
- Do NOT automatically say “they taste like sweets”; only use taste language when the listing/user supplies taste/flavor support.
- Do NOT automatically say “combine with a healthy lifestyle”; only add a trust/disclaimer line if it improves the actual story and is appropriate.
- Do NOT invent flavor ratings, review ratings, statistics, urgency, sale price, free shipping, testimonials, or claims.
- Product reveal/CTA slides should use the real product reference and realistic UGC/product photography where appropriate.
- Character/problem slides should normally NOT show the product until the reveal.
- Use 2–3 real, checkable selling points across the entire deck, not a wall of features.
- Copy should feel creator-written: concise, slightly casual, specific, not corporate.
- For Master A/Hybrid, the product should usually appear around the later half, not slide 1.
- Visual descriptions must specify subject + action + setting + framing/mood. No vague “show benefit”.

TEXT FIELD RULE
The text field is the EXACT overlay copy. For type2 hooks, use line breaks if useful and make emphasis_text a short exact phrase contained in text. Keep all text phone-readable.

Return slide_type_id from the available list only. Use product_visible=true on N4/N5/N6/N7/N8/N10/N11 unless there is a compelling reason otherwise.`;
  const data=await structured('carousel_plan_skill_v1',schema,prompt);
  const validSlideIds=new Set(Object.keys(SLIDE_TYPES));
  const specificReference=referenceStyleId!=='auto_ref';
  const styleCharacter=(slideTypeId)=>{
    if(['N4','N5','N7','N8','N10','N11','N13','N17','N18','N19'].includes(slideTypeId)) return 'none';
    if(['N14','N15'].includes(slideTypeId)) return 'ugc';
    if(slideTypeId==='N16') return 'none';
    if(['N3A','N3B','N3C'].includes(slideTypeId)) return 'animated_dialogue';
    if(['style2_animated_education','style4_clean_animated'].includes(referenceStyleId)) return 'animated_dialogue';
    if(referenceStyleId==='style1_cartoon') return 'flat_cel';
    return s=>s;
  };
  const slides=data.slides.slice(0,Number(slideCount)).map((s,i)=>{
    const fallbackId=suggestedTypes[i]||'N1';
    const slideTypeId=specificReference?fallbackId:(validSlideIds.has(s.slide_type_id)?s.slide_type_id:fallbackId);
    const st=slideTypeById(slideTypeId);
    let characterStyle=s.character_style||'none';
    if(specificReference){
      const forced=styleCharacter(slideTypeId);
      characterStyle=typeof forced==='string'?forced:characterStyle;
    }
    const defaultPosition=['type3','type5'].includes(st.textStyle)?'top':s.text_position||'top';
    const defaultSize=st.textStyle==='type6'?82:st.textStyle==='type7'?58:st.textStyle==='type8'?64:st.textStyle==='type2'?78:st.textStyle==='type1'?68:(s.font_size||68);
    return {...s,slide_index:i+1,slide_type_id:slideTypeId,product_visible:st.product?true:Boolean(s.product_visible),text_style:specificReference?st.textStyle:(s.text_style||st.textStyle),character_style:characterStyle,text_position:defaultPosition,font_size:defaultSize};
  });
  return {...data,deck_formula_id:resolvedFormula,reference_style_id:referenceStyleId,slides};
}

export async function generateCaption(product,campaign){
  const rsp=await openai().responses.create({model:textModel(),input:`Write a concise TikTok Shop caption for this carousel. Product: ${product.name}. Campaign: ${campaign.name}. Deck formula: ${campaign.deck_formula_id||''}. Sound like a creator, not a brand brochure. Use only supplied product facts, no unsupported claims, fake reviews, fake urgency, invented sale or free shipping. Include a soft natural CTA. Return caption only.`});
  return rsp.output_text.trim();
}

function referenceCharacterPrompt(campaign,slide){
  const id=campaign.reference_style_id||'auto_ref';
  if(['style2_animated_education','style4_clean_animated'].includes(id)) return 'Use the SAME original yellow-skinned adult-animation-inspired creator across character slides, with bold clean linework and expressive face. The character must be original and must not resemble or reproduce any existing TV character.';
  if(id==='style3_social_dialogue') return 'Use the SAME two original yellow-skinned adult-animation-inspired adults across dialogue slides. Preserve both identities, hair, outfits, room and spatial relationship from slide to slide. Do not resemble or reproduce any existing TV characters.';
  if(id==='style1_cartoon') return 'Use the SAME original clean 2D cartoon creator across the illustrated problem slides. Choose an audience-appropriate adult identity and preserve hair, face, outfit and body design consistently. White/off-white background and simple expressive posing.';
  if(id==='style6_fashion_two_slide') return 'Use the SAME photorealistic UGC fashion creator and the exact same garment across both slides. Preserve the creator identity and garment design; slide 2 may change only supported color/variant.';
  return '';
}

function characterPrompt(campaign,slide){
  if(slide.character_style==='none'||campaign.character_mode==='none')return '';
  const styleMap={
    flat_cel:'flat/cel-shaded original 2D illustration with bold clean outlines and 2–3 tonal values',
    editorial:'detailed editorial fashion illustration with refined shading',
    animated_dialogue:'original adult-animation-inspired 2D scene with clean bold linework; do not imitate or reproduce any existing TV characters',
    premium_3d:'premium stylized 3D animated illustration with soft realistic lighting',
    ugc:'photorealistic casual smartphone UGC creator photo'
  };
  if(campaign.character_mode==='reference') return `${styleMap[slide.character_style]||''}. ${referenceCharacterPrompt(campaign,slide)}`.trim();
  const identity=campaign.character_mode==='dani'?DANI.prompt:(campaign.character_description||'the same recurring creator');
  const expr=slide.expression_id&&slide.expression_id!=='none'?(DANI.expressions[slide.expression_id]||slide.expression_id):'';
  const pose=slide.pose_id&&slide.pose_id!=='none'?(DANI.poses[slide.pose_id]||slide.pose_id):'';
  return `${styleMap[slide.character_style]||styleMap.flat_cel}. Keep recurring identity consistent: ${identity}. Expression: ${expr||'natural for the scene'}. Pose: ${pose||'natural for the scene'}.`;
}

export function imagePrompt(product,campaign,slide){
  const preset=STYLES[campaign.style]||STYLES['Mixed Illustrated + UGC'];
  const ref=referenceStyleById(campaign.reference_style_id||'auto_ref');
  const st=slideTypeById(slide.slide_type_id);
  const character=characterPrompt(campaign,slide);
  const productRule=slide.product_visible
    ? `The real product ${product.name} is visible. Use the supplied product reference as the packaging source of truth. Preserve container shape, dominant colors, label layout, logo placement and proportions. Keep the entire product in frame. Do not invent a competing brand or change bottle/package color.`
    : 'Do not show or invent the product on this slide.';
  const layoutRule=slide.slide_type_id==='N19'?'A deliberate clean 2x2 montage of four macro issue close-ups is REQUIRED for this cover only.':slide.slide_type_id==='N17'?'A deliberate clean vertical split comparison is REQUIRED: problem on left, product/solution on right.':slide.slide_type_id==='N16'?'Generate ONE casual UGC photo suitable to be embedded inside a mobile chat screenshot; do not generate chat UI or any text.':'ONE complete scene only. NEVER a collage, contact sheet, before/after grid, or multiple frames.';
  return `${preset.prompt}. Reference style: ${ref.name}. Reference visual DNA: ${ref.imageDNA}. Vertical ${campaign.aspect_ratio} TikTok product-carousel slide. Slide type ${slide.slide_type_id}: ${st.name}. ${st.instruction}. ${layoutRule} Slide role: ${slide.role}. Scene: ${slide.visual}. ${character} ${productRule} Do NOT generate ANY text, words, letters, numbers, labels, captions, UI text, watermarks or signage inside the image. The visual must be text-free; exact typography is composited afterward. If a style reference contains text, IGNORE its words completely and use only broad composition/visual treatment. Leave intentional negative space appropriate to the reference style near ${slide.text_position||'top'}. Keep important subjects away from extreme edges for final ${campaign.aspect_ratio} crop. No third-party logos besides the supplied product branding, no prices/retail messaging unless explicitly supplied, no illegible generated text, levitating products, physics-breaking orientation, warped product scale, moving screens, steam/moving water/fire, or clutter competing with the focal subject.`;
}

const STYLE_REFERENCE_FILES={
  style1_cartoon:{file:'style1-cartoon.jpg',slideTypes:['N1','N2']},
  style2_animated_education:{file:'style2-animated.jpg',slideTypes:['N1','N12']},
  style3_social_dialogue:{file:'style3-dialogue.jpg',slideTypes:['N3A','N3B']},
  style3_realistic_editorial:{file:'style3b-realistic.jpg',slideTypes:['N13']},
  style4_clean_animated:{file:'style4-clean-animated.jpg',slideTypes:['N1','N2']},
  style5_realistic_cover:{file:'style5-realistic-cover.jpg',slideTypes:['N19','N13']},
  style6_fashion_two_slide:{file:'style6-fashion.jpg',slideTypes:['N14','N15']},
  style7_problem_solution:{file:'style7-problem-solution.jpg',slideTypes:['N17']}
};

async function styleReferenceFile(campaign,slide){
  const cfg=STYLE_REFERENCE_FILES[campaign.reference_style_id];
  if(!cfg||!cfg.slideTypes.includes(slide.slide_type_id))return null;
  try{
    const buf=await fs.readFile(path.join(process.cwd(),'public','reference-styles',cfg.file));
    return await toFile(buf,`style-reference-${cfg.file}`,{type:'image/jpeg'});
  }catch{return null;}
}

function imageBytes(result){
  const item=result?.data?.[0];
  if(item?.b64_json) return Buffer.from(item.b64_json,'base64');
  throw new Error('Image API returned no image bytes. Check the image model and OpenAI account permissions.');
}

export async function generateBaseImage({product,campaign,slide}){
  const client=openai();
  let prompt=imagePrompt(product,campaign,slide);
  const size=ASPECTS[campaign.aspect_ratio]?.aiSize||'1024x1536';
  try{
    const refs=[];
    if(slide.product_visible && product.image_urls?.length){
      for(const [i,url] of product.image_urls.slice(0,2).entries()){
        const r=await fetch(url,{cache:'no-store'});
        if(r.ok){
          const buf=Buffer.from(await r.arrayBuffer());
          refs.push(await toFile(buf,`product-${i+1}.png`,{type:r.headers.get('content-type')||'image/png'}));
        }
      }
    }
    const styleRef=await styleReferenceFile(campaign,slide);
    if(styleRef){
      refs.push(styleRef);
      prompt += ' A supplied STYLE REFERENCE image may also be present. Use it only for high-level composition, whitespace, framing, illustration/photo treatment and visual hierarchy. Do not copy its person, product, words, labels, logos, exact scene, or distinctive copyrighted character design. Create an original scene for this product.';
    }
    if(refs.length){
      const result=await client.images.edit({model:imageModel(),image:refs,prompt,size,quality:'medium'});
      return {bytes:imageBytes(result),prompt};
    }
    const result=await client.images.generate({model:imageModel(),prompt,size,quality:'medium'});
    return {bytes:imageBytes(result),prompt};
  }catch(err){
    const status=err?.status?` (HTTP ${err.status})`:'';
    const detail=err?.error?.message||err?.message||String(err);
    throw new Error(`OpenAI image generation failed${status}: ${detail}`);
  }
}
