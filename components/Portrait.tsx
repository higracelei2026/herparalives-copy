import Image from "next/image";

export function Portrait({ size = "large" }: { id: number; size?: "small" | "large" }) {
  return <div className={`portrait portrait-${size}`} aria-label="林澈的手绘角色立绘"><Image src="/images/linan-portrait-v1.png" alt="28岁女性林澈的手绘角色立绘" fill sizes={size === "small" ? "90px" : "300px"} /></div>;
}
