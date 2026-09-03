import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { listRecords, saveRecord } from '../../../lib/store';
export const runtime='nodejs';
export async function GET(){ return NextResponse.json({campaigns:await listRecords('campaigns')}); }
export async function POST(req){ try{ const b=await req.json(); const campaign={...b,id:b.id||randomUUID(),slide_assets:b.slide_assets||{}}; await saveRecord('campaigns',campaign); return NextResponse.json({campaign}); }catch(e){return NextResponse.json({error:e.message},{status:500});} }
export async function PUT(req){ try{ const b=await req.json(); if(!b.id)throw new Error('Campaign ID missing.'); await saveRecord('campaigns',b); return NextResponse.json({campaign:b}); }catch(e){return NextResponse.json({error:e.message},{status:500});} }
