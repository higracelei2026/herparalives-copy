"use client";
import { AppHeader } from "@/components/AppHeader";
import { getRun } from "@/lib/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PrepareContent() { const id = useSearchParams().get("run") || ""; const [ready, setReady] = useState(false); const [name, setName] = useState("她"); useEffect(() => { setName(getRun(id)?.character.name || "她"); const t = setTimeout(() => setReady(true), 1200); return () => clearTimeout(t); }, [id]); return <main><AppHeader /><section className="prepare"><div className="route-loader"><span /><span /><span /><span /><span /></div><p className="eyebrow dark">SEASON 01</p><h2>{ready ? `${name}的第一章已经准备好` : "正在铺开五章人生线路"}</h2><p>{ready ? "后面的章节会在你阅读时继续准备，不必等待整季生成。" : "角色关系、核心冲突与伏笔正在被固定下来……"}</p>{ready && <Link className="primary dark-button" href={`/play/${id}`}>进入第一章</Link>}<small>故事不会展示模型推理过程，也不预测你的真实未来。</small></section></main> }
export default function PreparePage() { return <Suspense><PrepareContent /></Suspense> }
