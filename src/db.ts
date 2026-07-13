import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Incident, Profile, Screenshot } from "./types";

interface ReporterDB extends DBSchema {
  profile: {
    key: string;
    value: Profile;
  };
  incidents: {
    key: string;
    value: Incident;
    indexes: { "by-createdAt": string };
  };
  screenshots: {
    key: string;
    value: Screenshot;
    indexes: { "by-incidentId": string };
  };
}

let dbPromise: Promise<IDBPDatabase<ReporterDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<ReporterDB>("dickpics-reporter", 1, {
      upgrade(db) {
        db.createObjectStore("profile", { keyPath: "id" });
        const incidents = db.createObjectStore("incidents", { keyPath: "id" });
        incidents.createIndex("by-createdAt", "createdAt");
        const screenshots = db.createObjectStore("screenshots", { keyPath: "id" });
        screenshots.createIndex("by-incidentId", "incidentId");
      },
    });
  }
  return dbPromise;
}

export async function getProfile(): Promise<Profile | undefined> {
  const db = await getDb();
  return db.get("profile", "self");
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await getDb();
  await db.put("profile", profile);
}

export async function listIncidents(): Promise<Incident[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex("incidents", "by-createdAt");
  return all.reverse();
}

export async function getIncident(id: string): Promise<Incident | undefined> {
  const db = await getDb();
  return db.get("incidents", id);
}

export async function saveIncident(incident: Incident): Promise<void> {
  const db = await getDb();
  await db.put("incidents", incident);
}

export async function deleteIncident(id: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["incidents", "screenshots"], "readwrite");
  await tx.objectStore("incidents").delete(id);
  const shots = await tx.objectStore("screenshots").index("by-incidentId").getAllKeys(id);
  await Promise.all(shots.map((key) => tx.objectStore("screenshots").delete(key)));
  await tx.done;
}

export async function addScreenshot(screenshot: Screenshot): Promise<void> {
  const db = await getDb();
  await db.put("screenshots", screenshot);
}

export async function deleteScreenshot(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("screenshots", id);
}

export async function getScreenshotsForIncident(incidentId: string): Promise<Screenshot[]> {
  const db = await getDb();
  return db.getAllFromIndex("screenshots", "by-incidentId", incidentId);
}

export async function exportAllData(): Promise<{ profile?: Profile; incidents: Incident[] }> {
  const [profile, incidents] = await Promise.all([getProfile(), listIncidents()]);
  return { profile, incidents };
}

export async function wipeAllData(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["profile", "incidents", "screenshots"], "readwrite");
  await tx.objectStore("profile").clear();
  await tx.objectStore("incidents").clear();
  await tx.objectStore("screenshots").clear();
  await tx.done;
}
