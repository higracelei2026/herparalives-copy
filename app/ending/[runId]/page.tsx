"use client";
import { AppHeader } from "@/components/AppHeader";
import { Portrait } from "@/components/Portrait";
import { getRun, saveRun } from "@/lib/store";
import type { GameRun } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const cardLines = [
  "稳定不必以无限透支为代价。",
  "你不是在寻找标准答案，而是在辨认自己愿意承担的代价。",
  "接受支持和保留决定权，可以同时发生。",
  "能做到，不等于必须一直这样做。",
];

function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const lines: string[] = []; let line = "";
  for (const char of text) { const test = line + char; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = char; } else line = test; }
  if (line) lines.push(line); lines.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
}

export default function EndingPage() {
  const id = String(useParams().runId); const [run, setRun] = useState<GameRun>(); const [quoteIndex, setQuoteIndex] = useState(0); const [saved, setSaved] = useState(false);
  useEffect(() => { const current = getRun(id); setRun(current); if (current?.cardQuote) { const found = cardLines.indexOf(current.cardQuote); if (found >= 0) setQuoteIndex(found); setSaved(true); } }, [id]);
  const observations = useMemo(() => {
    if (!run) return [];
    const labels = run.choices.map((item) => item.choiceLabel).join(" ");
    return [
      { title: "我注意到的节奏", text: labels.includes("同时") ? "当两条路同时打开时，你倾向于先保留可能，再用行动换取更多判断依据。这为你留下了空间，也让你承担了双份责任。" : "面对不确定时，你会先选择一条可以恢复秩序的路。确定感对你很重要，但它并没有让其他可能性失去价值。" },
      { title: "反复出现的张力", text: "你既珍惜关系与承诺，也不愿把决定权交出去。你做的许多选择，都在尝试让支持、稳定和自主不必互相排斥。" },
      { title: "还可以带着走的问题", text: "下一次你又想用“再多做一点”换取安心时，怎样分辨这是你真心选择的投入，还是焦虑正在替你安排生活？" },
    ];
  }, [run]);
  if (!run) return <main className="ending-page"><AppHeader compact /><section className="missing-journey"><p className="eyebrow">ROUTE NOT FOUND</p><h1>这条预览线路没有保存在当前浏览器里</h1><p>可能是链接编号有误，或游客存档已经更新。故事内容没有丢失，可以从图鉴打开已有线路，或者重新开始试玩。</p><div><Link href="/collection">打开我的图鉴</Link><Link href="/lobby#sample">重新开始试玩</Link></div></section></main>;
  const quote = cardLines[quoteIndex];
  const saveCard = () => { const next = { ...run, cardQuote: quote, cardSavedAt: Date.now() }; saveRun(next); setRun(next); setSaved(true); };
  const downloadCard = async () => {
    const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1440; const ctx = canvas.getContext("2d"); if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1440); gradient.addColorStop(0, "#665677"); gradient.addColorStop(1, "#282842"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1440);
    const image = new Image(); image.src = "/images/linan-portrait-v1.png"; await image.decode(); ctx.globalAlpha = .78; ctx.drawImage(image, 500, 530, 580, 910); ctx.globalAlpha = 1;
    ctx.fillStyle = "#efb0a5"; ctx.font = "700 28px Arial"; ctx.fillText("她的平行人生 · LIFE COACH", 80, 105);
    ctx.fillStyle = "#ffffff"; ctx.font = "64px 'Microsoft YaHei'"; drawWrappedText(ctx, quote, 80, 245, 750, 92);
    ctx.fillStyle = "rgba(255,255,255,.72)"; ctx.font = "30px 'Microsoft YaHei'"; ctx.fillText(`${run.character.name}走过的一条平行线路`, 80, 1220); ctx.font = "24px 'Microsoft YaHei'"; ctx.fillText("没有标准答案，只有仍可继续探索的方向。", 80, 1270);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")); if (!blob) return;
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.download = `${run.character.name}-平行人生卡.png`; link.href = url; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <main className="ending-page"><AppHeader compact /><section className="ending-wrap"><header className="reflection-hero"><p className="eyebrow">A PLACE TO LOOK BACK</p><h1>这条路走到了一个<br />可以回望的站台</h1><p>不是终点，也不是对你的定义。Life Coach 只是把这一路反复出现的选择，重新放到你面前。</p></header>
    <article className="coach-reflection"><p className="eyebrow dark">LIFE COACH · 旅途回望</p><h2>{run.character.name}，我从你的选择里看见了这些</h2><div className="observation-grid">{observations.map((item, index) => <section key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></section>)}</div><div className="choice-ribbon"><small>你在这条线路留下的脚印</small><p>{run.choices.map((item) => item.choiceLabel).join(" · ")}</p></div></article>
    <section className="share-studio"><div className="share-copy"><p className="eyebrow dark">MAKE IT YOURS</p><h2>选一句想带走的话</h2><p>这句话不是结论。它只是此刻最想留在你身边的那句提醒。</p><div className="share-controls"><button onClick={() => { setQuoteIndex((quoteIndex + 1) % cardLines.length); setSaved(false); }}>换一句</button><button onClick={saveCard}>{saved ? "已保存到图鉴" : "保存到我的图鉴"}</button><button onClick={downloadCard}>下载卡片</button></div></div><div className="journey-card"><div className="journey-card-copy"><small>她的平行人生 · LIFE COACH</small><blockquote>“{quote}”</blockquote><p>{run.character.name}走过的一条平行线路</p></div><Portrait id={run.character.portrait} /></div></section>
    <div className="ending-actions"><Link href={`/map/${id}`}>展开人生地图</Link><Link href="/lobby#sample">再走一条平行线路</Link><Link href="/collection">打开我的图鉴</Link></div></section></main>;
}
