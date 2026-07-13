import { useState } from "react";
import "./App.css";
import { StartPage } from "./pages/StartPage";
import { ProfileForm } from "./components/ProfileForm";
import { IncidentsPage } from "./pages/IncidentsPage";
import { PrivacyPage } from "./pages/PrivacyPage";

type Tab = "start" | "profil" | "vorfaelle" | "datenschutz";

const TABS: { id: Tab; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "profil", label: "Deine Daten" },
  { id: "vorfaelle", label: "Vorfälle" },
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
        {tab === "vorfaelle" && <IncidentsPage onNeedsProfile={() => setTab("profil")} />}
        {tab === "datenschutz" && <PrivacyPage onWiped={() => setWipeKey((k) => k + 1)} />}
      </main>

      <footer className="app-footer">
        <p>
          Diese Anwendung speichert alle Daten ausschließlich lokal in deinem Browser. Kein Server, keine Übertragung.
        </p>
      </footer>
    </div>
  );
}

export default App;
