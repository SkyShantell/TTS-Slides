import sharp from 'sharp';
import { ASPECTS } from './config';

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function wrap(text,max=24){ const words=String(text||'').split(/\s+/); const lines=[]; let line=''; for(const w of words){ const test=line?`${line} ${w}`:w; if(test.length>max&&line){lines.push(line);line=w;} else line=test;} if(line)lines.push(line); return lines.slice(0,5); }

export async function renderHeadline(baseBytes,{text,aspectRatio='3:4',position='top',fontSize=70,overlay='shadow'}){
  const {width,height}=ASPECTS[aspectRatio]||ASPECTS['3:4']; const lines=wrap(text,Math.max(16,Math.round(1450/fontSize))); const lh=Math.round(fontSize*1.15); const blockH=lines.length*lh;
  const y=position==='bottom'?height-blockH-110:position==='middle'?Math.round((height-blockH)/2):100;
  const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  const gradient=overlay==='shadow'?`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="black" stop-opacity=".48"/><stop offset="1" stop-color="black" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="${Math.min(height*.38,y+blockH+90)}" fill="url(#g)"/>`:'';
  const svg=`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${gradient}<text x="${width/2}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="white" stroke="black" stroke-opacity=".32" stroke-width="${Math.max(2,fontSize*.045)}" paint-order="stroke" style="letter-spacing:-1px">${tspans}</text></svg>`;
  return sharp(baseBytes).resize(width,height,{fit:'cover'}).composite([{input:Buffer.from(svg)}]).png().toBuffer();
}
