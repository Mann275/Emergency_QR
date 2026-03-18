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

export const showToast = ({ title, message, variant = "success", duration, id }) => {
  const { icon: Icon, iconBg, iconColor, border, background, textColor } =
    getVariantStyles(variant);
  const hasTitle = Boolean(title && message);
  const isMultiLine = hasTitle || (message && message.length > 40);

  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto flex w-fit max-w-[min(400px,94vw)] ${
          isMultiLine ? "items-start" : "items-center"
        } gap-4 rounded-[24px] border px-5 py-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-500 ease-out ${
          t.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-90"
        }`}
        style={{
          borderColor: border,
          background: background,
          boxShadow: `0 15px 40px -10px ${border.replace("0.28", "0.15")}, 0 10px 20px -5px rgba(0,0,0,0.04)`,
        }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-inner"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={22} strokeWidth={2.8} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {title && (
            <h4
              className="text-[14px] sm:text-[15.5px] font-extrabold leading-[1.2] tracking-tight"
              style={{ color: textColor }}
            >
              {title}
            </h4>
          )}
          {message && (
            <p
              className={`${
                title ? "mt-1.5" : ""
              } text-[13.5px] font-semibold leading-[1.4] opacity-90`}
              style={{ color: textColor }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    ),
    { duration: duration ?? 3500, id },
  );
};

