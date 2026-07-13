# Dickpic-Anzeige

Eine WebApp, um unaufgefordert erhaltene Nacktbilder (insb. "Dickpics") strukturiert zu erfassen und daraus eine
formell aufgebaute Strafanzeige gemäß § 184 Abs. 1 Nr. 6 StGB als PDF zu erzeugen.

## Funktionen

- **Deine Daten**: einmalige Erfassung der eigenen Kontaktdaten als Anzeigenerstatter/in.
- **Vorfälle**: Erfassen jedes Vorfalls mit Datum, Übertragungsweg (WhatsApp, Instagram, Dating-App, …),
  Absenderangaben (falls bekannt) und Screenshot(s) als Beweismittel.
- **Anzeige-PDF**: Auswahl eines oder mehrerer Vorfälle und Generierung einer formellen Strafanzeige inklusive
  eingebetteter Screenshots als Anlagen. Die PDF kann bei einer Online-Wache hochgeladen oder ausgedruckt bei der
  zuständigen Polizeidienststelle eingereicht werden.
- **Datenschutz**: Alle Daten (Profil, Vorfälle, Screenshots) werden ausschließlich lokal im Browser (IndexedDB)
  gespeichert. Es gibt keinen Server und keine Datenübertragung.

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build
npm run preview  # Produktions-Build lokal testen
npm run lint     # Oxlint
```

## Technischer Hintergrund

- React + TypeScript + Vite
- Lokale Persistenz über IndexedDB (`idb`)
- PDF-Erzeugung clientseitig über `jspdf`

## Rechtlicher Hinweis

Diese Anwendung erstellt eine Vorlage für eine Strafanzeige auf Basis deiner Angaben. Sie ersetzt keine
Rechtsberatung. Bitte prüfe die generierte PDF-Datei sorgfältig, bevor du sie einreichst.
