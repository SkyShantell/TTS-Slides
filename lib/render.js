import sharp from 'sharp';
import { ASPECTS } from './config';

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function wrapLine(text,max=24){const words=String(text||'').trim().split(/\s+/).filter(Boolean);const lines=[];let line='';for(const w of words){const test=line?`${line} ${w}`:w;if(test.length>max&&line){lines.push(line);line=w;}else line=test;}if(line)lines.push(line);return lines;}
function textLines(text,max=24){const manual=String(text||'').split(/\n+/);const out=[];for(const row of manual){out.push(...wrapLine(row,max));}return out.slice(0,8);}
function commonSvg(width,height,body){return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;}
function tagged(text,label){const line=String(text||'').split(/\n+/).find(x=>x.trim().toLowerCase().startsWith(label.toLowerCase()+':'));return line?line.replace(new RegExp(`^${label}:\\s*`,'i'),'').trim():'';}

function renderType2({width,height,text,emphasisText,fontSize,position,referenceStyleId}){
  const emphasis=String(emphasisText||'').trim();
  const max=Math.max(14,Math.round(1260/fontSize));
  const lines=textLines(text,max);
  const animated=['style2_animated_education','style4_clean_animated'].includes(referenceStyleId);
  const accent=animated?'#e6292f':'#820747';
  const lineSpecs=lines.map(line=>({text:line,emphasis:emphasis&&line.toLowerCase().includes(emphasis.toLowerCase())}));
  const base=fontSize; const heights=lineSpecs.map(x=>x.emphasis?Math.round(base*1.42):base); const blockH=heights.reduce((a,b)=>a+b,0)+Math.max(0,lineSpecs.length-1)*Math.round(base*.24);
  let y=position==='bottom'?height-blockH-90:position==='middle'?Math.round((height-blockH)/2):75;
  let body='';
  lineSpecs.forEach(x=>{const fs=x.emphasis?Math.round(base*1.35):base;const family=x.emphasis?'Georgia, Times New Roman, serif':animated?'Arial, Helvetica, sans-serif':'Georgia, Times New Roman, serif';const italic=x.emphasis?'italic':'normal';const fill=x.emphasis?accent:'#111111';y+=fs;body+=`<text x="${width/2}" y="${y}" text-anchor="middle" font-family="${family}" font-size="${fs}" font-weight="${x.emphasis?'800':'750'}" font-style="${italic}" fill="${fill}" style="letter-spacing:-1px">${esc(x.text)}</text>`;y+=Math.round(base*.24);});
  return commonSvg(width,height,body);
}

function renderType1({width,height,text,fontSize,position}){
  const lines=textLines(text,Math.max(15,Math.round(1320/fontSize))); const lh=Math.round(fontSize*1.12); const blockH=lines.length*lh; let y=position==='bottom'?height-blockH-105:position==='middle'?Math.round((height-blockH)/2):92;
  let body='';
  lines.forEach((line,i)=>{
    const m=line.match(/^(\d+[.)]?)(\s*)(.*)$/);
    y+=fontSize;
    if(m){
      body+=`<text x="76" y="${y}" text-anchor="start" font-family="Georgia, Times New Roman, serif" font-size="${fontSize}" font-weight="800" fill="#8b1738"><tspan>${esc(m[1])}</tspan><tspan fill="#111111"> ${esc(m[3])}</tspan></text>`;
    }else{
      body+=`<text x="76" y="${y}" text-anchor="start" font-family="Georgia, Times New Roman, serif" font-size="${i===0?fontSize:Math.round(fontSize*.78)}" font-weight="${i===0?'750':'500'}" font-style="${line.trim().startsWith('(')?'italic':'normal'}" fill="#161616">${esc(line)}</text>`;
    }
    y+=Math.round(lh-fontSize);
  });
  return commonSvg(width,height,body);
}

function renderType3({width,height,text,fontSize,position}){
  const lines=textLines(text,Math.max(15,Math.round(1250/fontSize))); const lh=Math.round(fontSize*1.1); const padY=30;const boxH=lines.length*lh+padY*2; const y=position==='bottom'?height-boxH-85:position==='middle'?Math.round((height-boxH)/2):75; const boxW=Math.round(width*.88); const x=(width-boxW)/2;
  const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="28" fill="white" fill-opacity=".96"/><text x="${width/2}" y="${y+padY+fontSize*.86}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="#111111" style="letter-spacing:-1px">${tspans}</text>`);
}

