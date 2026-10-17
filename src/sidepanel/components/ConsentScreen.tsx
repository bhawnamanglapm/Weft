export default function ConsentScreen({ onAcknowledge }: { onAcknowledge: () => void }) {
  return (
    <div className="consent-screen">
      <h1>Weft</h1>
      <p className="consent-lede">
        Weft records real work to find where automation belongs — never to watch or rate the
        person doing it.
      </p>

      <div className="consent-section">
        <h2>What Weft captures</h2>
        <p>
          Step identity only: element role/label, timestamps, URL path (query stripped), and domain.
          A button or link label is its visible text, so a link showing a customer name records that
          name. Emails, ID numbers and long numbers are removed automatically; names are not, so check
          them on the review screen.
        </p>
      </div>

      <div className="consent-section">
        <h2>What Weft never captures</h2>
        <p>
          Input values, query strings, text from tables and other data areas, or screenshots —
          structurally, not just by policy.
        </p>
      </div>

      <div className="consent-section">
        <h2>The rules</h2>
        <ul className="consent-rules">
          <li>Worker-initiated — capture starts only from your own Start button, never automatically or remotely.</li>
          <li>Worker-owned — while you record, steps are kept on this device; when you stop, you review them and can edit, redact or discard them. Only what you confirm is kept.</li>
          <li>No individual performance metrics, ever. Timing is used only to find process bottlenecks.</li>
          <li>Everything stays on this device. No accounts, no backend, no network calls.</li>
        </ul>
      </div>

      <button type="button" className="btn btn-confirm consent-ack" onClick={onAcknowledge}>
        I understand — enable capture
      </button>
    </div>
  );
}
