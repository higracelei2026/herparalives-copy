"use client";
import { AppHeader } from "@/components/AppHeader";
import { Portrait } from "@/components/Portrait";
import { portraits } from "@/lib/presets";
import { createCustomRun } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const [portrait, setPortrait] = useState(0); const [name, setName] = useState(""); const [situation, setSituation] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const submit = async () => {
    if (situation.trim().length < 12) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/characters/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: name.trim(), portrait, situation }) });
      const result = await response.json();
      if (!response.ok) { setError(result.message || result.error || "暂时无法生成角色卡"); return; }
      const run = createCustomRun({ id: crypto.randomUUID(), ...result.card, isCustom: true });
      setSituation(""); router.push(`/prepare?run=${run.id}`);
    } catch { setError("网络暂时不可用，请稍后再试。"); } finally { setBusy(false); }
  };
  return <main><AppHeader /><section className="create-layout"><div><p className="eyebrow dark">CREATE YOUR PARALLEL SELF</p><h2>她像你，但不等于你</h2><p className="muted">你输入的现实处境只用于生成脱敏角色卡，不保存原文。故事中的人物、事件和未来均为虚构。</p><h3 className="step-title"><span>1</span>选择一张角色立绘</h3><div className="portrait-picker">{portraits.map((item) => <button aria-label={item.name} className={portrait === item.id ? "selected" : ""} onClick={() => setPortrait(item.id)} key={item.id}><Portrait id={item.id} size="small" /></button>)}</div><h3 className="step-title"><span>2</span>给她一个名字</h3><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="留空则由 AI 命名" /><h3 className="step-title"><span>3</span>描述她此刻的处境</h3><textarea className="field textarea" maxLength={500} value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="例如：28岁，最近被裁员，投递工作没有回音。过去事业和感情都很顺利，现在有些焦虑……" /><div className="field-foot"><span>请勿填写姓名、地址、公司等可识别信息</span><span>{situation.length}/500</span></div>{error && <p className="form-error">{error}</p>}<button disabled={situation.trim().length < 12 || busy} onClick={submit} className="primary dark-button full">{busy ? "正在生成脱敏角色卡…" : "生成我的平行角色"}</button></div><aside className="character-preview"><Portrait id={portrait} /><div><small>即将成为</small><h3>{name || "未命名的她"}</h3><p>{situation ? "她的故事将从一个真实但已被改写的困境开始。" : "选择立绘并写下处境，她的轮廓会慢慢清晰。"}</p></div></aside></section></main>;
}
