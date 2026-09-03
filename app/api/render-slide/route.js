import { NextResponse } from 'next/server';
import { getRecord, saveRecord, saveBytes } from '../../../lib/store';
import { renderHeadline } from '../../../lib/render';
export const runtime='nodejs';
export const maxDuration=60;
export async function POST(req){
  try{
    const {campaign_id,slide_index}=await req.json(); const campaign=await getRecord('campaigns',campaign_id); if(!campaign)throw new Error('Campaign not found.'); const slide=campaign.slides.find(s=>Number(s.slide_index)===Number(slide_index)); const asset=campaign.slide_assets?.[slide_index]; if(!slide||!asset?.base_url)throw new Error('Generate or upload a base image first.'); const r=await fetch(asset.base_url); if(!r.ok)throw new Error('Could not load base image.'); const bytes=Buffer.from(await r.arrayBuffer()); const final=await renderHeadline(bytes,{text:slide.text,aspectRatio:campaign.aspect_ratio,position:slide.text_position,fontSize:slide.font_size,overlay:campaign.style==='Illustrated Carousel'?'clean':'shadow'}); const finalUrl=await saveBytes(`campaigns/${campaign.id}/slide-${slide_index}-final.png`,final,'image/png'); campaign.slide_assets[slide_index]={...asset,final_url:finalUrl,rendered_at:new Date().toISOString()}; await saveRecord('campaigns',campaign); return NextResponse.json({campaign});
  }catch(e){return NextResponse.json({error:e.message||'Render failed.'},{status:500});}
}
