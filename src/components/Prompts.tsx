import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { promptsForStage, type StageId } from "../../convex/journey";
import { sessionId } from "../session";

/** Free-text reflection prompts for a stage. Every one is optional. */
export function Prompts({ stage }: { stage: StageId }) {
  const saved = useQuery(api.reflections.list, { sessionId });
  const save = useMutation(api.reflections.save);
  return (
    <div className="prompts">
      {promptsForStage(stage).map((p) => (
        <ReflectionField
          key={p.id}
          question={p.question}
          helper={p.helper}
          initial={saved?.find((r) => r.promptId === p.id)?.response ?? ""}
          loaded={saved !== undefined}
          onSave={(response) => save({ sessionId, promptId: p.id, response })}
        />
      ))}
    </div>
  );
}

function ReflectionField(props: {
  question: string;
  helper?: string;
  initial: string;
  loaded: boolean;
  onSave: (text: string) => Promise<unknown>;
}) {
  const [text, setText] = useState(props.initial);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched) setText(props.initial);
  }, [props.initial, touched]);

  return (
    <label className="reflection">
      <span className="question">{props.question}</span>
      {props.helper && <span className="helper">{props.helper}</span>}
      <textarea
        rows={3}
        value={text}
        disabled={!props.loaded}
        placeholder="Optional. Skip anything you'd rather not answer."
        onChange={(e) => {
          setTouched(true);
          setText(e.target.value);
        }}
        onBlur={() => touched && props.onSave(text)}
      />
    </label>
  );
}
