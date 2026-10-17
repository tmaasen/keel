/**
 * Large, tappable single- and multi-select options.
 * Options may carry a `group`; groups render as separate quiet sets so no decision shows more than four at once.
 * `labelledBy` names the question heading so screen readers hear the question with the options.
 */

interface Option {
  id: string;
  label: string;
  hint?: string;
  group?: string;
}

function groupsOf(options: readonly Option[]) {
  const groups: { label?: string; options: Option[] }[] = [];
  for (const o of options) {
    const last = groups[groups.length - 1];
    if (last && last.label === o.group) last.options.push(o);
    else groups.push({ label: o.group, options: [o] });
  }
  return groups;
}

export function SingleChoice(props: {
  name: string;
  options: readonly Option[];
  value: string | undefined;
  onChange: (id: string) => void;
  labelledBy?: string;
}) {
  return (
    <fieldset className="choices" aria-labelledby={props.labelledBy}>
      {groupsOf(props.options).map((g, i) => (
        <div className="choice-group" key={g.label ?? i} role="group" aria-label={g.label}>
          {g.label && <p className="choice-group-label" aria-hidden="true">{g.label}</p>}
          {g.options.map((o) => (
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
      ))}
    </fieldset>
  );
}

export function MultiChoice(props: {
  options: readonly Option[];
  value: readonly string[];
  onChange: (ids: string[]) => void;
  labelledBy?: string;
}) {
  const toggle = (id: string) =>
    props.onChange(props.value.includes(id) ? props.value.filter((x) => x !== id) : [...props.value, id]);
  return (
    <fieldset className="choices" aria-labelledby={props.labelledBy}>
      {groupsOf(props.options).map((g, i) => (
        <div className="choice-group" key={g.label ?? i} role="group" aria-label={g.label}>
          {g.label && <p className="choice-group-label" aria-hidden="true">{g.label}</p>}
          {g.options.map((o) => (
            <label key={o.id} className={props.value.includes(o.id) ? "choice selected" : "choice"}>
              <input type="checkbox" checked={props.value.includes(o.id)} onChange={() => toggle(o.id)} />
              <span>
                <span className="choice-label">{o.label}</span>
                {o.hint && <span className="choice-hint">{o.hint}</span>}
              </span>
            </label>
          ))}
        </div>
      ))}
    </fieldset>
  );
}
