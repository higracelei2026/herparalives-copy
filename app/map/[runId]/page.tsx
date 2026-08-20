"use client";
import { AppHeader } from "@/components/AppHeader";
import { getRun, nodesForRun, saveRun } from "@/lib/store";
import type { GameRun } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MapPage() {
  const id = String(useParams().runId); const router = useRouter(); const [run, setRun] = useState<GameRun>(); useEffect(() => setRun(getRun(id)), [id]); if (!run) return null; const nodes = nodesForRun(run);
  const rewind = (index: number) => { const next = { ...run, currentIndex: index, choices: run.choices.slice(0, index), branch: run.branch + 1, finished: false, updatedAt: Date.now() }; saveRun(next); router.push(`/play/${id}`); };
  return <main className="map-page"><AppHeader /><section className="map-head"><p className="eyebrow dark">PARALLEL ROUTES · LINE {run.branch}</p><h2>{run.character.name}展开过的人生线路</h2><p>每一个节点都曾经通向三种可能。明亮的线路是你实际走过的方向，尚未点亮的分支依然保留。</p></section><section className="branch-map">{nodes.map((node, index) => { const record = run.choices.find((item) => item.nodeId === node.id); const reached = index <= run.currentIndex || Boolean(record); return <article className={`route-stage ${reached ? "reached" : "locked"}`} key={node.id}><header><span>{index === 0 ? "序" : String(index).padStart(2,"0")}</span><div><small>{node.chapterTitle}</small><h3>{node.title}</h3></div>{record && index < run.currentIndex && <button onClick={() => rewind(index)}>从这里再走一次</button>}</header><div className="route-fan">{node.choices.map((choice, choiceIndex) => { const chosen = record?.choiceId === choice.id; return <div className={`route-option ${chosen ? "chosen" : "unchosen"}`} key={choice.id}><i>{String.fromCharCode(65 + choiceIndex)}</i><strong>{choice.label}</strong><small>{chosen ? "你走过这里" : reached ? "未探索的平行方向" : "前方尚未抵达"}</small></div>})}</div></article>})}</section><div className="map-actions"><button className="primary dark-button" onClick={() => router.push(run.finished ? `/ending/${id}` : `/play/${id}`)}>{run.finished ? "回到旅途回望" : "返回当前章节"}</button></div></main>;
}
