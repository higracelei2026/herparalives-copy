"use client";
import { AppHeader } from "@/components/AppHeader";
import { Portrait } from "@/components/Portrait";
import { comingSoon, presets } from "@/lib/presets";
import { allRuns, createPresetRun } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LobbyPage() {
  const router = useRouter(); const sample = presets[0]; const [continueId, setContinueId] = useState<string>();
  useEffect(() => setContinueId(allRuns().find((run) => !run.finished)?.id), []);
  const startSample = () => { const run = createPresetRun(sample.id); router.push(`/play/${run.id}`); };
  return <main><AppHeader /><section className="story-entry"><div className="entry-copy"><p className="eyebrow dark">START WITH YOUR REAL SITUATION</p><h1>先不选角色。<br />从你此刻的处境开始。</h1><p>简单描述正在经历的困境，AI 会先隐去现实身份，把它改写成一个“像你但不是你”的角色，再编织一段有充分铺垫、人物关系和现实回响的平行人生。</p><button className="primary dark-button" onClick={() => router.push("/create")}>描述我的处境</button><small>原始描述仅用于本次生成，不保存到图鉴、日志或分享卡。</small></div><div className="entry-steps"><span><b>01</b>描述处境</span><i /><span><b>02</b>确认虚构角色</span><i /><span><b>03</b>进入平行故事</span></div></section>
    {continueId && <section className="continue-strip"><div><small>你还有一条线路正在发生</small><b>继续上次的平行人生</b></div><button onClick={() => router.push(`/play/${continueId}`)}>继续故事 →</button></section>}
    <section className="sample-section" id="sample"><div className="sample-head"><div><p className="eyebrow dark">REVIEWED SAMPLE · TESTING</p><h2>不想输入现实处境？先试玩审核故事</h2><p>目前只开放附件里的林澈故事。其余主题暂不填充，避免用未经审核的内容稀释体验。</p></div></div><article className="sample-card"><div className="sample-portrait"><Portrait id={0} /></div><div className="sample-copy"><span>{sample.theme} · 序章＋五章 · 8个关键选择</span><h3>{sample.name}，{sample.age}岁</h3><p>{sample.tagline}</p><ul><li>故事先充分展开，再在关键节点出现选择</li><li>选择后呈现完整的人物回应与现实后果</li><li>Coach 只在阶段末从已经发生的经历中提炼问题</li></ul><button onClick={startSample}>试玩林澈的人生 →</button></div></article><div className="empty-presets">{comingSoon.map((item) => <article key={item.name}><span>故事留白</span><h3>{item.name}</h3><p>{item.note}</p></article>)}</div></section>
  </main>;
}
