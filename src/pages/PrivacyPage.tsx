import { wipeAllData } from "../db";

export function PrivacyPage({ onWiped }: { onWiped: () => void }) {
  async function handleWipe() {
    if (!confirm("Wirklich alle gespeicherten Daten (Profil, Vorfälle, Screenshots) unwiderruflich löschen?")) return;
    await wipeAllData();
    onWiped();
  }

  return (
    <div>
      <div className="card">
        <h2>Datenschutz</h2>
        <p>
          Diese Anwendung läuft vollständig in deinem Browser. Alle Angaben – dein Profil, erfasste Vorfälle und
          hochgeladene Screenshots – werden ausschließlich lokal auf diesem Gerät in der IndexedDB deines Browsers
          gespeichert.
        </p>
        <ul>
          <li>Es gibt keinen Server, an den deine Daten oder Bilder übertragen werden.</li>
          <li>Die generierte PDF-Anzeige wird lokal erstellt und direkt heruntergeladen.</li>
          <li>
            Löschst du den Browser-Speicher (oder nutzt einen anderen Browser bzw. ein anderes Gerät), sind die
            Daten nicht mehr vorhanden.
          </li>
          <li>Für die Weiterleitung an die Polizei bist du selbst verantwortlich (Upload zur Online-Wache oder Ausdruck).</li>
        </ul>
      </div>

      <div className="card">
        <h3>Rechtlicher Hinweis</h3>
        <p className="muted">
          Diese App erstellt eine formal aufgebaute Strafanzeige auf Basis deiner Angaben. Sie ersetzt keine
          Rechtsberatung. Bitte prüfe die generierte PDF-Datei vor dem Einreichen sorgfältig.
        </p>
      </div>

      <div className="card">
        <h3>Alle Daten löschen</h3>
        <p className="muted">Entfernt dein Profil sowie alle erfassten Vorfälle und Screenshots aus diesem Browser.</p>
        <button className="danger" onClick={handleWipe}>
          Alle lokalen Daten löschen
        </button>
      </div>
    </div>
  );
}
