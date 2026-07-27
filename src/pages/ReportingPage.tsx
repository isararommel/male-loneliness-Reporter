import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../db";
import { BUNDESLAND_REPORTING, BUNDESWEITE_ONLINEWACHEN_UEBERSICHT, type UploadConfidence } from "../data/bundeslandReporting";
import { BUNDESLAENDER, type Bundesland, type Profile } from "../types";

function uploadHint(confidence: UploadConfidence): string {
  switch (confidence) {
    case "bestaetigt":
      return "Datei-Upload für PDF und Screenshots ist dort bestätigt möglich.";
    case "wahrscheinlich":
      return "Ein Datei-Upload ist dort vermutlich möglich – im Formular prüfen.";
    case "unklar":
      return "Ob es dort eine passende Kategorie für diesen Fall gibt, war in unserer Recherche nicht eindeutig zu klären.";
    case "ungeeignet":
    case "ausgeschlossen":
      return "";
  }
}

export function ReportingPage() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setLoaded(true);
    });
  }, []);

  async function selectBundesland(bundesland: Bundesland) {
    const next: Profile = {
      id: "self",
      firstName: "",
      lastName: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      ...profile,
      bundesland,
    };
    await saveProfile(next);
    setProfile(next);
  }

  if (!loaded) return <p>Lade…</p>;

  const info = profile?.bundesland ? BUNDESLAND_REPORTING[profile.bundesland] : undefined;

  return (
    <div>
      <div className="card">
        <h2>Anzeige einreichen</h2>
        <p className="muted">
          Wir haben recherchiert, wie eine Strafanzeige in jedem Bundesland realistisch eingereicht werden kann.
          Amtliche Formulare ändern sich gelegentlich – prüfe die verlinkten Seiten daher immer selbst, bevor du
          etwas hochlädst.
        </p>
        <label>
          Dein Bundesland
          <select
            value={profile?.bundesland ?? ""}
            onChange={(e) => selectBundesland(e.target.value as Bundesland)}
          >
            <option value="">Bitte wählen</option>
            {BUNDESLAENDER.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      {info && (
        <>
          {info.onlineWache && (
            <div className={`card ${info.empfehlung === "online" ? "" : "banner error"}`}>
              <h3>Online einreichen</h3>
              <p>
                <a href={info.onlineWache.url} target="_blank" rel="noreferrer">
                  {info.onlineWache.name}
                </a>
              </p>
              {info.onlineWache.hinweis && <p className="muted">{info.onlineWache.hinweis}</p>}
              {uploadHint(info.onlineWache.uploadConfidence) && (
                <p className="muted">{uploadHint(info.onlineWache.uploadConfidence)}</p>
              )}
              {info.telefonHinweis && (
                <p>
                  <strong>Telefonisch melden:</strong> {info.telefonHinweis}
                </p>
              )}
            </div>
          )}

          <div className="card">
            <h3>Persönlich oder postalisch</h3>
            <p className="muted">
              Du kannst die generierte PDF-Anzeige immer ausdrucken und persönlich bei einer Polizeidienststelle
              abgeben oder per Post einreichen. Das funktioniert unabhängig davon, ob das Online-Formular für
              diesen Fall geeignet ist.
            </p>
            {info.dienststellensucheUrl && (
              <p>
                <a href={info.dienststellensucheUrl} target="_blank" rel="noreferrer">
                  Zuständige Dienststelle finden
                </a>
              </p>
            )}
          </div>
        </>
      )}

      <div className="card">
        <h3>Bundesweite Übersicht</h3>
        <p className="muted">
          Falls ein Link oben nicht mehr aktuell ist, findest du hier die offizielle Übersicht aller Online-Wachen
          der Polizeien der Länder:
        </p>
        <p>
          <a href={BUNDESWEITE_ONLINEWACHEN_UEBERSICHT} target="_blank" rel="noreferrer">
            {BUNDESWEITE_ONLINEWACHEN_UEBERSICHT}
          </a>
        </p>
      </div>

      <div className="card">
        <h3>Warum keine Einreichung per E-Mail?</h3>
        <p className="muted">
          Die polizeiliche Beratung rät ausdrücklich von Strafanzeigen per E-Mail ab, da Anhänge von
          Sicherheitsfiltern der Polizei-Netze blockiert werden können. Nutze stattdessen die Online-Wache oder die
          persönliche/postalische Einreichung.
        </p>
      </div>
    </div>
  );
}
