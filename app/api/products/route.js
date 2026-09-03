import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { listRecords, saveRecord, saveBytes } from '../../../lib/store';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(){ return NextResponse.json({products:await listRecords('products')}); }
export async function POST(req){
  try{
    const body=await req.json(); const id=body.id||randomUUID(); const image_urls=[];
    for(let i=0;i<(body.selected_image_urls||[]).length;i++){
      const src=body.selected_image_urls[i]; const r=await fetch(src,{headers:{'User-Agent':'Mozilla/5.0','Accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'}}); if(!r.ok)continue; const bytes=Buffer.from(await r.arrayBuffer()); const ct=r.headers.get('content-type')||'image/jpeg'; const ext=ct.includes('png')?'png':ct.includes('webp')?'webp':'jpg'; image_urls.push(await saveBytes(`products/${id}/reference-${String(i+1).padStart(2,'0')}.${ext}`,bytes,ct));
    }
    const product={ id,name:body.name||'Untitled Product',brand:body.brand||'',description:body.description||'',audience:body.audience||'',approved_claims:body.approved_claims||'',prohibited_claims:body.prohibited_claims||'',source_url:body.source_url||'',product_id:body.product_id||'',category:body.category||'',image_urls:image_urls.length?image_urls:(body.image_urls||[]) };
    await saveRecord('products',product); return NextResponse.json({product});
  }catch(e){return NextResponse.json({error:e.message||'Could not save product.'},{status:500});}
}
