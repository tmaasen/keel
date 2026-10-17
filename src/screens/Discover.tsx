import { useEffect, useRef, useState } from "react";
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

  type Chosen = { name: string; catalogId?: string; whyItMatters?: string };
  // Local copy so quick taps build on each other instead of racing the server; it resyncs once saves settle.
  const [chosen, setChosen] = useState<Chosen[]>([]);
  const pending = useRef(0);
  useEffect(() => {
    if (mine && pending.current === 0) {
      setChosen(mine.map((v) => ({ name: v.name, catalogId: v.catalogId, whyItMatters: v.whyItMatters })));
    }
  }, [mine]);
  const isChosen = (name: string) => chosen.some((c) => c.name === name);

  const save = (next: Chosen[]) => {
    setChosen(next);
    pending.current += 1;
    void setRanked({ sessionId, values: next }).finally(() => {
      pending.current -= 1;
    });
  };
  const move = (index: number, delta: number) => {
    const to = index + delta;
    if (to < 0 || to >= chosen.length) return;
    const next = [...chosen];
    [next[index], next[to]] = [next[to], next[index]];
    save(next);
  };
  const setWhy = (name: string, whyItMatters: string) =>
    save(chosen.map((c) => (c.name === name ? { ...c, whyItMatters: whyItMatters.trim() || undefined } : c)));

  const toggle = (name: string, catalogId?: string) => {
    const next = isChosen(name)
      ? chosen.filter((c) => c.name !== name)
      : chosen.length < 5
        ? [...chosen, { name, catalogId }]
        : chosen;
    save(next);
  };

  return (
    <section>
      <h1 className="screen-title">What truly matters to you?</h1>
      <p className="helper">
        Start with your whole life, not just work. Answer what you like, skip what you don't. Everything saves as you go.
      </p>
      <Prompts stage="discover" />

      <h2>Choose up to five core values</h2>
      <p className="helper">Pick the ones that feel truest. You can put them in order and say why each matters.</p>

      {chosen.length > 0 && (
        <ol className="chosen">
          {chosen.map((c, index) => (
            <li key={c.name} className="chosen-value">
              <span className="rank" aria-hidden="true">{index + 1}</span>
              <div className="chosen-body">
                <strong>{c.name}</strong>
                <label className="sr-only" htmlFor={`why-${index}`}>Why {c.name} matters to you</label>
                <input
                  id={`why-${index}`}
                  defaultValue={c.whyItMatters ?? ""}
                  placeholder="Why it matters to you (optional)"
                  onBlur={(e) => {
                    if (e.target.value.trim() !== (c.whyItMatters ?? "")) setWhy(c.name, e.target.value);
                  }}
                />
              </div>
              <div className="chosen-actions">
                <button className="quiet small" onClick={() => move(index, -1)} disabled={index === 0}
                  aria-label={`Move ${c.name} up`}>Up</button>
                <button className="quiet small" onClick={() => move(index, 1)} disabled={index === chosen.length - 1}
                  aria-label={`Move ${c.name} down`}>Down</button>
                <button className="link" onClick={() => toggle(c.name)} aria-label={`Remove ${c.name}`}>Remove</button>
              </div>
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
        <label className="sr-only" htmlFor="custom-value">Add your own value</label>
        <input id="custom-value" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add your own value" />
        <button type="submit">Add</button>
      </form>

      <div className="actions closing lake">
        <button className="primary" onClick={onNext} disabled={chosen.length === 0}>Continue to your mission</button>
      </div>
    </section>
  );
}
