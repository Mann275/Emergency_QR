import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const getVariantStyles = (variant) => {
  if (variant === "error") {
    return {
      icon: XCircle,
      iconBg: "rgba(220, 38, 38, 0.12)",
      iconColor: "#dc2626",
      border: "rgba(220, 38, 38, 0.2)",
      background: "rgba(255, 255, 255, 0.95)",
    };
  }

  if (variant === "info") {
    return {
      icon: Info,
      iconBg: "rgba(59, 130, 246, 0.12)",
      iconColor: "#2563eb",
      border: "rgba(59, 130, 246, 0.18)",
      background: "rgba(255, 255, 255, 0.95)",
    };
  }

  return {
    icon: CheckCircle2,
    iconBg: "rgba(200, 30, 75, 0.12)",
    iconColor: "var(--accent)",
    border: "rgba(200, 30, 75, 0.2)",
    background: "rgba(255, 255, 255, 0.95)",
  };
};

export const showToast = ({ title, message, variant = "success", duration }) => {
  const { icon: Icon, iconBg, iconColor, border, background } =
    getVariantStyles(variant);
  const hasTitle = Boolean(title && message);
  const headline = hasTitle ? title : message || title;
  const body = hasTitle ? message : null;

  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[18px] border px-4 py-3 shadow-[0_18px_40px_rgba(35,19,26,0.12)] transition-all ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ borderColor: border, background }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1">
          {headline && (
            <p className="text-sm font-semibold text-[var(--ink)]">
              {headline}
            </p>
          )}
          {body && (
            <p className="mt-0.5 text-sm text-[var(--muted)]">{body}</p>
          )}
        </div>
      </div>
    ),
    { duration: duration ?? 3200 },
  );
};

