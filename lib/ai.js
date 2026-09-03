import OpenAI, { toFile } from 'openai';
import { SKELETONS, STYLES, ASPECTS } from './config';

const openai=()=>{ if(!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing in Vercel.'); return new OpenAI({apiKey:process.env.OPENAI_API_KEY}); };
const textModel=()=>process.env.OPENAI_TEXT_MODEL||'gpt-5.6-sol';
const imageModel=()=>process.env.OPENAI_IMAGE_MODEL||'gpt-image-2';

async function structured(name,schema,prompt){
  const rsp=await openai().responses.create({ model:textModel(), reasoning:{effort:'medium'}, input:prompt, text:{format:{type:'json_schema',name,schema,strict:true}} });
  return JSON.parse(rsp.output_text);
}

export async function generateConcepts(product){
  const schema={type:'object',additionalProperties:false,properties:{concepts:{type:'array',minItems:5,maxItems:5,items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},skeleton_id:{type:'string'},hook:{type:'string'},angle:{type:'string'},why_it_fits:{type:'string'},scores:{type:'object',additionalProperties:false,properties:{curiosity:{type:'integer',minimum:1,maximum:5},visual_potential:{type:'integer',minimum:1,maximum:5},buyer_intent:{type:'integer',minimum:1,maximum:5},product_fit:{type:'integer',minimum:1,maximum:5},compliance:{type:'integer',minimum:1,maximum:5}},required:['curiosity','visual_potential','buyer_intent','product_fit','compliance']}},required:['title','skeleton_id','hook','angle','why_it_fits','scores']}}},required:['concepts']};
  const skeletonBrief=SKELETONS.map(s=>`${s.id}: ${s.name} — ${s.description}`).join('\n');
  const prompt=`You are the campaign strategist for a TikTok Shop carousel generator. Create exactly 5 distinctly different campaign concepts for the product below. Use only real/checkable details supplied. Avoid medical guarantees, invented testimonials, fake statistics, fake urgency, or unsupported before/after claims. The product should normally appear later, not in the hook. Keep hooks concise and strong.\n\nPRODUCT\nName: ${product.name}\nBrand: ${product.brand||''}\nAudience: ${product.audience||''}\nDescription: ${product.description||''}\nApproved claims: ${product.approved_claims||''}\nProhibited claims: ${product.prohibited_claims||''}\n\nAVAILABLE SKELETONS\n${skeletonBrief}\n\nChoose a valid skeleton_id for every concept.`;
  const data=await structured('campaign_concepts',schema,prompt);
  data.concepts.forEach(c=>c.total_score=Object.values(c.scores).reduce((a,b)=>a+b,0));
  return data.concepts.sort((a,b)=>b.total_score-a.total_score);
}

export async function generatePlan({product,concept,skeletonId,slideCount,style,characterDescription}){
  const skeleton=SKELETONS.find(s=>s.id===skeletonId)||SKELETONS[0];
  const schema={type:'object',additionalProperties:false,properties:{name:{type:'string'},slides:{type:'array',minItems:5,maxItems:8,items:{type:'object',additionalProperties:false,properties:{slide_index:{type:'integer'},role:{type:'string'},text:{type:'string'},visual:{type:'string'},product_visible:{type:'boolean'},text_position:{type:'string',enum:['top','middle','bottom']},font_size:{type:'integer',minimum:44,maximum:96}},required:['slide_index','role','text','visual','product_visible','text_position','font_size']}}},required:['name','slides']};
  const flow=skeleton.flow.slice(0,slideCount).join(' → ');
  const prompt=`Plan one original ${slideCount}-slide TikTok carousel. Return exactly ${slideCount} slides even though the schema permits 5-8.\nProduct: ${product.name}\nBrand: ${product.brand||''}\nAudience: ${product.audience||''}\nDescription: ${product.description||''}\nApproved claims: ${product.approved_claims||''}\nProhibited claims: ${product.prohibited_claims||''}\nChosen concept: ${concept.title}\nHook direction: ${concept.hook}\nAngle: ${concept.angle}\nSkeleton: ${skeleton.name}\nFlow: ${flow}\nVisual preset: ${style}\nCharacter continuity: ${characterDescription||'No required recurring character.'}\n\nRules: one complete scene per slide, never a collage; Slide 1 should be hook/problem-first and normally no product; product introduction should happen later; 2-3 real/checkable selling points maximum across the whole campaign; text must be concise enough for mobile; visual must describe what is actually in the generated image; no fake results or unsupported claims.`;
  const data=await structured('carousel_plan',schema,prompt);
  return {...data,slides:data.slides.slice(0,slideCount).map((s,i)=>({...s,slide_index:i+1}))};
}

export async function generateCaption(product,campaign){
  const rsp=await openai().responses.create({model:textModel(),input:`Write a concise TikTok Shop caption for this carousel. Product: ${product.name}. Campaign: ${campaign.name}. Use only supplied product facts, no unsupported claims, no fake urgency. Include a natural CTA. Return caption only.`});
  return rsp.output_text.trim();
}

export function imagePrompt(product,campaign,slide){
  const preset=STYLES[campaign.style]||STYLES['Casual UGC'];
  return `${preset.prompt}. Vertical ${campaign.aspect_ratio} carousel slide. ONE complete scene only, NEVER a collage or split screen. Slide role: ${slide.role}. Scene: ${slide.visual}. ${campaign.character_description?`Keep this recurring character consistent: ${campaign.character_description}.`:''} ${slide.product_visible?`The real product ${product.name} is visible. Preserve the reference product's exact packaging shape, colors, label layout, logo placement and proportions. Do not invent different packaging. Product entirely in frame.`:`Do not show or invent the product on this slide.`} Do not generate the headline as text inside the image; leave clean space near ${slide.text_position||'top'} because exact typography will be composited later. No third-party brand logos, prices, retail messaging, illegible text, levitating products, warped product scale, moving screens, or clutter that competes with the subject.`;
}

export async function generateBaseImage({product,campaign,slide}){
  const client=openai(); const prompt=imagePrompt(product,campaign,slide); const size=ASPECTS[campaign.aspect_ratio]?.aiSize||'1080x1440';
  if(slide.product_visible && product.image_urls?.length){
    const refs=[];
    for(const url of product.image_urls.slice(0,2)){
      const r=await fetch(url); if(r.ok){ const buf=Buffer.from(await r.arrayBuffer()); refs.push(await toFile(buf,'product.png',{type:r.headers.get('content-type')||'image/png'})); }
    }
    if(refs.length){ const result=await client.images.edit({model:imageModel(),image:refs,prompt,size,quality:'medium'}); return {bytes:Buffer.from(result.data[0].b64_json,'base64'),prompt}; }
  }
  const result=await client.images.generate({model:imageModel(),prompt,size,quality:'medium'});
  return {bytes:Buffer.from(result.data[0].b64_json,'base64'),prompt};
}
