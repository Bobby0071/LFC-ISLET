import qqIcon from "../../assets/brands/qq.png";
import wechatIcon from "../../assets/brands/wechat.png";
import qqMailIcon from "../../assets/brands/qq-mail.png";
import type { MessageSource } from "./messagePreview";
import { BellRing, Puzzle } from "lucide-react";
import "./MessageSourceIcon.css";

const SOURCE_ICONS: Record<Exclude<MessageSource, "plugin" | "toast">, string> = {
  qq: qqIcon,
  wechat: wechatIcon,
  qqMail: qqMailIcon,
};

export function MessageSourceIcon({ source, icon, size = 16 }: { source: MessageSource; icon?: string; size?: number }) {
  if (source === "plugin") {
    const badge = ({ wework: "W", dingtalk: "D", feishu: "F" } as Record<string, string>)[icon ?? ""];
    return badge ? <span className={`message-plugin-badge message-plugin-badge--${icon}`} style={{ width: size, height: size }} aria-hidden="true">{badge}</span> : <Puzzle size={size} aria-hidden="true" />;
  }
  // No brand mark exists for "some Windows application", so the system view is a
  // neutral bell rather than a logo it would have to fake.
  if (source === "toast") return <BellRing className="message-brand-icon message-brand-icon--toast" size={size} strokeWidth={1.8} aria-hidden="true" />;
  return <img className={`message-brand-icon message-brand-icon--${source}`} src={SOURCE_ICONS[source]} alt="" aria-hidden="true" width={size} height={size} draggable={false} />;
}
