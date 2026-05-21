import { useState, useEffect, useRef } from "react";

const LETTER_TEXT = `Hey Buddy,

I've been thinking about how to say this for a while.

You're the kind of person who doesn't realize how rare they are.

You show up. You listen. You never make it weird.

You've seen me at my worst and still decided to stick around — and for that, I will never stop being grateful.

Today is your day. Own it completely.

Happy Birthday. Here's to many more years of us being the ridiculous duo we are.

With all the love,
Your Friend ✦`;

function useTypewriter(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const iRef = useRef(0);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    iRef.current = 0;
    setDisplayed("");
    const tick = () => {
      iRef.current++;
      setDisplayed(text.slice(0, iRef.current));
      if (iRef.current < text.length) tRef.current = setTimeout(tick, speed);
    };
    tRef.current = setTimeout(tick, 600);
    return () => { if (tRef.current) clearTimeout(tRef.current); };
  }, [active, text, speed]);

  return displayed;
}

export default function SecretLetter() {
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");
  const text = useTypewriter(LETTER_TEXT, state === "open");

  const open = () => {
    if (state !== "closed") return;
    setState("opening");
    setTimeout(() => setState("open"), 900);
  };

  return (
    <div className="wf-letter-section">
      <p className="wf-section-label reveal" style={{ textAlign: "center", marginBottom: "1rem" }}>
        ✦ a hidden message
      </p>
      <h2 className="wf-section-title reveal" style={{ textAlign: "center" }}>
        There's a letter<br /><em>waiting for you</em>
      </h2>

      <div className={`wf-envelope-wrap ${state}`} onClick={open}>
        {/* ── Envelope ── */}
        <div className="wf-envelope">
          {/* Back */}
          <div className="wf-env-back" />
          {/* Flap */}
          <div className="wf-env-flap">
            <div className="wf-env-wax">✦</div>
          </div>
          {/* Body */}
          <div className="wf-env-body">
            {state === "closed" && (
              <span className="wf-env-tap">tap to open</span>
            )}
          </div>
          {/* Left / right triangles */}
          <div className="wf-env-left" />
          <div className="wf-env-right" />
          {/* Bottom triangle */}
          <div className="wf-env-bottom" />
        </div>

        {/* ── Letter paper ── */}
        {state !== "closed" && (
          <div className={`wf-letter-paper ${state === "open" ? "risen" : ""}`}>
            <div className="wf-letter-lines">
              {text.split("\n").map((line, i) => (
                <p key={i} className="wf-letter-line">
                  {line || <span>&nbsp;</span>}
                </p>
              ))}
              {state === "open" && text.length < LETTER_TEXT.length && (
                <span className="wf-letter-cursor">|</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
