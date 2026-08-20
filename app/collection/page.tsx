"use client";
import { AppHeader } from "@/components/AppHeader";
import { Portrait } from "@/components/Portrait";
import { allRuns } from "@/lib/store";
import type { GameRun } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CollectionPage() { const [runs, setRuns] = useState<GameRun[]>([]); useEffect(() => setRuns(allRuns()), []); return <main><AppHeader /><section className="collection-head"><p className="eyebrow dark">YOUR ATLAS</p><h2>我的平行人生图鉴</h2><p>这里收藏走过的线路与自己挑选的 Life Coach 旅途卡。游客内容将在24小时后清除。</p><button className="pill">绑定手机号保存</button></section>{runs.length ? <section className="collection-grid">{runs.map((run) => <Link className={`collection-card ${run.cardSavedAt ? "saved-card" : ""}`} key={run.id} href={run.finished ? `/ending/${run.id}` : `/play/${run.id}`}><Portrait id={run.character.portrait} size="small" /><div><small>{run.cardSavedAt ? "已收藏旅途卡" : run.finished ? "已完成一条线路" : `进行到第 ${run.currentIndex + 1} 个节点`}</small><h3>{run.character.name}</h3><p>{run.cardQuote || run.character.dilemma}</p><b>{run.finished ? "查看 Life Coach 回望 →" : "继续故事 →"}</b></div></Link>)}</section> : <section className="empty-state"><h3>图鉴还是空的</h3><p>选择一个角色，走出你的第一条线路。</p><Link className="primary dark-button" href="/lobby">前往角色大厅</Link></section>}</main> }
