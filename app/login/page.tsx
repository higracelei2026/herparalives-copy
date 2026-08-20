"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginContent() {
  const event = useSearchParams().get("mode") === "event";
  const [sent, setSent] = useState(false);
  return <main className="soft-page"><section className="auth-card"><p className="eyebrow dark">WELCOME BACK</p><h2>把走过的路，留在这里</h2><p>登录后可跨设备保存人生地图与旅途卡。活动试玩无需手机号。</p><label>手机号<input inputMode="tel" placeholder="请输入手机号" /></label><div className="code-row"><input inputMode="numeric" placeholder="验证码" /><button onClick={() => setSent(true)}>{sent ? "已发送" : "获取验证码"}</button></div><button className="primary dark-button">登录并继续</button>{event && <Link className="guest-button" href="/lobby?guest=1">一键游客试玩 <small>进度保存24小时</small></Link>}<small className="legal">继续即表示同意隐私说明。我们不会保存你输入的现实处境原文。</small></section></main>;
}
export default function LoginPage() { return <Suspense><LoginContent /></Suspense>; }
