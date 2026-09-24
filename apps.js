// ============================================================
//  HIER TRÄGST DU DEINE APPS EIN
//  Tipp: "neue-app.html" im Browser öffnen – das Formular
//  erzeugt den fertigen Eintrag inkl. Größe und Prüfsumme.
// ============================================================

window.SITE = {
  name: "Ovix",
  title: "Meine <span>Apps</span>", // Überschrift (<span> = Farbverlauf)
  tagline: "Selbst gebaute Tools und Apps – kostenlos, ohne Anmeldung, direkt zum Download.",
  contact: "", // z. B. "mailto:du@example.com" – leer = ausgeblendet
  newDays: 30, // Apps jünger als X Tage bekommen "Neu"-Badge
};

// Felder: id (eindeutig, a-z 0-9 -), name, description, icon, color, version,
// tag (z. B. "Beta"), date, changelog, screenshots, links, downloads.
// Leeres file: "" bei einem Download = Button "Bald verfügbar".
window.APPS = [
  {
    id: "safesort",
    name: "SafeSort",
    description:
      "Sicherer, KI-gestützter Posteingangs-Sortierer für Microsoft 365, Outlook.com und Gmail – " +
      "voreingestellt für Hausverwaltungen. SafeSort ordnet neue Mails Kategorien wie Schadensmeldung, " +
      "Kündigung oder Betriebskosten zu und verschiebt sie in passende Unterordner. Im Zweifel landet " +
      "eine Mail in „Bitte prüfen“ und ein Mensch entscheidet. Mails senden, löschen oder Anhänge " +
      "öffnen ist technisch ausgeschlossen.",
    icon: "icons/safesort.svg",
    color: "#2563eb",
    version: "0.1.0",
    tag: "Beta",
    date: "2026-09-24",
    changelog: [
      "Erste öffentliche Beta",
      "Sortiert Postfächer von Microsoft 365, Outlook.com und Gmail",
      "KI-Modell wählbar: eingebaut, lokal mit Ollama oder EU-API",
      "Desktop-App mit Korrekturen und Probelauf (Dry-Run)",
      "Zugangsdaten verschlüsselt im Windows-Tresor",
    ],
    downloads: [
      {
        platform: "windows",
        file: "downloads/SafeSort-0.1.0-win64.msi",
        size: "66 MB",
        sha256: "99da3301f49171b868ef853fe4884b367d017f0d1a3140bae993af142ebfbd6a",
      },
    ],
  },
];
