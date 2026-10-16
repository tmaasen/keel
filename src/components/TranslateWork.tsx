import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { sessionId } from "../session";
import { humanError } from "../errors";

/**
 * "Translate your work": turn what someone did into words employers use.
 * Research: the most-upvoted help on Reddit was a stranger doing exactly this
 * ("you're not a newspaper person starting over, you have vendor management...").
 */
export function TranslateWork({ profile }: { profile: Doc<"profiles"> | null }) {
  const saved = useQuery(api.skills.get, { sessionId });
  const aiStatus = useQuery(api.missions.aiStatus, { sessionId });
  const save = useMutation(api.skills.save);
  const draft = useAction(api.skills.draftWithGuide);
  const [whatIDid, setWhatIDid] = useState("");
  const [skills, setSkills] = useState("");
  const [skillsBy, setSkillsBy] = useState<"person" | "guide_draft">("person");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const aiOn = profile?.aiPreference === "on" && !aiStatus?.resting;

  useEffect(() => {
    if (saved === undefined || loaded) return;
    // Never clobber anything typed before the saved copy arrived.
    setWhatIDid((typed) => typed || saved?.whatIDid || "");
    setSkills((typed) => {
      if (!typed) setSkillsBy(saved?.skillsBy ?? "person");
      return typed || saved?.skills || "";
    });
    setLoaded(true);
  }, [saved, loaded]);

  const askGuide = async () => {
    setBusy(true);
    setStatus(null);
    try {
      setSkills(await draft({ sessionId, whatIDid }));
      setSkillsBy("guide_draft");
    } catch (e) {
      setStatus(humanError(e));
    } finally {
      setBusy(false);
    }
  };

  const saveAll = async () => {
    await save({ sessionId, whatIDid, skills, skillsBy });
    setStatus("Saved.");
  };

  return (
    <div className="translate">
      <p>
        Years in one place can make your experience sound smaller than it is. Describe what you actually did, not
        your title, and turn it into the words job posts use.
      </p>
      <label className="field">
        <span>What did you actually do?</span>
        <textarea
          rows={6}
          value={whatIDid}
          onChange={(e) => setWhatIDid(e.target.value)}
          placeholder={
            "What did a normal week look like? Who did you work with or for? What problems landed on your desk? " +
            "What would have broken if you weren't there? What were you trusted with?"
          }
        />
      </label>

      {aiOn && (
        <div className="row">
          <button onClick={askGuide} disabled={busy || whatIDid.trim().length < 20}>
            {busy ? "Drafting…" : "Draft a skills list from this"}
          </button>
        </div>
      )}

      <label className="field">
        <span>{skillsBy === "guide_draft" ? "Skills (AI draft: change anything that isn't true)" : "Skills"}</span>
        <textarea
          rows={8}
          value={skills}
          onChange={(e) => {
            setSkills(e.target.value);
            setSkillsBy("person");
          }}
          placeholder={
            "One per line. Turn each thing you did into an action, e.g.\n" +
            "\"dealt with angry customers\" → Resolved escalated customer issues\n" +
            "\"kept the offshore team on track\" → Managed vendor and offshore teams"
          }
        />
      </label>
      <div className="row">
        <button className="primary" onClick={saveAll} disabled={!whatIDid.trim() && !skills.trim()}>
          Save
        </button>
        {status && <span className="helper" role="status">{status}</span>}
      </div>
    </div>
  );
}
