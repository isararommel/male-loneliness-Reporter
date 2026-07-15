import { useEffect, useState } from "react";
import {
  deleteIncident,
  getProfile,
  getScreenshotsForIncident,
  listIncidents,
  saveIncident,
} from "../db";
import { generateAnzeigePdf } from "../pdf/generateReport";
import { isProfileComplete, type Incident, type Screenshot } from "../types";
import { IncidentForm } from "../components/IncidentForm";
import { ScreenshotThumb } from "../components/ScreenshotThumb";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE");
}

export function IncidentsPage({ onNeedsProfile }: { onNeedsProfile: () => void }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [shotsByIncident, setShotsByIncident] = useState<Record<string, Screenshot[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Incident | undefined>(undefined);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const list = await listIncidents();
    setIncidents(list);
    const entries = await Promise.all(
      list.map(async (incident) => [incident.id, await getScreenshotsForIncident(incident.id)] as const)
    );
    setShotsByIncident(Object.fromEntries(entries));
  }

  useEffect(() => {
    refresh();
  }, []);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Diesen Vorfall inklusive Screenshots unwiderruflich löschen?")) return;
    await deleteIncident(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    await refresh();
  }

  async function handleGenerate(ids: string[]) {
    setError(null);
    const profile = await getProfile();
    if (!isProfileComplete(profile)) {
      setError("Bitte trage zuerst deine Daten im Bereich \"Deine Daten\" ein.");
      onNeedsProfile();
      return;
    }
    const chosen = incidents.filter((i) => ids.includes(i.id));
    if (chosen.length === 0) return;

    setGenerating(true);
    try {
      const screenshotsByIncident = new Map<string, Screenshot[]>();
      for (const incident of chosen) {
        screenshotsByIncident.set(incident.id, shotsByIncident[incident.id] ?? []);
      }
      const pdfBlob = await generateAnzeigePdf({ profile, incidents: chosen, screenshotsByIncident });

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Strafanzeige-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      const now = new Date().toISOString();
      for (const incident of chosen) {
        await saveIncident({ ...incident, status: "angezeigt", reportedAt: now });
      }
      setSelected(new Set());
      await refresh();
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Vorfälle</h2>
        {!showForm && (
          <button className="primary" onClick={() => { setEditing(undefined); setShowForm(true); }}>
            + Neuen Vorfall erfassen
          </button>
        )}
      </div>

      {error && <div className="banner error">{error}</div>}

      {showForm && (
        <IncidentForm
          existing={editing}
          onSaved={() => {
            setShowForm(false);
            setEditing(undefined);
            refresh();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(undefined);
          }}
        />
      )}

      {incidents.length === 0 && !showForm && (
        <p className="muted">Noch keine Vorfälle erfasst. Lege deinen ersten Vorfall an, sobald du ein unaufgefordertes Bild erhalten hast.</p>
      )}

      {incidents.length > 0 && (
        <div className="incident-toolbar">
          <button
            className="primary"
            disabled={selected.size === 0 || generating}
            onClick={() => handleGenerate(Array.from(selected))}
          >
            {generating ? "Erstelle PDF…" : `Anzeige-PDF erstellen (${selected.size} ausgewählt)`}
          </button>
        </div>
      )}

      <div className="incident-list">
        {incidents.map((incident) => {
          const shots = shotsByIncident[incident.id] ?? [];
          return (
            <div className="card incident-card" key={incident.id}>
              <div className="incident-card-header">
                <label className="select-checkbox">
                  <input
                    type="checkbox"
                    checked={selected.has(incident.id)}
                    onChange={() => toggleSelected(incident.id)}
                  />
                </label>
                <div>
                  <strong>{formatDate(incident.receivedDate)}</strong> · {incident.channel}
                  {incident.channelDetail ? ` (${incident.channelDetail})` : ""}
                </div>
                <span className={`status-badge ${incident.status}`}>
                  {incident.status === "angezeigt" ? "Angezeigt" : "Erfasst"}
                </span>
              </div>

              {(incident.senderName || incident.senderHandle) && (
                <p>
                  Absender: {[incident.senderName, incident.senderHandle].filter(Boolean).join(" / ")}
                </p>
              )}
              {incident.senderProfileUrl && <p className="muted">{incident.senderProfileUrl}</p>}
              {incident.notes && <p>{incident.notes}</p>}
              {incident.screenshotBlocked && (
                <p className="muted">
                  Screenshot war technisch nicht möglich.
                  {incident.manualDocumentation ? ` Manuelle Dokumentation: ${incident.manualDocumentation}` : ""}
                </p>
              )}

              {shots.length > 0 && (
                <div className="thumb-row">
                  {shots.map((s) => (
                    <ScreenshotThumb key={s.id} blob={s.blob} />
                  ))}
                </div>
              )}

              <div className="actions">
                <button
                  className="secondary"
                  onClick={() => {
                    setEditing(incident);
                    setShowForm(true);
                  }}
                >
                  Bearbeiten
                </button>
                <button className="secondary" onClick={() => handleGenerate([incident.id])} disabled={generating}>
                  Nur diesen Vorfall anzeigen
                </button>
                <button className="danger" onClick={() => handleDelete(incident.id)}>
                  Löschen
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
