import { wipeAllData } from "../db";
import { OPERATOR_INFO } from "../legal/operatorInfo";
import { OperatorInfoWarning } from "../components/OperatorInfoWarning";

export function PrivacyPage({ onWiped }: { onWiped: () => void }) {
  async function handleWipe() {
    if (!confirm("Wirklich alle gespeicherten Daten (Profil, Vorfälle, Screenshots) unwiderruflich löschen?")) return;
    await wipeAllData();
    onWiped();
  }

  return (
    <div>
      <OperatorInfoWarning />

      <div className="card">
        <h2>Datenschutzerklärung</h2>

        <h3>1. Verantwortlicher</h3>
        <p>
          {OPERATOR_INFO.name}
          <br />
          {OPERATOR_INFO.street}
          <br />
          {OPERATOR_INFO.postalCode} {OPERATOR_INFO.city}
          <br />
          E-Mail: {OPERATOR_INFO.email}
        </p>

        <h3>2. Deine Eingaben in der App (Profil, Vorfälle, Screenshots)</h3>
        <p>
          Alle Angaben, die du in dieser App machst – dein Profil, erfasste Vorfälle, Absenderangaben und
          hochgeladene Screenshots – werden ausschließlich lokal auf deinem Gerät in der IndexedDB deines Browsers
          gespeichert und verarbeitet. Es findet keine Übertragung dieser Daten an uns oder einen Server statt. Die
          generierte PDF-Anzeige wird ebenfalls lokal in deinem Browser erstellt und direkt an dich heruntergeladen.
        </p>
        <p>
          Da diese Daten unser System zu keinem Zeitpunkt erreichen, sind wir hierfür nach unserem Verständnis nicht
          als datenschutzrechtlich Verantwortliche im Sinne von Art. 4 Nr. 7 DSGVO anzusehen. Für den Schutz dieser
          Daten (z. B. Bildschirmsperre, Geräteverschlüsselung) bist du selbst verantwortlich.
        </p>
        <p>
          <strong>Besondere Kategorien personenbezogener Daten:</strong> Die von dir hinterlegten Screenshots und
          Beschreibungen können besonders sensible Daten (Art. 9 DSGVO, u. a. zum Sexualleben) enthalten. Auch diese
          verbleiben ausschließlich lokal auf deinem Gerät.
        </p>

        <h3>3. Weitergabe bei Einreichung der Anzeige</h3>
        <p>
          Wenn du die generierte PDF-Datei selbst bei einer Online-Wache hochlädst, per E-Mail versendest oder
          ausgedruckt einreichst, findet diese Übertragung direkt zwischen dir und der jeweiligen Polizeidienststelle
          bzw. Staatsanwaltschaft statt. Diese Stelle wird für die weitere Verarbeitung deiner Daten eigenständig
          Verantwortliche im Sinne der DSGVO; es gelten deren eigene Datenschutzhinweise.
        </p>

        <h3>4. Server-Logfiles beim Aufruf dieser Website</h3>
        <p>
          Beim Aufruf dieser Website verarbeitet unser Hosting-Anbieter automatisch technische Zugriffsdaten (u. a.
          IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Browsertyp) in Server-Logfiles. Dies ist
          technisch notwendig und erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am
          sicheren und stabilen Betrieb der Website). Diese Anwendung selbst setzt keine Cookies und bindet keine
          Analyse- oder Tracking-Dienste ein.
        </p>

        <h3>5. Speicherdauer und Löschung</h3>
        <p>
          Deine lokal gespeicherten Daten (Profil, Vorfälle, Screenshots) bleiben so lange in deinem Browser
          gespeichert, bis du sie selbst über die Funktion unten löschst oder den Browser-Speicher deines Geräts
          leerst.
        </p>

        <h3>6. Deine Rechte</h3>
        <p>
          Da wir keinen Zugriff auf deine in der App erfassten Daten haben, kannst du Auskunfts-, Berichtigungs- und
          Löschungsrechte hierfür direkt selbst über die App ausüben. Für Anfragen zu den Server-Logfiles oder zu
          dieser Datenschutzerklärung erreichst du uns unter der oben genannten E-Mail-Adresse.
        </p>
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
