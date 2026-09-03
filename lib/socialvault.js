const ENDPOINT='https://api.sociavault.com/v1/scrape/tiktok-shop/product-details';

function asList(v){ if(v==null)return[]; if(Array.isArray(v))return v; if(typeof v==='object') return Object.keys(v).sort((a,b)=>Number(a)-Number(b)).map(k=>v[k]); return [v]; }
function clean(v){ return String(v??'').replace(/\s+/g,' ').trim(); }
function dedupe(xs){ return [...new Set(xs.filter(Boolean))]; }
function unwrap(payload){ let d=payload; for(let i=0;i<3;i++){ if(d&&typeof d==='object'&&d.data&&typeof d.data==='object')d=d.data; else break; } return d||{}; }
function walkText(obj,out=[],depth=0){ if(depth>12||obj==null)return out; if(Array.isArray(obj)){ for(const v of obj) walkText(v,out,depth+1); return out; } if(typeof obj==='object'){ if(obj.text_attribute?.text) out.push(clean(obj.text_attribute.text)); for(const k of ['text','title','content','description']) if(typeof obj[k]==='string') out.push(clean(obj[k])); for(const v of Object.values(obj)) walkText(v,out,depth+1); } return out; }

export function normalizeSocialVault(payload, sourceUrl){
  const d=unwrap(payload); const base=d.product_base||{}; const seller=d.seller||{};
  const specs=asList(base.specifications).filter(x=>x&&x.name&&x.value).map(x=>({name:clean(x.name),value:clean(x.value)}));
  const images=[];
  for(const img of asList(base.images)){
    if(typeof img==='string') images.push(img);
    else if(img){ const full=asList(img.url_list).filter(x=>typeof x==='string'); images.push(...(full.length?full:asList(img.thumb_url_list).filter(x=>typeof x==='string'))); }
  }
  const bits=dedupe(walkText(base.desc_detailv3||base.rich_description||{}).filter(x=>x.length>2&&!x.startsWith('{{')));
  const specText=specs.map(x=>`- ${x.name}: ${x.value}`).join('\n');
  const brand=specs.find(x=>x.name.toLowerCase()==='brand')?.value || clean(seller.name);
  const title=clean(base.title); if(!title) throw new Error('SocialVault did not return a product title.');
  return { name:title, brand, source_url:sourceUrl, description:[bits.join(' ').slice(0,4500), specText?`Product details:\n${specText}`:''].filter(Boolean).join('\n\n').slice(0,7000), images:dedupe(images).slice(0,18), specifications:specs, category:clean(base.category_name), product_id:clean(d.product_id), seller_name:clean(seller.name) };
}

export async function scrapeProduct(url, region='US'){
  if(!process.env.SOCIAVAULT_API_KEY) throw new Error('SOCIAVAULT_API_KEY is missing in Vercel.');
  const qs=new URLSearchParams({url,get_related_videos:'false',region});
  const r=await fetch(`${ENDPOINT}?${qs}`,{headers:{'X-API-Key':process.env.SOCIAVAULT_API_KEY,Accept:'application/json'},cache:'no-store'});
  if(!r.ok){ let msg=''; try{ const j=await r.json(); msg=j.message||j.error||''; }catch{} throw new Error(`SocialVault returned ${r.status}${msg?`: ${msg}`:''}`); }
  const payload=await r.json(); if(payload?.success===false) throw new Error(payload.message||payload.error||'SocialVault scrape failed.');
  return normalizeSocialVault(payload,url);
}
