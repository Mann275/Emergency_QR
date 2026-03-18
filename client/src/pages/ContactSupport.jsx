import { useMemo, useState } from "react";
import { Bug, Heart, Lightbulb, MessageSquareText, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ApiService from "../utils/api";
import { showToast } from "../utils/toast.jsx";

const categoryIcons = {
  appreciation: Heart,
  suggestion: Lightbulb,
  bug: Bug,
};

const categoryOrder = ["appreciation", "suggestion", "bug"];

const categoryTitleKeys = {
  appreciation: "contactCategoryAppreciation",
  suggestion: "contactCategorySuggestion",
  bug: "contactCategoryBug",
};

const categoryDescKeys = {
  appreciation: "contactCategoryAppreciationDesc",
  suggestion: "contactCategorySuggestionDesc",
  bug: "contactCategoryBugDesc",
};

const categoryPlaceholderKeys = {
  appreciation: "contactSubjectPlaceholderAppreciation",
  suggestion: "contactSubjectPlaceholderSuggestion",
  bug: "contactSubjectPlaceholderBug",
};

const categoryFallbackSubjectKeys = {
  appreciation: "contactDefaultSubjectAppreciation",
  suggestion: "contactDefaultSubjectSuggestion",
  bug: "contactDefaultSubjectBug",
};

const categories = [
  {
    value: "appreciation",
  },
  {
    value: "suggestion",
  },
  {
    value: "bug",
  },
];

const ContactSupport = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [category, setCategory] = useState("appreciation");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = useMemo(
    () => (categoryOrder.includes(category) ? category : categoryOrder[0]),
    [category],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    const fallbackSubject =
      t[categoryFallbackSubjectKeys[category]] || "Feedback from app user";
    const finalSubject =
      trimmedSubject.length >= 3 ? trimmedSubject : fallbackSubject;

    if (!trimmedMessage) {
      showToast({
        type: "error",
        message: t.contactValidationMessageRequired || "Message is required.",
      });
      return;
    }

    if (trimmedMessage.length < 10) {
      showToast({
        type: "error",
        message:
          t.contactValidationMessageLength ||
          "Message should be at least 10 characters.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await ApiService.submitContactFeedback({
        category,
        subject: finalSubject,
        message: trimmedMessage,
        userName: user?.displayName || "",
        userEmail: user?.email || "",
        ownerAuthUid: user?.uid || "",
      });

      setSubject("");
      setMessage("");

      showToast({
        message:
          t.contactSubmitSuccess || "Message sent successfully. Thank you!",
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.message ||
          t.contactSubmitError ||
          "Message could not be sent. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-24 sm:pb-28">
      <section className="pt-24 sm:pt-28">
        <div className="main-wrap max-w-4xl px-3 sm:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_25px_80px_rgba(60,22,34,0.14)] backdrop-blur-xl sm:p-9">
            <div className="pointer-events-none absolute -top-24 -right-20 h-60 w-60 rounded-full bg-[var(--accent)]/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-7">
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
                  data-t="contactBadge"
                >
                  <MessageSquareText size={14} />
                  {t.contactBadge || "Contact & Feedback"}
                </div>
                <h1
                  className="mt-4 text-3xl font-black tracking-tight text-[var(--ink)] sm:text-5xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                  data-t="contactTitle"
                >
                  {t.contactTitle || "Tell us what we can improve"}
                </h1>
                <p
                  className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[var(--muted)] sm:text-base"
                  data-t="contactDescription"
                >
                  {t.contactDescription ||
                    "Send bug reports, suggestions, or appreciation from here. Your message will be delivered directly to the team email."}
                </p>
              </div>

              <div className="mb-7 grid gap-3 sm:grid-cols-3">
                {categories.map((item) => {
                  const Icon = categoryIcons[item.value];
                  const active = item.value === category;
                  const titleKey = categoryTitleKeys[item.value];
                  const descKey = categoryDescKeys[item.value];

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      className={`rounded-2xl border p-4 text-left transition-base ${
                        active
                          ? "border-[var(--accent)] bg-rose-50/80 shadow-[0_12px_25px_rgba(200,30,75,0.18)]"
                          : "border-[var(--line)] bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Icon
                          size={16}
                          className={
                            active
                              ? "text-[var(--accent)]"
                              : "text-[var(--muted)]"
                          }
                        />
                        <span className="text-sm font-bold text-[var(--ink)]">
                          <span data-t={titleKey}>
                            {t[titleKey] || item.value}
                          </span>
                        </span>
                      </div>
                      <p
                        className="text-xs font-medium text-[var(--muted)]"
                        data-t={descKey}
                      >
                        {t[descKey] || ""}
                      </p>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid gap-2">
                  <label className="minimal-label" data-t="contactSubjectLabel">
                    {t.contactSubjectLabel || "Subject"}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    maxLength={140}
                    placeholder={
                      t[categoryPlaceholderKeys[selectedCategory]] ||
                      "Write a short subject"
                    }
                    className="minimal-input"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="minimal-label" data-t="contactMessageLabel">
                    {t.contactMessageLabel || "Message"}
                  </label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={7}
                    minLength={10}
                    maxLength={3000}
                    placeholder={
                      t.contactMessagePlaceholder ||
                      "Share details so we can use this in upcoming updates."
                    }
                    className="minimal-input resize-y"
                    required
                  />
                  <p className="text-right text-xs font-semibold text-[var(--subtle)]">
                    {message.length}/3000
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--line)] bg-white/65 p-4 text-xs font-semibold text-[var(--muted)] sm:text-sm">
                  <span data-t="contactSignedInAs">
                    {t.contactSignedInAs || "Signed in as"}
                  </span>
                  : {user?.email || t.contactUnknownUser || "Unknown user"}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="stark-btn w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send size={16} />
                    <span
                      data-t={
                        submitting ? "contactSending" : "contactSendButton"
                      }
                    >
                      {submitting
                        ? t.contactSending || "Sending..."
                        : t.contactSendButton || "Send Message"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSupport;
