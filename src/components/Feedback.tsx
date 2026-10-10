import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { sessionId } from "../session";

const KINDS = [
  { id: "felt", label: "How this felt" },
  { id: "bug", label: "Something broke" },
  { id: "idea", label: "An idea" },
] as const;

/** Always-available feedback for testers. Submissions land in the Convex `feedback` table. */
export function Feedback({ screen, open, onOpenChange }: { screen: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const submit = useMutation(api.feedback.submit);
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("felt");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const send = async () => {
    setStatus("sending");
    try {
      await submit({ sessionId, screen, kind, message, contact: contact || undefined });
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div className="feedback-panel" role="dialog" aria-label="Share feedback">
      <div className="row between">
        <strong>Help shape Keel</strong>
        <button className="link" onClick={() => { setStatus("idle"); onOpenChange(false); }}>Close</button>
      </div>
      {status === "sent" ? (
        <p>Thank you. We read every message.</p>
      ) : (
        <>
          <div className="chips" role="radiogroup">
            {KINDS.map((k) => (
              <button key={k.id} className={kind === k.id ? "chip selected" : "chip"} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
                {k.label}
              </button>
            ))}
          </div>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What worked, what felt off, what's missing? Please don't include private details you wouldn't want the Keel team to read."
          />
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Optional: Reddit username or email, if you're open to a follow-up" />
          {status === "error" && <p className="error">Couldn't send. Please try again.</p>}
          <button className="primary" disabled={!message.trim() || status === "sending"} onClick={send}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </>
      )}
    </div>
  );
}
