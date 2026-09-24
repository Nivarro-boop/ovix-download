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

window.APPS = [
  {
    id: "beispiel-app", // eindeutig, nur a-z 0-9 und -
    name: "Beispiel App",
    description: "Kurze Beschreibung, was die App macht und warum sie nützlich ist.",
    icon: "", // z. B. "icons/beispiel.png" – leer = Buchstaben-Icon
    color: "#6d5efc",
    version: "1.0.0",
    date: "2026-09-23",
    changelog: ["Erste Version"],
    screenshots: [], // z. B. ["screenshots/beispiel-1.png"]
    links: [], // z. B. [{ label: "Quellcode", url: "https://github.com/..." }]
    downloads: [
      { platform: "windows", file: "downloads/BeispielApp-Setup.exe", size: "24 MB", sha256: "" },
      { platform: "android", file: "downloads/BeispielApp.apk", size: "12 MB", sha256: "" },
    ],
  },
  {
    id: "zweite-app",
    name: "Zweite App",
    description: "Noch eine App. Einträge einfach kopieren und anpassen.",
    icon: "",
    color: "#10b981",
    version: "0.3.1",
    date: "2026-08-10",
    changelog: ["Bugfixes", "Dunkles Design"],
    downloads: [
      { platform: "mac", file: "downloads/ZweiteApp.dmg", size: "40 MB" },
      { platform: "linux", file: "downloads/ZweiteApp.AppImage", size: "38 MB" },
      { platform: "windows", file: "", note: "Bald verfügbar" }, // leeres file = Button deaktiviert
    ],
  },
];
