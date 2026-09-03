import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import OpenAI from 'openai';
export const runtime='nodejs';
export const maxDuration=60;

export async function GET(){
  const checks={
    openai_key:Boolean(process.env.OPENAI_API_KEY),
    text_model:process.env.OPENAI_TEXT_MODEL||'gpt-5.6-sol',
    image_model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',
    blob_store:Boolean(process.env.BLOB_STORE_ID||process.env.BLOB_READ_WRITE_TOKEN),
    blob_write:false,
    image_model_visible:false
  };
  const errors=[];
  try{
    if(!checks.blob_store) throw new Error('No Blob store environment is connected.');
    await list({limit:1});
    await put('diagnostics/health.json',JSON.stringify({ok:true,checked_at:new Date().toISOString()}),{access:'public',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});
    checks.blob_write=true;
  }catch(e){errors.push(`Blob: ${e.message||e}`);}
  try{
    if(!checks.openai_key) throw new Error('OPENAI_API_KEY is missing.');
    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    await client.models.retrieve(checks.image_model);
    checks.image_model_visible=true;
  }catch(e){errors.push(`OpenAI image model: ${e.message||e}`);}
  return NextResponse.json({ok:errors.length===0,checks,errors});
}
