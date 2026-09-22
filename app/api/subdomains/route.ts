import {NextResponse} from "next/server";

const base=process.env.POWERNow_BASE_DOMAIN || "docedleite.com.br";
const api="https://api.cloudflare.com/client/v4";

function valid(n:string){return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(n)}

async function cf(path:string, init:RequestInit={}){
 return fetch(api+path,{...init,headers:{"Authorization":`Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});
}

export async function GET(req:Request){
 const name=new URL(req.url).searchParams.get("name")?.toLowerCase().trim()||"";
 if(!valid(name)) return NextResponse.json({message:"Nome inválido."},{status:400});
 if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ZONE_ID)
   return NextResponse.json({message:"Configure CLOUDFLARE_API_TOKEN e CLOUDFLARE_ZONE_ID no servidor."});
 const fqdn=`${name}.${base}`;
 const r=await cf(`/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records?type=A&name=${encodeURIComponent(fqdn)}`);
 const d=await r.json();
 if(!r.ok) return NextResponse.json({message:"Erro ao consultar a Cloudflare."},{status:502});
 return NextResponse.json({message:d.result?.length?`${fqdn} já está registrado.`:`${fqdn} está disponível.`});
}

export async function POST(req:Request){
 const {name}=await req.json(); const n=String(name||"").toLowerCase().trim();
 if(!valid(n)) return NextResponse.json({message:"Nome inválido."},{status:400});
 if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ZONE_ID)
   return NextResponse.json({message:"Configure as credenciais da Cloudflare no servidor."},{status:500});
 const fqdn=`${n}.${base}`;
 const check=await cf(`/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records?name=${encodeURIComponent(fqdn)}`);
 const existing=await check.json();
 if(existing.result?.length) return NextResponse.json({message:`${fqdn} já está registrado.`},{status:409});
 // Uses a placeholder target so the DNS record exists. Change POWERNow_TARGET to your actual service IP.
 const target=process.env.POWERNow_TARGET || "192.0.2.1";
 const r=await cf(`/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`,{method:"POST",body:JSON.stringify({type:"A",name:fqdn,content:target,ttl:1,proxied:true})});
 const d=await r.json();
 if(!r.ok) return NextResponse.json({message:d.errors?.[0]?.message||"Falha ao criar registro DNS."},{status:502});
 return NextResponse.json({message:`Registrado: https://${fqdn}`});
}