import { useEffect, useState } from "react";
import { addScreenshot, deleteScreenshot, getScreenshotsForIncident, saveIncident } from "../db";
import { DELIVERY_CHANNELS, type Incident, type Screenshot } from "../types";
import { ScreenshotThumb } from "./ScreenshotThumb";

function newId() {
  return crypto.randomUUID();
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

interface IncidentFormProps {
  existing?: Incident;
  onSaved: () => void;
  onCancel?: () => void;
}

export function IncidentForm({ existing, onSaved, onCancel }: IncidentFormProps) {
  const [receivedDate, setReceivedDate] = useState(existing?.receivedDate ?? todayIso());
  const [channel, setChannel] = useState(existing?.channel ?? DELIVERY_CHANNELS[0]);
  const [channelDetail, setChannelDetail] = useState(existing?.channelDetail ?? "");
  const [senderName, setSenderName] = useState(existing?.senderName ?? "");
  const [senderHandle, setSenderHandle] = useState(existing?.senderHandle ?? "");
  const [senderProfileUrl, setSenderProfileUrl] = useState(existing?.senderProfileUrl ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [screenshotBlocked, setScreenshotBlocked] = useState(existing?.screenshotBlocked ?? false);
  const [manualDocumentation, setManualDocumentation] = useState(existing?.manualDocumentation ?? "");
  const [existingShots, setExistingShots] = useState<Screenshot[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      getScreenshotsForIncident(existing.id).then(setExistingShots);
    }
  }, [existing]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setNewFiles((prev) => [...prev, ...Array.from(files)]);
  }

  async function removeExistingShot(id: string) {
    await deleteScreenshot(id);
    setExistingShots((prev) => prev.filter((s) => s.id !== id));
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const incident: Incident = existing
        ? {
            ...existing,
            receivedDate,
            channel,
            channelDetail,
            senderName,
            senderHandle,
            senderProfileUrl,
            notes,
            screenshotBlocked,
            manualDocumentation,
          }
        : {
            id: newId(),
            createdAt: new Date().toISOString(),
            receivedDate,
            channel,
            channelDetail,
            senderName,
            senderHandle,
            senderProfileUrl,
            notes,
            screenshotBlocked,
            manualDocumentation,
            status: "erfasst",
          };
      await saveIncident(incident);
      for (const file of newFiles) {
        const screenshot: Screenshot = {
          id: newId(),
          incidentId: incident.id,
          blob: file,
          mimeType: file.type,
          fileName: file.name,
        };
        await addScreenshot(screenshot);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{existing ? "Vorfall bearbeiten" : "Neuen Vorfall erfassen"}</h2>

      <div className="grid-2">
        <label>
          Datum des Erhalts *
          <input type="date" required value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
        </label>
        <label>
          Übertragungsweg *
          <select required value={channel} onChange={(e) => setChannel(e.target.value as Incident["channel"])}>
            {DELIVERY_CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Details zum Übertragungsweg (optional)
        <input
          placeholder="z. B. Gruppenchat-Name, Kanal"
          value={channelDetail}
          onChange={(e) => setChannelDetail(e.target.value)}
        />
      </label>

      <div className="grid-2">
        <label>
          Name des Absenders (falls bekannt)
          <input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
        </label>
        <label>
          Username / Handle (falls bekannt)
          <input value={senderHandle} onChange={(e) => setSenderHandle(e.target.value)} />
        </label>
      </div>

      <label>
        Profil-Link / Kontakt (optional)
        <input
          placeholder="https://…"
          value={senderProfileUrl}
          onChange={(e) => setSenderProfileUrl(e.target.value)}
        />
      </label>

      <label>
        Weitere Angaben (optional)
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <label>
        Screenshots
        <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={screenshotBlocked}
          onChange={(e) => setScreenshotBlocked(e.target.checked)}
        />
        Screenshot war technisch nicht möglich (z. B. wegen Screenshot-Sperre der App)
      </label>

      {screenshotBlocked && (
        <label>
          Manuelle Dokumentation (Beschreibung, da kein Screenshot möglich)
          <textarea
            rows={3}
            placeholder="z. B. angezeigter Username, Profildetails, Wortlaut der Nachricht, Zeitpunkt"
            value={manualDocumentation}
            onChange={(e) => setManualDocumentation(e.target.value)}
          />
        </label>
      )}

      {(existingShots.length > 0 || newFiles.length > 0) && (
        <div className="thumb-row">
          {existingShots.map((s) => (
            <ScreenshotThumb key={s.id} blob={s.blob} onRemove={() => removeExistingShot(s.id)} />
          ))}
          {newFiles.map((f, i) => (
            <ScreenshotThumb key={`${f.name}-${i}`} blob={f} onRemove={() => removeNewFile(i)} />
          ))}
        </div>
      )}

      <div className="actions">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "Speichere…" : "Vorfall speichern"}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}
