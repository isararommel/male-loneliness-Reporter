import { useState } from "react";
import "./App.css";
import { StartPage } from "./pages/StartPage";
import { ProfileForm } from "./components/ProfileForm";
import { IncidentsPage } from "./pages/IncidentsPage";
import { ReportingPage } from "./pages/ReportingPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ImpressumPage } from "./pages/ImpressumPage";

type Tab = "start" | "profil" | "vorfaelle" | "einreichen" | "datenschutz" | "impressum";

const TABS: { id: Tab; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "profil", label: "Deine Daten" },
  { id: "vorfaelle", label: "Vorfälle" },
  { id: "einreichen", label: "Anzeige einreichen" },
  { id: "datenschutz", label: "Datenschutz" },
];

function App() {
  const [tab, setTab] = useState<Tab>("start");
  const [wipeKey, setWipeKey] = useState(0);

  return (
    <div className="app" key={wipeKey}>
      <header className="app-header">
        <h1>Dickpic-Anzeige</h1>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === "start" && <StartPage onStart={() => setTab("vorfaelle")} />}
        {tab === "profil" && <ProfileForm />}
        {tab === "vorfaelle" && (
          <IncidentsPage onNeedsProfile={() => setTab("profil")} onReportGenerated={() => setTab("einreichen")} />
        )}
        {tab === "einreichen" && <ReportingPage />}
        {tab === "datenschutz" && <PrivacyPage onWiped={() => setWipeKey((k) => k + 1)} />}
        {tab === "impressum" && <ImpressumPage />}
      </main>

      <footer className="app-footer">
        <p>
          Diese Anwendung speichert alle Daten ausschließlich lokal in deinem Browser. Kein Server, keine Übertragung.
        </p>
        <nav className="footer-nav">
          <button className="footer-link" onClick={() => setTab("datenschutz")}>
            Datenschutz
          </button>
          <button className="footer-link" onClick={() => setTab("impressum")}>
            Impressum
          </button>
        </nav>
      </footer>
    </div>
  );
}

export default App;