function renderDialogue({width,height,text,fontSize}){
  const rows=String(text||'').split(/\n+/).filter(Boolean);
  const left=(rows[0]||'').replace(/^[^:]{1,14}:\s*/,''); const right=(rows[1]||'').replace(/^[^:]{1,14}:\s*/,'');
  const leftLines=wrapLine(left,22).slice(0,3); const rightLines=wrapLine(right,22).slice(0,3); const fs=Math.max(48,Math.min(fontSize,72)); const lh=Math.round(fs*1.08);
  const lsp=leftLines.map((l,i)=>`<tspan x="72" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  const rsp=rightLines.map((l,i)=>`<tspan x="${width-72}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<text x="72" y="105" text-anchor="start" font-family="Arial, Helvetica, sans-serif" font-size="${fs}" font-weight="900" fill="white" stroke="#111" stroke-width="7" paint-order="stroke">${lsp}</text><text x="${width-72}" y="${height-300}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="${fs}" font-weight="900" fill="white" stroke="#111" stroke-width="7" paint-order="stroke">${rsp}</text>`);
}

function renderType4({width,height,text,fontSize,position,referenceStyleId}){
  if(referenceStyleId==='style3_social_dialogue') return renderDialogue({width,height,text,fontSize});
  const lines=textLines(text,Math.max(16,Math.round(1450/fontSize))); const lh=Math.round(fontSize*1.13); const blockH=lines.length*lh; const y=position==='bottom'?height-blockH-100:position==='middle'?Math.round((height-blockH)/2):100; const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  const gradH=Math.min(height*.42,y+blockH+100);
  return commonSvg(width,height,`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="black" stop-opacity=".44"/><stop offset="1" stop-color="black" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="${gradH}" fill="url(#g)"/><text x="${width/2}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="850" fill="white" stroke="black" stroke-opacity=".7" stroke-width="${Math.max(3,fontSize*.06)}" paint-order="stroke" style="letter-spacing:-1px">${tspans}</text>`);
}

function renderType5({width,height,text,fontSize,position}){
  const lines=textLines(text,Math.max(15,Math.round(1250/fontSize)));const lh=Math.round(fontSize*1.1);const padY=32;const boxH=lines.length*lh+padY*2;const y=position==='bottom'?height-boxH-90:position==='middle'?Math.round((height-boxH)/2):80;const boxW=Math.round(width*.88);const x=(width-boxW)/2;const tspans=lines.map((l,i)=>`<tspan x="${width/2}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="28" fill="#820747" fill-opacity=".95"/><text x="${width/2}" y="${y+padY+fontSize*.86}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="white">${tspans}</text>`);
}

function renderType6({width,height,text,fontSize}){
  const manual=String(text||'').split(/\n+/).map(x=>x.trim()).filter(Boolean); const headline=manual[0]||text; const support=manual.slice(1).join(' ');
  const hlines=wrapLine(headline,20).slice(0,3); const fs=Math.max(70,Math.min(fontSize,96)); const lh=Math.round(fs*1.02); let y=105; let body='';
  hlines.forEach((line,i)=>{y+=i?lh:0;body+=`<text x="70" y="${y}" text-anchor="start" font-family="Georgia, Times New Roman, serif" font-size="${fs}" font-weight="800" font-style="italic" fill="#1675ff" stroke="white" stroke-width="2" paint-order="stroke" style="letter-spacing:-2px">${esc(line)}</text>`;});
  if(support){const sl=wrapLine(support,34).slice(0,2);const sfs=42;sl.forEach((line,i)=>{body+=`<text x="72" y="${y+70+i*50}" text-anchor="start" font-family="Georgia, Times New Roman, serif" font-size="${sfs}" font-style="italic" font-weight="650" fill="#111" stroke="white" stroke-width="3" paint-order="stroke">${esc(line)}</text>`;});}
  return commonSvg(width,height,body);
}

async function renderType7Base(baseBytes,{width,height,text}){
  const friend=tagged(text,'Friend')||String(text||'').split(/\n+/)[0]||'where did you get that?';
  const me=tagged(text,'Me')||String(text||'').split(/\n+/)[1]||'I’ll send you the one I found';
  const imageW=Math.round(width*.66), imageH=Math.round(height*.46), imageX=58, imageY=Math.round(height*.285);
  const embedded=await sharp(baseBytes).resize(imageW,imageH,{fit:'cover'}).png().toBuffer();
  const friendLines=wrapLine(friend,28).slice(0,3); const meLines=wrapLine(me,28).slice(0,3); const bubble=(lines,x,y,bw,align='start',fill='#f0f1f4')=>{const fs=42,lh=49,pad=28,bh=lines.length*lh+pad*1.55;const tx=align==='end'?x+bw-pad:x+pad;const tsp=lines.map((l,i)=>`<tspan x="${tx}" dy="${i?lh:0}">${esc(l)}</tspan>`).join('');return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="30" fill="${fill}"/><text x="${tx}" y="${y+pad+fs*.74}" text-anchor="${align}" font-family="Arial, Helvetica, sans-serif" font-size="${fs}" font-weight="600" fill="#15171a">${tsp}</text>`;};
  const friendSvg=bubble(friendLines,58,145,Math.round(width*.72),'start','#f0f1f4'); const meW=Math.round(width*.67); const meY=imageY+imageH+70; const meSvg=bubble(meLines,width-meW-58,meY,meW,'start','#dfe9ff');
  const chrome=commonSvg(width,height,`<rect width="100%" height="100%" fill="#ffffff"/><rect x="0" y="0" width="100%" height="112" fill="#ffffff"/><line x1="0" y1="112" x2="${width}" y2="112" stroke="#e6e7ea" stroke-width="2"/><circle cx="58" cy="56" r="30" fill="#202226"/><text x="105" y="66" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#15171a">Friend</text>${friendSvg}<rect x="${imageX-5}" y="${imageY-5}" width="${imageW+10}" height="${imageH+10}" rx="28" fill="none" stroke="#e7e7ea" stroke-width="4"/>${meSvg}<text x="${width/2}" y="${height-38}" text-anchor="middle" font-family="Arial" font-size="24" fill="#9b9da4">messages</text>`);
  return sharp({create:{width,height,channels:4,background:'#fff'}}).composite([{input:Buffer.from(chrome)},{input:embedded,left:imageX,top:imageY}]).png().toBuffer();
}

function renderType8({width,height,text}){
  const problem=tagged(text,'PROBLEM')||'the problem'; const solution=tagged(text,'SOLUTION')||'the solution'; const fs=42;
  const pl=wrapLine(problem,20).slice(0,2), sl=wrapLine(solution,20).slice(0,2);
  const psp=pl.map((l,i)=>`<tspan x="${width*.25}" dy="${i?48:0}">${esc(l)}</tspan>`).join(''); const ssp=sl.map((l,i)=>`<tspan x="${width*.75}" dy="${i?48:0}">${esc(l)}</tspan>`).join('');
  return commonSvg(width,height,`<rect x="28" y="45" width="${width*.43}" height="64" rx="16" fill="white" fill-opacity=".95"/><rect x="${width*.53}" y="45" width="${width*.43}" height="64" rx="16" fill="white" fill-opacity=".95"/><text x="${width*.25}" y="90" text-anchor="middle" font-family="Arial" font-size="38" font-weight="900" fill="#d72a31">PROBLEM</text><text x="${width*.75}" y="90" text-anchor="middle" font-family="Arial" font-size="38" font-weight="900" fill="#148447">SOLUTION</text><path d="M ${width*.44} 145 L ${width*.56} 145" stroke="#e12931" stroke-width="16" stroke-linecap="round"/><path d="M ${width*.54} 123 L ${width*.58} 145 L ${width*.54} 167" fill="none" stroke="#e12931" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><rect x="35" y="${height-235}" width="${width*.43}" height="170" rx="22" fill="white" fill-opacity=".94"/><rect x="${width*.52}" y="${height-235}" width="${width*.445}" height="170" rx="22" fill="white" fill-opacity=".94"/><text x="${width*.25}" y="${height-175}" text-anchor="middle" font-family="Arial" font-size="${fs}" font-weight="800" fill="#171717">${psp}</text><text x="${width*.75}" y="${height-175}" text-anchor="middle" font-family="Arial" font-size="${fs}" font-weight="800" fill="#171717">${ssp}</text>`);
}

export async function renderHeadline(baseBytes,{text,aspectRatio='3:4',position='top',fontSize=70,textStyle='type4',emphasisText='',referenceStyleId='auto_ref'}){
  const {width,height}=ASPECTS[aspectRatio]||ASPECTS['3:4'];
  if(textStyle==='type7') return renderType7Base(baseBytes,{width,height,text});
  const args={width,height,text,emphasisText,fontSize,position,referenceStyleId};
  let svg;
  if(textStyle==='type1')svg=renderType1(args);
  else if(textStyle==='type2')svg=renderType2(args);
  else if(textStyle==='type3')svg=renderType3(args);
  else if(textStyle==='type5')svg=renderType5(args);
  else if(textStyle==='type6')svg=renderType6(args);
  else if(textStyle==='type8')svg=renderType8(args);
  else svg=renderType4(args);
  return sharp(baseBytes).resize(width,height,{fit:'cover'}).composite([{input:Buffer.from(svg)}]).png().toBuffer();
}
