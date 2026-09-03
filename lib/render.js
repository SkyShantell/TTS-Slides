import sharp from 'sharp';
import { ASPECTS } from './config';

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function wrapLine(text,max=24){const words=String(text||'').trim().split(/\s+/).filter(Boolean);const lines=[];let line='';for(const w of words){const test=line?`${line} ${w}`:w;if(test.length>max&&line){lines.push(line);line=w;}else line=test;}if(line)lines.push(line);return lines;}
function textLines(text,max=24){const manual=String(text||'').split(/\n+/);const out=[];for(const row of manual){out.push(...wrapLine(row,max));}return out.slice(0,7);}

function commonSvg(width,height,body){return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;}

function renderType2({width,height,text,emphasisText,fontSize,position}){
  const raw=String(text||'');
  const emphasis=String(emphasisText||'').trim();
  const max=Math.max(15,Math.round(1300/fontSize));
  const lines=textLines(raw,max);
  const lineSpecs=lines.map(line=>({text:line,emphasis:emphasis&&line.toLowerCase().includes(emphasis.toLowerCase())}));
  const base=fontSize; const gap=Math.round(base*1.18);
  const heights=lineSpecs.map(x=>x.emphasis?Math.round(base*1.45):base);
  const blockH=heights.reduce((a,b)=>a+b,0)+Math.max(0,lineSpecs.length-1)*Math.round(base*.28);
  let y=position==='bottom'?height-blockH-90:position==='middle'?Math.round((height-blockH)/2):80;
  let body='<rect width="100%" height="100%" fill="none"/>';
  lineSpecs.forEach((x,i)=>{const fs=x.emphasis?Math.round(base*1.35):base;const family=x.emphasis?'Georgia, Times New Roman, serif':'Arial, Helvetica, sans-serif';const weight=x.emphasis?'800':'800';const fill=x.emphasis?'#820747':'#111111';const italic=x.emphasis?'italic':'normal';y+=fs;body+=`<text x="${width/2}" y="${y}" text-anchor="middle" font-family="${family}" font-size="${fs}" font-weight="${weight}" font-style="${italic}" fill="${fill}" style="letter-spacing:-1px">${esc(x.text)}</text>`;y+=Math.round(base*.28);});
  return commonSvg(width,height,body);
}

function renderType1({width,height,text,fontSize,position}){
  const lines=textLines(text,Math.max(16,Math.round(1450/fontSize))); const lh=Math.round(fontSize*1.18); const blockH=lines.length*lh; const start=position==='bottom'?height-blockH-95:position==='middle'?Math.round((height-blockH)/2):90;
  const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<text x="${width/2}" y="${start}" text-anchor="middle" font-family="Georgia, Times New Roman, serif" font-size="${fontSize}" font-weight="700" font-style="italic" fill="#161616" style="letter-spacing:-.5px">${tspans}</text>`);
}

function renderType3({width,height,text,fontSize,position}){
  const lines=textLines(text,Math.max(15,Math.round(1250/fontSize))); const lh=Math.round(fontSize*1.12); const padX=54,padY=35;const boxH=lines.length*lh+padY*2; const y=position==='bottom'?height-boxH-90:position==='middle'?Math.round((height-boxH)/2):80; const boxW=Math.round(width*.88); const x=(width-boxW)/2;
  const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="28" fill="white" fill-opacity=".96"/><text x="${width/2}" y="${y+padY+fontSize*.86}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="#111111" style="letter-spacing:-1px">${tspans}</text>`);
}

function renderType4({width,height,text,fontSize,position}){
  const lines=textLines(text,Math.max(16,Math.round(1450/fontSize))); const lh=Math.round(fontSize*1.15); const blockH=lines.length*lh; const y=position==='bottom'?height-blockH-100:position==='middle'?Math.round((height-blockH)/2):100; const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  const gradH=Math.min(height*.42,y+blockH+100);
  return commonSvg(width,height,`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="black" stop-opacity=".48"/><stop offset="1" stop-color="black" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="${gradH}" fill="url(#g)"/><text x="${width/2}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="white" stroke="black" stroke-opacity=".55" stroke-width="${Math.max(3,fontSize*.055)}" paint-order="stroke" style="letter-spacing:-1px">${tspans}</text>`);
}

function renderType5(args){
  const {width,height,text,fontSize,position}=args; const lines=textLines(text,Math.max(15,Math.round(1250/fontSize)));const lh=Math.round(fontSize*1.1);const padY=32;const boxH=lines.length*lh+padY*2;const y=position==='bottom'?height-boxH-90:position==='middle'?Math.round((height-boxH)/2):80;const boxW=Math.round(width*.88);const x=(width-boxW)/2;const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="28" fill="#820747" fill-opacity=".95"/><text x="${width/2}" y="${y+padY+fontSize*.86}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="white">${tspans}</text>`);
}

export async function renderHeadline(baseBytes,{text,aspectRatio='3:4',position='top',fontSize=70,textStyle='type4',emphasisText=''}){
  const {width,height}=ASPECTS[aspectRatio]||ASPECTS['3:4'];
  const args={width,height,text,emphasisText,fontSize,position};
  let svg;
  if(textStyle==='type1')svg=renderType1(args);
  else if(textStyle==='type2')svg=renderType2(args);
  else if(textStyle==='type3')svg=renderType3(args);
  else if(textStyle==='type5')svg=renderType5(args);
  else svg=renderType4(args);
  return sharp(baseBytes).resize(width,height,{fit:'cover'}).composite([{input:Buffer.from(svg)}]).png().toBuffer();
}
