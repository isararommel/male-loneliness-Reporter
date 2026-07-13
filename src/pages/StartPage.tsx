export function StartPage({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <div className="card hero">
        <h2>Tu was gegen unaufgeforderte Penisbilder</h2>
        <p>
          In sozialen Netzwerken, auf Dating-Apps oder in Messenger-Diensten bekommen viele Menschen ungefragt
          Nacktfotos zugeschickt – manche sogar Fotos von Penissen, sogenannte „Dickpics“. Das ist keine Lappalie,
          sondern eine Form sexueller Belästigung, gegen die du vorgehen kannst.
        </p>
        <p>
          Das Versenden von Dickpics gehört zur unaufgeforderten Verbreitung pornografischer Schriften und ist laut{" "}
          <strong>§ 184 Abs. 1 Nr. 6 StGB</strong> eine Straftat. Das gilt auch für Bilder und Videos.
        </p>
        <button className="primary" onClick={onStart}>
          Vorfall erfassen
        </button>
      </div>

      <div className="card">
        <h3>Das solltest du tun, wenn du ein unaufgefordertes Dickpic bekommen hast</h3>
        <ul>
          <li>Beweise durch Screenshots sichern</li>
          <li>Den Kontakt blockieren und melden</li>
          <li>Bilder nicht weiterverbreiten</li>
          <li>Jederzeit Anzeige gegen den Täter erstatten</li>
        </ul>
      </div>

      <div className="card">
        <h3>Für eine Anzeige brauchst du folgende Angaben</h3>
        <ul>
          <li>Datum, an welchem das Dickpic empfangen wurde</li>
          <li>Wie das Dickpic zugestellt wurde (Messenger-App, Social-Media-Account, Mail etc.)</li>
          <li>Screenshot der Aufnahme</li>
          <li>Name oder Usernamen des Absenders (falls vorhanden und bekannt)</li>
          <li>Deine eigenen persönlichen Daten</li>
        </ul>
        <p className="muted">
          Diese App hilft dir, genau diese Angaben strukturiert zu erfassen und daraus eine formell aufgebaute
          Strafanzeige als PDF zu erzeugen. Diese kannst du bei der Online-Wache deines Bundeslandes hochladen oder
          ausgedruckt bei deiner zuständigen Polizeidienststelle abgeben.
        </p>
      </div>
    </div>
  );
}
