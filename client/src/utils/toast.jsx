import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const getVariantStyles = (variant) => {
  if (variant === "error") {
    return {
      icon: XCircle,
      iconBg: "rgba(239, 68, 68, 0.12)",
      iconColor: "#ef4444",
      border: "rgba(239, 68, 68, 0.28)",
      background: "rgba(254, 242, 242, 0.94)",
      textColor: "#991b1b",
    };
  }

  if (variant === "info") {
    return {
      icon: Info,
      iconBg: "rgba(59, 130, 246, 0.12)",
      iconColor: "#2563eb",
      border: "rgba(59, 130, 246, 0.22)",
      background: "rgba(239, 246, 255, 0.94)",
      textColor: "#1d4ed8",
    };
  }

  return {
    icon: CheckCircle2,
    iconBg: "rgba(34, 197, 94, 0.12)",
    iconColor: "#22c55e",
    border: "rgba(34, 197, 94, 0.28)",
    background: "rgba(240, 253, 244, 0.94)",
    textColor: "#166534",
  };
};

export const showToast = ({
  title,
  message,
  variant = "success",
  duration,
  id,
}) => {
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedMessage = typeof message === "string" ? message.trim() : "";

  if (!normalizedTitle && !normalizedMessage) {
    return;
  }

  const {
    icon: Icon,
    iconBg,
    iconColor,
    border,
    background,
    textColor,
  } = getVariantStyles(variant);
  const content = [normalizedTitle, normalizedMessage]
    .filter(Boolean)
    .join(normalizedTitle && normalizedMessage ? " - " : "");
  const dynamicWidth = Math.min(
    420,
    Math.max(260, Math.round(content.length * 5.8) + 80),
  );

  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto flex items-center gap-2.5 rounded-[14px] border px-3 py-2 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.24)] backdrop-blur-2xl transition-all duration-500 ease-out ${
          t.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-90"
        }`}
        style={{
          width: `min(${dynamicWidth}px, 92vw)`,
          minHeight: "40px",
          maxWidth: "92vw",
          borderColor: border,
          background: background,
          boxShadow: `0 10px 28px -14px ${border.replace("0.28", "0.16")}, 0 6px 14px -8px rgba(0,0,0,0.1)`,
        }}
      >
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={14} strokeWidth={2.6} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-[12px] font-semibold leading-[1.2]"
            style={{
              color: textColor,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {content}
          </p>
        </div>
      </div>
    ),
    { duration: duration ?? 3500, id },
  );
};
