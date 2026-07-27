import { isOperatorInfoComplete } from "../legal/operatorInfo";

export function OperatorInfoWarning() {
  if (isOperatorInfoComplete()) return null;

  return (
    <div className="banner error operator-warning">
      Betreiberangaben unvollständig: Impressum und Datenschutzerklärung enthalten noch Platzhalter (
      <code>src/legal/operatorInfo.ts</code>). Bitte vor Veröffentlichung mit echten Daten ausfüllen.
    </div>
  );
}
