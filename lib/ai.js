import OpenAI, { toFile } from 'openai';
import { SKELETONS, STYLES, ASPECTS } from './config';

const openai=()=>{ if(!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing in Vercel.'); return new OpenAI({apiKey:process.env.OPENAI_API_KEY}); };
const textModel=()=>process.env.OPENAI_TEXT_MODEL||'gpt-5.6-sol';
const imageModel=()=>process.env.OPENAI_IMAGE_MODEL||'gpt-image-2';

async function structured(name,schema,prompt){
  const rsp=await openai().responses.create({ model:textModel(), reasoning:{effort:'high'}, input:prompt, text:{format:{type:'json_schema',name,schema,strict:true}} });
  if(!rsp.output_text) throw new Error('The text model returned no structured output.');
  return JSON.parse(rsp.output_text);
}

export async function generateConcepts(product, creativeDirection=''){
  const schema={type:'object',additionalProperties:false,properties:{concepts:{type:'array',minItems:5,maxItems:5,items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},skeleton_id:{type:'string'},hook:{type:'string'},angle:{type:'string'},product_fact:{type:'string'},why_it_fits:{type:'string'},scores:{type:'object',additionalProperties:false,properties:{hook_strength:{type:'integer',minimum:1,maximum:5},relatability:{type:'integer',minimum:1,maximum:5},visual_potential:{type:'integer',minimum:1,maximum:5},buyer_intent:{type:'integer',minimum:1,maximum:5},product_fit:{type:'integer',minimum:1,maximum:5}},required:['hook_strength','relatability','visual_potential','buyer_intent','product_fit']}},required:['title','skeleton_id','hook','angle','product_fact','why_it_fits','scores']}}},required:['concepts']};
  const skeletonBrief=SKELETONS.map(s=>`${s.id}: ${s.name} — ${s.description}`).join('\n');
  const prompt=`You are a senior direct-response creative strategist for TikTok Shop PHOTO CAROUSELS. Your job is to create scroll-stopping story concepts that feel like posts people would actually swipe through, not generic supplement education, corporate copy, or a buyer-guide article.

Create exactly 5 DISTINCT campaign concepts. Each concept must feel like a different TikTok story, not five rewrites of the same product explainer. Use the available Greymike-style story skeletons as structural inspiration, but write entirely original copy for this product.

QUALITY BAR
- Lead with a human tension, confession, frustration, curiosity gap, identity moment, surprising observation, or strong opinion.
- Hooks should sound natural on TikTok. Short, specific, conversational. They may be punchy, playful, skeptical, emotional, or curiosity-driven.
- HARD BAN unless explicitly requested: buyer checklists, label-reading angles, supplement-format explainers, ‘a simpler X routine’, ‘X comes in many forms’, ‘what the front label doesn’t tell you’, generic benefit lists, ingredient encyclopedias, or corporate wellness language.
- The concept title itself should sound like a creator/content angle, not a blog article or merchandising category.
- Do not make the whole concept about compliance, fine print, labels, or disclaimers. Compliance is a boundary, not the creative idea.
- Product should usually be hidden for the first 3-4 slides, then become the answer/choice/reveal.
- Anchor each concept to at least ONE specific real differentiator or fact from the supplied product data. If the listing does not contain enough facts, use a lifestyle/convenience/format story rather than inventing benefits.
- No invented testimonials, fake statistics, medical guarantees, fake urgency, or unsupported before/after claims.
- You may infer normal human situations around the product category, but do not invent factual product effects.
- Favor visual story potential: rooms, routines, hands, products in use, awkward/frustrating moments, before-vs-after ROUTINE contrast (not medical body-result claims).

PRODUCT
Name: ${product.name}
Brand: ${product.brand||''}
Audience: ${product.audience||'Infer a plausible shopper context from the listing, without inventing health claims.'}
Description / listing details: ${product.description||''}
Approved claims: ${product.approved_claims||''}
Prohibited claims: ${product.prohibited_claims||''}
User creative direction: ${creativeDirection||'None. Prioritize strong relatable storyflow and curiosity.'}

AVAILABLE STORY SKELETONS
${skeletonBrief}

DIVERSITY REQUIREMENT
Across the five concepts, use five different skeleton_ids when possible. Prioritize these mechanisms: delayed realization/confession, recognition/signs, frustrating old way, under-discussed truth/opinion, and a personal ‘this helped me / what I changed’ story. Only use a buyer-intent/checklist concept when the product category genuinely benefits from it and it can still feel native to TikTok.

For product_fact, state the exact supplied fact/differentiator the concept is grounded in. If the concept is primarily lifestyle/format-driven, say which supplied format/detail makes the story relevant.`;
  const data=await structured('campaign_concepts_v2',schema,prompt);
  data.concepts.forEach(c=>c.total_score=Object.values(c.scores).reduce((a,b)=>a+b,0));
  return data.concepts.sort((a,b)=>b.total_score-a.total_score);
}

