import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return <main className="landing">
    <nav className="topbar home-nav"><a className="brand" href="#top"><span>她</span>的平行人生</a><div className="home-links"><Link href="/create">开始游戏</Link><a href="#intro">游戏介绍</a><a href="#features">玩法亮点</a><a href="#coach">人生导师</a><a href="#community">点亮社群</a><Link href="/collection">我的图鉴</Link></div></nav>
    <section className="hero" id="top"><div className="hero-image"><Image src="/images/hero.png" alt="一位女性站在人生的多条分岔路线前" fill priority sizes="(max-width: 800px) 100vw, 56vw" /><div className="hero-shade" /></div><div className="hero-copy"><p className="eyebrow">AI VISUAL LIFE SIMULATION</p><h1>如果那天，<br />你选择了<span>另一条路</span>。</h1><p className="lead">描述此刻真实的处境。AI 会将它脱敏、虚构，编织成一段可以体验、重走与收藏的平行人生。</p><div className="hero-actions"><Link className="primary" href="/create">描述我的处境</Link><Link className="secondary" href="/lobby#sample">试玩审核故事</Link></div><p className="privacy">人物与未来均为虚构 · 不预测现实人生 · 不保存处境原文</p></div></section>
    <section className="home-section intro-section" id="intro"><p className="section-no">01</p><div><p className="eyebrow dark">ABOUT THE GAME</p><h2>不是测试你会不会成功，<br />而是陪你把一条路多走几步。</h2></div><p>现实中的困境经常被压成一道二选一。这里会把人物、资源、关系与后果铺开，让一个选择继续影响后面的场景，而不是立刻给出对错。</p></section>
    <section className="feature-section" id="features"><p className="eyebrow dark">HOW IT PLAYS</p><h2>一段值得探索的故事，需要时间发生</h2><div className="feature-grid"><article><b>01</b><h3>从你的处境开始</h3><p>输入当下困境，先生成脱敏的虚构角色卡；原文不会进入故事档案。</p></article><article><b>02</b><h3>先让故事发生</h3><p>人物、关系与压力会被充分展开，选择只出现在真正需要决定的关键节点，并持续影响后续。</p></article><article><b>03</b><h3>回到岔路再走一次</h3><p>旧线路会保留。你可以探索另一种价值与代价，不需要否定已经走过的人生。</p></article></div></section>
    <section className="coach-section" id="coach"><div className="coach-art"><Image src="/images/linan-ch2-v1.png" alt="女性站在城市分岔路线前的手绘场景" fill sizes="(max-width: 760px) 100vw, 46vw" /></div><div><p className="eyebrow">LIFE COACH</p><h2>不说教，也不替你决定</h2><p>Coach 只在每章结束后出现一次。它不诊断、不评价成功失败，也不说“你应该”。它会帮助你分开事实、情绪、资源、价值与代价，像一面受过训练的镜子。</p><blockquote>“这是恐惧替你作答，还是价值在发声？”</blockquote></div></section>
    <section className="community-section" id="community"><p className="eyebrow dark">FUTURE COMMUNITY</p><h2>有一天，岔路口也能遇见真实的她们</h2><p>未来可以在相似人生节点向真实女性求助、交换经验或点亮一条线路。首版暂不开放公共互动，先确保每个人都能安全地完成自己的单机故事。</p><span>多人节点共鸣 · 真实经验互助 · 平行线路收藏</span></section>
    <section className="atlas-section" id="atlas"><div><p className="eyebrow">YOUR ATLAS</p><h2>每条走过的路，都会留在你的图鉴里</h2></div><Link className="primary" href="/collection">打开我的图鉴</Link></section>
  </main>;
}
