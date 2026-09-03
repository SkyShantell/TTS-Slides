import OpenAI, { toFile } from 'openai';
import { STYLES, ASPECTS } from './config';
import { DECK_FORMULAS, STORY_ANGLES, SLIDE_TYPES, DANI, formulaById, formulaFlow, slideTypeById } from './creative-system';

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

export async function generateConcepts(product, creativeDirection='', deckFormulaId='auto', characterMode='dani'){
  const schema={type:'object',additionalProperties:false,properties:{concepts:{type:'array',minItems:5,maxItems:5,items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},deck_formula_id:{type:'string'},angle_mechanism_id:{type:'string'},hook:{type:'string'},story_promise:{type:'string'},product_fact:{type:'string'},why_it_fits:{type:'string'},scores:{type:'object',additionalProperties:false,properties:{hook_strength:{type:'integer',minimum:1,maximum:5},relatability:{type:'integer',minimum:1,maximum:5},visual_potential:{type:'integer',minimum:1,maximum:5},buyer_intent:{type:'integer',minimum:1,maximum:5},product_fit:{type:'integer',minimum:1,maximum:5}},required:['hook_strength','relatability','visual_potential','buyer_intent','product_fit']}},required:['title','deck_formula_id','angle_mechanism_id','hook','story_promise','product_fact','why_it_fits','scores']}}},required:['concepts']};
  const chosen=formulaById(deckFormulaId);
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

DECK FORMULAS
${formulaBrief()}

SECONDARY STORY ANGLES
${angleBrief()}

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

export async function generatePlan({product,concept,deckFormulaId,slideCount,style,characterMode='dani',characterDescription='',creativeDirection=''}){
  const resolvedFormula=concept?.deck_formula_id||deckFormulaId||'master_a';
  const formula=formulaById(resolvedFormula);
  const suggestedTypes=formulaFlow(resolvedFormula,Number(slideCount));
  const slideTypeBrief=Object.entries(SLIDE_TYPES).map(([id,s])=>`${id}: ${s.name} — ${s.instruction}`).join('\n');
  const schema={type:'object',additionalProperties:false,properties:{name:{type:'string'},deck_formula_id:{type:'string'},slides:{type:'array',minItems:Number(slideCount),maxItems:Number(slideCount),items:{type:'object',additionalProperties:false,properties:{slide_index:{type:'integer'},role:{type:'string'},slide_type_id:{type:'string'},text:{type:'string'},emphasis_text:{type:'string'},visual:{type:'string'},product_visible:{type:'boolean'},text_style:{type:'string',enum:['type1','type2','type3','type4','type5']},character_style:{type:'string',enum:['none','flat_cel','editorial','animated_dialogue','premium_3d','ugc']},expression_id:{type:'string',enum:['none','E1','E2','E3','E4','E5','E6']},pose_id:{type:'string',enum:['none','P1','P2','P3','P4','P5','P6']},stickers:{type:'string'},text_position:{type:'string',enum:['top','middle','bottom']},font_size:{type:'integer',minimum:40,maximum:110}},required:['slide_index','role','slide_type_id','text','emphasis_text','visual','product_visible','text_style','character_style','expression_id','pose_id','stickers','text_position','font_size']}}},required:['name','deck_formula_id','slides']};

  const characterInstruction=characterMode==='dani'
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

MASTER FORMULA DNA
MASTER A — Signs & Solution: Character hook → 2–4 relatable problem moments → REAL product/UGC reveal → 2–3 checkable reasons/features → one use/routine moment → CTA.
MASTER B — Social Story + Product: Problem social scene → old/frustrating way → product/feature reveal → optional supported comparison → resolution scene with continuity → CTA.
MASTER C — Skincare Education: Product/system reveal → concern/variant explainers → how-to → routine placement → CTA. Use only if the listing truly has variants/system logic.
GADGET: Continuous problem scene → continuous resolution/demo → feature/demo → CTA.
STORY HYBRID: Use a Greymike-style emotional mechanism but still obey the slide-type and product-reveal discipline above.

CURRENT USER RULES OVERRIDE OLD DATASET HABITS
- Default final aspect ratio is ${style} / ${slideCount} slides as selected by the user; do NOT assume 9:16.
- ONE complete scene per slide. NO collage, split screen, contact sheet or 4-panel grid. Convert old timing-grid ideas into a single clear routine scene or multiple separate slides.
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
  const slides=data.slides.slice(0,Number(slideCount)).map((s,i)=>{
    const fallbackId=suggestedTypes[i]||'N1';
    const slideTypeId=validSlideIds.has(s.slide_type_id)?s.slide_type_id:fallbackId;
    const st=slideTypeById(slideTypeId);
    return {...s,slide_index:i+1,slide_type_id:slideTypeId,product_visible:st.product?true:Boolean(s.product_visible),text_style:s.text_style||st.textStyle};
  });
  return {...data,deck_formula_id:resolvedFormula,slides};
}

