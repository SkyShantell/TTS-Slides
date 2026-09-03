import { NextResponse } from 'next/server';
import { scrapeProduct } from '../../../lib/socialvault';
export const runtime='nodejs';
export const maxDuration=60;
export async function POST(req){ try{ const {url,region='US'}=await req.json(); if(!url)return NextResponse.json({error:'Paste a TikTok Shop URL first.'},{status:400}); const product=await scrapeProduct(url,region); return NextResponse.json({product}); }catch(e){ return NextResponse.json({error:e.message||'Scrape failed.'},{status:500}); } }
