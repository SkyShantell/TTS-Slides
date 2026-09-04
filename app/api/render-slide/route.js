import { NextResponse } from 'next/server';
import { getRecord, saveRecord, saveBytes } from '../../../lib/store';
import { generateBaseImage } from '../../../lib/ai';
export const runtime='nodejs';
export const maxDuration=300;
export async function POST(req){
  try{
    const {campaign_id,slide_index}=await req.json(); const campaign=await getRecord('campaigns',campaign_id); if(!campaign)throw new Error('Campaign not found.'); const product=await getRecord('products',campaign.product_id_ref); if(!product)throw new Error('Product not found.'); const slide=campaign.slides.find(s=>Number(s.slide_index)===Number(slide_index)); if(!slide)throw new Error('Slide not found.');
    const {bytes,prompt}=await generateBaseImage({product,campaign,slide}); const finalUrl=await saveBytes(`campaigns/${campaign.id}/slide-${slide_index}-gpt-final.png`,bytes,'image/png'); campaign.slide_assets={...(campaign.slide_assets||{}),[slide_index]:{base_url:finalUrl,final_url:finalUrl,prompt,generated_at:new Date().toISOString(),text_rendered_by:'gpt-image-2'}}; await saveRecord('campaigns',campaign); return NextResponse.json({campaign,asset:campaign.slide_assets[slide_index]});
  }catch(e){return NextResponse.json({error:e.message||'Regeneration failed.'},{status:500});}
}
