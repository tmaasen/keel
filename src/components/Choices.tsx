/** Large, tappable single- and multi-select options. */

interface Option {
  id: string;
  label: string;
  hint?: string;
}

export function SingleChoice(props: {
  name: string;
  options: readonly Option[];
  value: string | undefined;
  onChange: (id: string) => void;
}) {
  return (
    <div className="choices" role="radiogroup">
      {props.options.map((o) => (
        <label key={o.id} className={props.value === o.id ? "choice selected" : "choice"}>
          <input
            type="radio"
            name={props.name}
            checked={props.value === o.id}
            onChange={() => props.onChange(o.id)}
          />
          <span>
            <span className="choice-label">{o.label}</span>
            {o.hint && <span className="choice-hint">{o.hint}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

export function MultiChoice(props: {
  options: readonly Option[];
  value: readonly string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) =>
    props.onChange(props.value.includes(id) ? props.value.filter((x) => x !== id) : [...props.value, id]);
  return (
    <div className="choices">
      {props.options.map((o) => (
        <label key={o.id} className={props.value.includes(o.id) ? "choice selected" : "choice"}>
          <input type="checkbox" checked={props.value.includes(o.id)} onChange={() => toggle(o.id)} />
          <span className="choice-label">{o.label}</span>
        </label>
      ))}
    </div>
  );
}
