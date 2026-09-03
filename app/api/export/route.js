import JSZip from 'jszip';
import { NextResponse } from 'next/server';
import { getRecord } from '../../../lib/store';
export const runtime='nodejs';
export const maxDuration=120;
export async function POST(req){
  try{
    const {campaign_id}=await req.json(); const campaign=await getRecord('campaigns',campaign_id); if(!campaign)throw new Error('Campaign not found.'); const zip=new JSZip();
    for(const slide of campaign.slides||[]){ const asset=campaign.slide_assets?.[slide.slide_index]; if(!asset?.final_url)continue; const r=await fetch(asset.final_url); if(!r.ok)continue; zip.file(`slide_${String(slide.slide_index).padStart(2,'0')}.png`,Buffer.from(await r.arrayBuffer())); }
    zip.file('caption.txt',campaign.caption||''); zip.file('campaign.json',JSON.stringify(campaign,null,2));
    const cols=['slide','role','slide_type','copy_style','text','emphasis_text','visual','character_style','expression','pose','product_visible'];
    const csv=[cols.join(','),...(campaign.slides||[]).map(s=>[s.slide_index,s.role,s.slide_type_id,s.text_style,s.text,s.emphasis_text,s.visual,s.character_style,s.expression_id,s.pose_id,s.product_visible].map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(','))].join('\n');
    zip.file('slide_plan.csv',csv);
    const out=await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}); return new NextResponse(out,{headers:{'Content-Type':'application/zip','Content-Disposition':`attachment; filename="${String(campaign.name||'campaign').replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.zip"`}});
  }catch(e){return NextResponse.json({error:e.message||'Export failed.'},{status:500});}
}
