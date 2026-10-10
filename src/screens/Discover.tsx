import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { sessionId } from "../session";
import { Prompts } from "../components/Prompts";

/** Stage 2: Discover. Reflection on the whole of life, then up to five core values. */
export function Discover({ onNext }: { onNext: () => void }) {
  const catalog = useQuery(api.values.catalog, {});
  const mine = useQuery(api.values.list, { sessionId });
  const setRanked = useMutation(api.values.setRanked);
  const [custom, setCustom] = useState("");

  const chosen = (mine ?? []).map((v) => ({ name: v.name, catalogId: v.catalogId, whyItMatters: v.whyItMatters }));
  const isChosen = (name: string) => chosen.some((c) => c.name === name);

  const toggle = (name: string, catalogId?: string) => {
    const next = isChosen(name)
      ? chosen.filter((c) => c.name !== name)
      : chosen.length < 5
        ? [...chosen, { name, catalogId }]
        : chosen;
    void setRanked({ sessionId, values: next });
  };

  return (
    <section>
      <h2 className="stage-question">What truly matters to you?</h2>
      <p className="helper">
        Start with your whole life, not just work. Answer what you like, skip what you don't. Everything saves as you go.
      </p>
      <Prompts stage="discover" />

      <h3>Choose up to five core values</h3>
      <p className="helper">Pick them in order of importance.</p>

      {chosen.length > 0 && (
        <ol className="chosen">
          {chosen.map((c) => (
            <li key={c.name}>
              {c.name}
              <button className="link" onClick={() => toggle(c.name)} aria-label={`Remove ${c.name}`}>remove</button>
            </li>
          ))}
        </ol>
      )}

      <div className="value-grid">
        {catalog?.map((v) => (
          <button
            key={v.id}
            className={isChosen(v.name) ? "value selected" : "value"}
            onClick={() => toggle(v.name, v.id)}
            aria-pressed={isChosen(v.name)}
          >
            <strong>{v.name}</strong>
            <span>{v.description}</span>
          </button>
        ))}
      </div>

      <form
        className="custom"
        onSubmit={(e) => {
          e.preventDefault();
          if (custom.trim()) toggle(custom.trim());
          setCustom("");
        }}
      >
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add your own value" />
        <button type="submit">Add</button>
      </form>

      <button className="primary" onClick={onNext} disabled={chosen.length === 0}>Continue to your mission</button>
    </section>
  );
}
