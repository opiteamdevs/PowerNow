 "use client";
import {useState} from "react";
export default function Home(){
 const [name,setName]=useState(""); const [msg,setMsg]=useState("");
 const base="docedleite.com.br";
 async function check(){
   setMsg("Consultando...");
   const r=await fetch("/api/subdomains?name="+encodeURIComponent(name));
   const d=await r.json(); setMsg(d.message);
 }
 async function create(){
   setMsg("Criando...");
   const r=await fetch("/api/subdomains",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});
   const d=await r.json(); setMsg(d.message);
 }
 return <main className="min-h-screen">
  <header className="border-b border-white/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><b className="text-2xl"><span className="text-cyan-400">Power</span>Now</b><span className="text-sm text-white/50">Cloudflare Edition</span></div></header>
  <section className="mx-auto max-w-4xl px-5 py-24 text-center">
   <div className="inline-block rounded-full bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300">REGISTRO REAL DE SUBDOMÍNIOS</div>
   <h1 className="mt-6 text-5xl font-black md:text-7xl">Crie seu endereço.<br/><span className="text-cyan-400">PowerNow.</span></h1>
   <p className="mx-auto mt-6 max-w-2xl text-white/55">Reserve um subdomínio de <b className="text-white">{base}</b> e crie o registro DNS diretamente na Cloudflare.</p>
   <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"><input value={name} onChange={e=>setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""))} placeholder="meusite" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 outline-none"/><span className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white/50">{base}</span></div>
   <div className="mt-4 flex justify-center gap-3"><button onClick={check} className="rounded-xl border border-white/15 px-6 py-3">Verificar</button><button onClick={create} className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black">Registrar</button></div>
   {msg&&<div className="mx-auto mt-6 max-w-2xl rounded-xl border border-white/10 bg-white/5 p-4">{msg}</div>}
  </section>
 </main>
}