import { jsPDF } from "jspdf";
import type { Incident, Profile, Screenshot } from "../types";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function formatDate(iso: string | undefined): string {
  if (!iso) return "unbekannt";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE");
}

function today(): string {
  return new Date().toLocaleDateString("de-DE");
}

async function blobToImageDataUrl(blob: Blob): Promise<{ dataUrl: string; width: number; height: number; format: "JPEG" | "PNG" }> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  const format: "JPEG" | "PNG" = blob.type.includes("png") ? "PNG" : "JPEG";
  const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
  return { dataUrl, width, height, format };
}

export interface ReportInput {
  profile: Profile;
  incidents: Incident[];
  screenshotsByIncident: Map<string, Screenshot[]>;
}

export async function generateAnzeigePdf({ profile, incidents, screenshotsByIncident }: ReportInput): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const lineHeight = 6;

  function ensureSpace(nextLines = 1) {
    if (y + nextLines * lineHeight > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function writeParagraph(text: string, options: { bold?: boolean; size?: number } = {}) {
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(options.size ?? 11);
    const lines: string[] = doc.splitTextToSize(text, CONTENT_WIDTH);
    ensureSpace(lines.length);
    for (const line of lines) {
      doc.text(line, MARGIN, y);
      y += lineHeight;
    }
  }

  function spacer(mm = 4) {
    y += mm;
  }

  // Absender block
  writeParagraph(`${profile.firstName} ${profile.lastName}`);
  writeParagraph(`${profile.street} ${profile.houseNumber}`);
  writeParagraph(`${profile.postalCode} ${profile.city}`);
  if (profile.phone) writeParagraph(`Telefon: ${profile.phone}`);
  if (profile.email) writeParagraph(`E-Mail: ${profile.email}`);
  if (profile.birthDate) writeParagraph(`Geburtsdatum: ${formatDate(profile.birthDate)}`);

  spacer(8);
  writeParagraph(today());
  spacer(8);

  writeParagraph("An die zuständige Polizeidienststelle / Staatsanwaltschaft");
  spacer(8);

  writeParagraph(
    "Strafanzeige und Strafantrag wegen des Verdachts der unaufgeforderten Übersendung pornografischer Bilddateien gem. § 184 Abs. 1 Nr. 6 StGB",
    { bold: true }
  );
  spacer(6);

  writeParagraph("Sehr geehrte Damen und Herren,");
  spacer(2);
  writeParagraph(
    "hiermit erstatte ich Anzeige und stelle Strafantrag gegen die nachfolgend bezeichnete(n) Person(en), " +
      "hilfsweise gegen unbekannt, wegen des Verdachts einer Straftat gemäß § 184 Abs. 1 Nr. 6 StGB. " +
      "Mir wurde(n) ohne meine Aufforderung pornografische Bild- bzw. Videodateien (sogenannte \"Dickpics\") zugesandt."
  );
  spacer(4);

  writeParagraph(`Anzahl der angezeigten Vorfälle: ${incidents.length}`, { bold: true });
  spacer(4);

  incidents.forEach((incident, index) => {
    ensureSpace(3);
    writeParagraph(`Vorfall ${index + 1}`, { bold: true });
    writeParagraph(`Datum des Erhalts: ${formatDate(incident.receivedDate)}`);
    writeParagraph(
      `Übertragungsweg: ${incident.channel}${incident.channelDetail ? ` (${incident.channelDetail})` : ""}`
    );
    writeParagraph(
      `Angaben zum/zur mutmaßlichen Absender/in: ${
        [incident.senderName, incident.senderHandle].filter(Boolean).join(" / ") || "nicht bekannt"
      }`
    );
    if (incident.senderProfileUrl) {
      writeParagraph(`Profil-/Kontaktlink: ${incident.senderProfileUrl}`);
    }
    if (incident.notes) {
      writeParagraph(`Weitere Angaben: ${incident.notes}`);
    }
    const shots = screenshotsByIncident.get(incident.id) ?? [];
    if (incident.screenshotBlocked) {
      writeParagraph(
        "Hinweis: Ein Screenshot war technisch nicht möglich, da die genutzte Plattform Screenshots verhindert " +
          "bzw. Bildinhalte danach entfernt. Es liegt daher folgende manuelle Dokumentation vor:"
      );
      writeParagraph(incident.manualDocumentation || "(keine manuelle Dokumentation angegeben)");
    }
    writeParagraph(
      `Beweismittel: ${shots.length > 0 ? `${shots.length} Screenshot(s), siehe Anlage` : "kein Screenshot hinterlegt"}`
    );
    spacer(4);
  });

  writeParagraph(
    "Ich beantrage die Einleitung strafrechtlicher Ermittlungen sowie die Verfolgung der Tat von Amts wegen bzw. auf Grundlage " +
      "dieses Strafantrags. Für Rückfragen stehe ich unter den oben genannten Kontaktdaten gerne zur Verfügung."
  );
  spacer(6);
  writeParagraph("Mit freundlichen Grüßen");
  spacer(10);
  writeParagraph(`${profile.firstName} ${profile.lastName}`);

  spacer(10);
  ensureSpace(4);
  writeParagraph("Anlagenverzeichnis:", { bold: true });
  let anlagenCounter = 1;
  for (const incident of incidents) {
    const shots = screenshotsByIncident.get(incident.id) ?? [];
    for (let i = 0; i < shots.length; i++) {
      writeParagraph(
        `Anlage ${anlagenCounter}: Screenshot zu Vorfall vom ${formatDate(incident.receivedDate)} (${incident.channel})`
      );
      anlagenCounter++;
    }
  }

  spacer(10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  const disclaimer = doc.splitTextToSize(
    "Dieses Dokument wurde automatisiert mit einer Webanwendung erstellt und ersetzt keine Rechtsberatung. " +
      "Bitte prüfen Sie die Angaben sorgfältig, bevor Sie die Anzeige bei einer Online-Wache hochladen oder " +
      "ausgedruckt bei Ihrer zuständigen Polizeidienststelle einreichen.",
    CONTENT_WIDTH
  );
  ensureSpace(disclaimer.length);
  for (const line of disclaimer) {
    doc.text(line, MARGIN, y);
    y += 5;
  }

  // Attachments: one screenshot per page, labeled
  anlagenCounter = 1;
  for (const incident of incidents) {
    const shots = screenshotsByIncident.get(incident.id) ?? [];
    for (const shot of shots) {
      doc.addPage();
      y = MARGIN;
      writeParagraph(
        `Anlage ${anlagenCounter}: Screenshot zu Vorfall vom ${formatDate(incident.receivedDate)} (${incident.channel})`,
        { bold: true }
      );
      spacer(4);
      try {
        const { dataUrl, width, height, format } = await blobToImageDataUrl(shot.blob);
        const maxWidth = CONTENT_WIDTH;
        const maxHeight = PAGE_HEIGHT - y - MARGIN;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1) || 1;
        const renderWidth = width * ratio;
        const renderHeight = height * ratio;
        doc.addImage(dataUrl, format, MARGIN, y, renderWidth, renderHeight);
      } catch {
        writeParagraph("(Bild konnte nicht eingebettet werden)");
      }
      anlagenCounter++;
    }
  }

  return doc.output("blob");
}
