import { NextResponse } from 'next/server';
import { generateConcepts, generatePlan, generateCaption } from '../../../lib/ai';
export const runtime='nodejs';
export const maxDuration=180;
export async function POST(req){
  try{
    const b=await req.json();
    if(b.action==='concepts') return NextResponse.json({concepts:await generateConcepts(b.product,b.creativeDirection||'',b.deckFormulaId||'auto',b.characterMode||'dani')});
    if(b.action==='plan') return NextResponse.json({plan:await generatePlan(b)});
    if(b.action==='caption') return NextResponse.json({caption:await generateCaption(b.product,b.campaign)});
    throw new Error('Unknown AI action.');
  }catch(e){return NextResponse.json({error:e.message||'AI request failed.'},{status:500});}
}
