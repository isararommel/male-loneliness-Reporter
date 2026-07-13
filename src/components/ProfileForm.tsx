import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../db";
import type { Profile } from "../types";

const EMPTY: Profile = {
  id: "self",
  firstName: "",
  lastName: "",
  birthDate: "",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "",
  phone: "",
  email: "",
};

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    getProfile().then((p) => {
      if (p) setProfile(p);
      setLoaded(true);
    });
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveProfile(profile);
    setSavedAt(Date.now());
  }

  if (!loaded) return <p>Lade…</p>;

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Deine Daten</h2>
      <p className="muted">
        Diese Angaben werden für die Strafanzeige als Anzeigenerstatter/in benötigt. Sie bleiben ausschließlich lokal
        in deinem Browser gespeichert.
      </p>

      <div className="grid-2">
        <label>
          Vorname *
          <input required value={profile.firstName} onChange={(e) => update("firstName", e.target.value)} />
        </label>
        <label>
          Nachname *
          <input required value={profile.lastName} onChange={(e) => update("lastName", e.target.value)} />
        </label>
      </div>

      <label>
        Geburtsdatum
        <input type="date" value={profile.birthDate ?? ""} onChange={(e) => update("birthDate", e.target.value)} />
      </label>

      <div className="grid-2">
        <label className="grow">
          Straße *
          <input required value={profile.street} onChange={(e) => update("street", e.target.value)} />
        </label>
        <label>
          Hausnummer *
          <input required value={profile.houseNumber} onChange={(e) => update("houseNumber", e.target.value)} />
        </label>
      </div>

      <div className="grid-2">
        <label>
          PLZ *
          <input required value={profile.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
        </label>
        <label className="grow">
          Ort *
          <input required value={profile.city} onChange={(e) => update("city", e.target.value)} />
        </label>
      </div>

      <div className="grid-2">
        <label>
          Telefon
          <input type="tel" value={profile.phone ?? ""} onChange={(e) => update("phone", e.target.value)} />
        </label>
        <label>
          E-Mail
          <input type="email" value={profile.email ?? ""} onChange={(e) => update("email", e.target.value)} />
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="primary">
          Speichern
        </button>
        {savedAt && <span className="saved-hint">Gespeichert.</span>}
      </div>
    </form>
  );
}
