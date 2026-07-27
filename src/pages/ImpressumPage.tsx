import { OPERATOR_INFO } from "../legal/operatorInfo";
import { OperatorInfoWarning } from "../components/OperatorInfoWarning";

export function ImpressumPage() {
  return (
    <div>
      <OperatorInfoWarning />
      <div className="card">
        <h2>Impressum</h2>
        <p className="muted">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>

        <p>
          {OPERATOR_INFO.name}
          <br />
          {OPERATOR_INFO.street}
          <br />
          {OPERATOR_INFO.postalCode} {OPERATOR_INFO.city}
        </p>

        <h3>Kontakt</h3>
        <p>
          E-Mail: {OPERATOR_INFO.email}
          {OPERATOR_INFO.phone && (
            <>
              <br />
              Telefon: {OPERATOR_INFO.phone}
            </>
          )}
        </p>

        <h3>Verantwortlich für den Inhalt</h3>
        <p>{OPERATOR_INFO.name}</p>
      </div>

      <div className="card">
        <h3>Haftungshinweis</h3>
        <p className="muted">
          Diese Anwendung erstellt eine Vorlage für eine Strafanzeige auf Basis deiner eigenen Angaben und ersetzt
          keine Rechtsberatung. Für die Richtigkeit und Vollständigkeit der von dir eingegebenen Inhalte sowie für
          die Einreichung bei der zuständigen Stelle bist du selbst verantwortlich.
        </p>
      </div>
    </div>
  );
}