export async function generatePlan({product,concept,skeletonId,slideCount,style,characterDescription,creativeDirection=''}){
  const skeleton=SKELETONS.find(s=>s.id===skeletonId)||SKELETONS[0];
  const schema={type:'object',additionalProperties:false,properties:{name:{type:'string'},slides:{type:'array',minItems:5,maxItems:8,items:{type:'object',additionalProperties:false,properties:{slide_index:{type:'integer'},role:{type:'string'},text:{type:'string'},visual:{type:'string'},product_visible:{type:'boolean'},text_position:{type:'string',enum:['top','middle','bottom']},font_size:{type:'integer',minimum:44,maximum:96}},required:['slide_index','role','text','visual','product_visible','text_position','font_size']}}},required:['name','slides']};
  const flow=skeleton.flow.slice(0,slideCount).join(' → ');
  const prompt=`Build one high-retention ${slideCount}-slide TikTok Shop photo carousel from the approved concept below. Return exactly ${slideCount} slides.

PRODUCT
${product.name}
Brand: ${product.brand||''}
Audience: ${product.audience||''}
Listing details: ${product.description||''}
Approved claims: ${product.approved_claims||''}
Do not claim: ${product.prohibited_claims||''}

CONCEPT
Title: ${concept.title}
Opening hook direction: ${concept.hook}
Angle: ${concept.angle}
Grounding fact: ${concept.product_fact||''}
Skeleton: ${skeleton.name}
Flow: ${flow}
User creative direction: ${creativeDirection||''}
Visual preset: ${style}
Character continuity: ${characterDescription||'No required recurring character.'}

STORY RULES
- This is a STORYFLOW ad, not an informational deck.
- Slide 1 must be the strongest hook and should usually show NO product.
- Slides 2-4 should escalate the same tension/story instead of jumping to unrelated facts.
- Product reveal happens later and should feel earned.
- Use only 2-3 real, checkable selling points across the entire campaign, woven naturally into later slides.
- Keep on-screen text concise, conversational, and emotionally legible on a phone. Avoid headings that sound like blog titles.
- Each slide is one complete scene; never a collage, split-screen, infographic grid, or multi-panel layout.
- Visual descriptions must be concrete enough to generate: subject, action, setting, framing/mood. Avoid vague “show benefits” language.
- Product-visible slides should make the product physically plausible and entirely in frame.
- No invented reviews/testimonials, fake numbers, medical treatment claims, or unsupported physical transformations.
- Do not add disclaimers or compliance language to the slide text unless the user specifically asked for it.
- The last slide can be a simple CTA/product reminder, not a legal disclaimer.
`;
  const data=await structured('carousel_plan_v2',schema,prompt);
  return {...data,slides:data.slides.slice(0,slideCount).map((s,i)=>({...s,slide_index:i+1}))};
}

export async function generateCaption(product,campaign){
  const rsp=await openai().responses.create({model:textModel(),input:`Write a concise TikTok Shop caption for this carousel. Product: ${product.name}. Campaign: ${campaign.name}. Sound natural, not corporate. Use only supplied product facts, no unsupported claims, no fake urgency. Include a natural CTA. Return caption only.`});
  return rsp.output_text.trim();
}

export function imagePrompt(product,campaign,slide){
  const preset=STYLES[campaign.style]||STYLES['Casual UGC'];
  return `${preset.prompt}. Vertical ${campaign.aspect_ratio} TikTok photo-carousel slide. ONE complete scene only, NEVER a collage, split screen, contact sheet, before/after panel, or multiple frames. Slide role: ${slide.role}. Scene: ${slide.visual}. ${campaign.character_description?`Keep this recurring character consistent: ${campaign.character_description}.`:''} ${slide.product_visible?`The real product ${product.name} is visible. Preserve the supplied product reference's packaging identity: shape, dominant colors, label layout, logo placement and proportions. Do not invent a different container or competing brand. Keep the product entirely in frame.`:`Do not show or invent the product on this slide.`} Do not generate the headline as text inside the image; leave clean negative space near ${slide.text_position||'top'} because exact typography will be composited later. Keep important subjects away from the extreme edges so the portrait source can be safely cropped to ${campaign.aspect_ratio}. No third-party brand logos, prices, retail messaging, illegible text, levitating products, warped product scale, animated/moving screens, or clutter that competes with the subject.`;
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