export async function generateCaption(product,campaign){
  const rsp=await openai().responses.create({model:textModel(),input:`Write a concise TikTok Shop caption for this carousel. Product: ${product.name}. Campaign: ${campaign.name}. Deck formula: ${campaign.deck_formula_id||''}. Sound like a creator, not a brand brochure. Use only supplied product facts, no unsupported claims, fake reviews, fake urgency, invented sale or free shipping. Include a soft natural CTA. Return caption only.`});
  return rsp.output_text.trim();
}

function characterPrompt(campaign,slide){
  if(slide.character_style==='none'||campaign.character_mode==='none')return '';
  const styleMap={
    flat_cel:'flat/cel-shaded original 2D illustration with bold clean outlines and 2–3 tonal values',
    editorial:'detailed editorial fashion illustration with refined shading',
    animated_dialogue:'original adult animated-sitcom-inspired 2D scene with clean bold linework; do not imitate or reproduce any existing TV characters',
    premium_3d:'premium stylized 3D animated illustration with soft realistic lighting',
    ugc:'photorealistic casual smartphone UGC creator photo'
  };
  const identity=campaign.character_mode==='dani'?DANI.prompt:(campaign.character_description||'the same recurring creator');
  const expr=slide.expression_id&&slide.expression_id!=='none'?(DANI.expressions[slide.expression_id]||slide.expression_id):'';
  const pose=slide.pose_id&&slide.pose_id!=='none'?(DANI.poses[slide.pose_id]||slide.pose_id):'';
  return `${styleMap[slide.character_style]||styleMap.flat_cel}. Keep recurring identity consistent: ${identity}. Expression: ${expr||'natural for the scene'}. Pose: ${pose||'natural for the scene'}.`;
}

export function imagePrompt(product,campaign,slide){
  const preset=STYLES[campaign.style]||STYLES['Mixed Illustrated + UGC'];
  const st=slideTypeById(slide.slide_type_id);
  const character=characterPrompt(campaign,slide);
  const productRule=slide.product_visible
    ? `The real product ${product.name} is visible. Use the supplied product reference as the packaging source of truth. Preserve container shape, dominant colors, label layout, logo placement and proportions. Keep the entire product in frame. Do not invent a competing brand or change bottle/package color.`
    : 'Do not show or invent the product on this slide.';
  return `${preset.prompt}. Vertical ${campaign.aspect_ratio} TikTok product-carousel slide. Slide type ${slide.slide_type_id}: ${st.name}. ${st.instruction}. ONE complete scene only, NEVER a collage, split screen, contact sheet, before/after panel, four-panel grid, or multiple frames. Slide role: ${slide.role}. Scene: ${slide.visual}. ${character} ${productRule} Do NOT generate the overlay headline/copy as text inside the image; exact typography is composited afterward. Leave clean negative space near ${slide.text_position||'top'}. Keep important subjects away from extreme edges for final ${campaign.aspect_ratio} crop. No third-party logos besides the supplied product branding, no prices/retail messaging unless explicitly supplied, no illegible generated text, levitating products, physics-breaking orientation, warped product scale, moving screens, steam/moving water/fire, or clutter competing with the focal subject.`;
}

function imageBytes(result){
  const item=result?.data?.[0];
  if(item?.b64_json) return Buffer.from(item.b64_json,'base64');
  throw new Error('Image API returned no image bytes. Check the image model and OpenAI account permissions.');
}

export async function generateBaseImage({product,campaign,slide}){
  const client=openai();
  const prompt=imagePrompt(product,campaign,slide);
  const size=ASPECTS[campaign.aspect_ratio]?.aiSize||'1024x1536';
  try{
    if(slide.product_visible && product.image_urls?.length){
      const refs=[];
      for(const [i,url] of product.image_urls.slice(0,2).entries()){
        const r=await fetch(url,{cache:'no-store'});
        if(r.ok){
          const buf=Buffer.from(await r.arrayBuffer());
          refs.push(await toFile(buf,`product-${i+1}.png`,{type:r.headers.get('content-type')||'image/png'}));
        }
      }
      if(refs.length){
        const result=await client.images.edit({model:imageModel(),image:refs,prompt,size,quality:'medium'});
        return {bytes:imageBytes(result),prompt};
      }
    }
    const result=await client.images.generate({model:imageModel(),prompt,size,quality:'medium'});
    return {bytes:imageBytes(result),prompt};
  }catch(err){
    const status=err?.status?` (HTTP ${err.status})`:'';
    const detail=err?.error?.message||err?.message||String(err);
    throw new Error(`OpenAI image generation failed${status}: ${detail}`);
  }
}
