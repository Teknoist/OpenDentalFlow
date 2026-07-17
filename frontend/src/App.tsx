import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./style.css";
type Language = "tr" | "en" | "de";
const messages: Record<Language, Record<string, string>> = {
  tr: {
    tagline: "Diş laboratuvarı iş takip sistemi",
    username: "Kullanıcı adı",
    password: "Parola",
    login: "Giriş yap",
    loggingIn: "Giriş yapılıyor…",
    dashboard: "Gösterge",
    jobs: "İşler",
    newRecord: "Yeni kayıt",
    workflow: "İş durumu",
    clinics: "Klinikler",
    patients: "Hastalar",
    photos: "Fotoğraflar",
    users: "Kullanıcılar",
    settings: "Ayarlar",
    logout: "Çıkış",
    dashboardTitle: "Gösterge paneli",
    newJob: "+ Yeni iş",
    dueToday: "Bugün teslim",
    overdue: "Geciken",
    createdToday: "Bugün oluşturulan",
    byStatus: "Duruma göre işler",
    inLab: "Laboratuvarda",
    dispatched: "Çıktı / Gönderildi",
    jobList: "İş listesi",
    searchJob: "İş kodu / barkod okut ve Enter'a bas",
    previous: "← Önceki",
    next: "Sonraki →",
    page: "Sayfa",
    jobCode: "İş kodu",
    patient: "Hasta",
    clinic: "Klinik",
    type: "Tür",
    due: "Teslim",
    status: "Durum",
    workflowTitle: "İş durumu",
    workflowHelp:
      "İşler yalnızca laboratuvarda bulunanlar ve laboratuvardan çıkanlar olarak ayrılır.",
    usersTitle: "Kullanıcı ve yetki yönetimi",
    addUser: "Kullanıcı ekle",
    edit: "Düzenle",
    save: "Kaydet",
    cancel: "Vazgeç",
    role: "Yetki",
    active: "Aktif",
    passive: "Pasif",
    newPassword: "Yeni parola (değişmeyecekse boş bırakın)",
    roleAdmin: "Yönetici",
    roleEmployee: "Çalışan",
    roleViewer: "Sadece görüntüleme",
    userSaved: "Kullanıcı kaydedildi.",
    settingsTitle: "Sistem ayarları",
    language: "Dil",
    appearance: "Görünüm",
    light: "Açık",
    dark: "Koyu",
    theme: "Tema",
    catalogTitle: "İş türü ve materyal yönetimi",
    add: "Ekle",
    remove: "Kaldır",
    materials: "Materyaller",
    jobTypes: "İş türleri",
    noDefaultMaterial: "Varsayılan materyal yok",
    newJobTitle: "Yeni hasta ve iş kaydı",
    select: "Seçin",
    normal: "Normal",
    high: "Yüksek",
    urgent: "Acil",
    digitalModel: "Dijital model üretilecek",
    toothSelection: "Diş seçimi (FDI)",
    savePrint: "Kaydet ve etiketi yazdır",
    loading: "Yükleniyor…",
    duplicatePatient: "Bu klinikte aynı isimde hasta bulundu.",
    duplicateHelp: "Mevcut kaydı seçin veya farklı kişi olduğunu doğrulayın.",
    nextField: "sonraki alan",
    jobSearch: "iş arama",
    upload: "Yükle",
    notes: "Notlar",
    addNote: "Not ekle",
    statusHistory: "Durum geçmişi",
    allJobs: "Tüm işler",
    search: "Ara",
    code: "Kod",
    phone: "Telefon",
    clinicNotes: "Klinik notları",
    alternatives: "Alternatif kodlar:",
    addClinic: "Kliniği ekle",
    qrBaseUrl: "QR ana adresi",
    defaultPrinter: "Varsayılan etiket yazıcısı",
    selectPrinter: "Yazıcı seçin",
    printerMissing: "Windows'ta kurulu yazıcı bulunamadı.",
    photoAdd: "Fotoğraf ekle",
    send: "Gönder",
    firstName: "Hasta adı",
    lastName: "Soyadı",
    dueDate: "Teslim tarihi",
    material: "Materyal",
    shade: "Renk",
    priority: "Öncelik",
    unitCount: "Üye sayısı",
    description: "Açıklama",
    label: "Etiket",
    teeth: "Dişler",
    clinicName: "Klinik adı",
    shortCode: "Klinik kısa kodu",
    optional: "isteğe bağlı",
    address: "Adres",
    directPrint: "Etiketi doğrudan yazdır",
    catalogHelp:
      "Yeni kayıtta gösterilecek seçenekleri ekleyin veya kaldırın. Eski işlerde kullanılan değerler korunur.",
    newMaterial: "Yeni materyal",
    newJobType: "Yeni iş türü",
    newJobHelp:
      "İş türünü listeden seçebilir veya birkaç harf yazıp kendi tanımınızla devam edebilirsiniz.",
    typeOrSelect: "Yazın veya listeden seçin",
    clinicHelp:
      "Yalnızca klinik adı ve kısa kod zorunludur. Klinik adını yazınca sistem uygun kodu otomatik doldurur.",
    shortCodeHelp:
      "Otomatik üretilir. 3 veya 4 büyük harf/rakam: DPL, DPK, DAR gibi.",
    clinicAddress: "Klinik adresi",
    clinicNotesPlaceholder: "Çalışma şekli, teslimat bilgisi, özel istekler…",
    patientSearchPlaceholder: "Hasta adı veya kodu",
    printHelp:
      "F10 ile kayıt tamamlandığında etiket, seçilen Windows yazıcısına baskı penceresi açılmadan gönderilir.",
    qrHelp:
      "Sabit bir yerel adres kullanmak mevcut QR etiketlerinin IP değişiminden etkilenmesini önler.",
    upcomingJobs: "Yaklaşan işler",
    galleryHelp: "İş fotoğraflarını hasta, klinik, iş kodu ve kategoriyle yönetin.",
    gallerySearch: "Hasta, klinik veya iş kodu",
    allCategories: "Tüm kategoriler",
    noPhotos: "Henüz fotoğraf yok",
    noPhotosHelp: "İş detayından veya QR sayfasından yüklenen fotoğraflar burada görünür.",
    retry: "Tekrar dene",
    deletePhoto: "Sil",
    deletePhotoConfirm: "Bu fotoğraf kalıcı olarak silinsin mi?",
    loadMore: "Daha fazla yükle",
    photoUnavailable: "Önizleme kullanılamıyor",
    qrDisable: "QR erişimini kapat",
    qrEnable: "QR erişimini aç",
    qrRegenerate: "QR yenile",
    viaQr: "QR üzerinden",
    viaPanel: "Panelden",
    backupNow: "Şimdi yedekle",
  },
  en: {
    tagline: "Dental laboratory job tracking",
    username: "Username",
    password: "Password",
    login: "Sign in",
    loggingIn: "Signing in…",
    dashboard: "Dashboard",
    jobs: "Jobs",
    newRecord: "New record",
    workflow: "Job status",
    clinics: "Clinics",
    patients: "Patients",
    photos: "Photos",
    users: "Users",
    settings: "Settings",
    logout: "Sign out",
    dashboardTitle: "Dashboard",
    newJob: "+ New job",
    dueToday: "Due today",
    overdue: "Overdue",
    createdToday: "Created today",
    byStatus: "Jobs by status",
    inLab: "In laboratory",
    dispatched: "Dispatched",
    jobList: "Job list",
    searchJob: "Scan job code / barcode and press Enter",
    previous: "← Previous",
    next: "Next →",
    page: "Page",
    jobCode: "Job code",
    patient: "Patient",
    clinic: "Clinic",
    type: "Type",
    due: "Due date",
    status: "Status",
    workflowTitle: "Job status",
    workflowHelp:
      "Jobs are grouped only as currently in the laboratory or dispatched from the laboratory.",
    usersTitle: "User and permission management",
    addUser: "Add user",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    role: "Role",
    active: "Active",
    passive: "Inactive",
    newPassword: "New password (leave blank to keep it)",
    roleAdmin: "Administrator",
    roleEmployee: "Employee",
    roleViewer: "View only",
    userSaved: "User saved.",
    settingsTitle: "System settings",
    language: "Language",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    theme: "Theme",
    catalogTitle: "Job type and material management",
    add: "Add",
    remove: "Remove",
    materials: "Materials",
    jobTypes: "Job types",
    noDefaultMaterial: "No default material",
    newJobTitle: "New patient and job",
    select: "Select",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
    digitalModel: "Digital model required",
    toothSelection: "Tooth selection (FDI)",
    savePrint: "Save and print label",
    loading: "Loading…",
    duplicatePatient: "A patient with the same name exists at this clinic.",
    duplicateHelp:
      "Select the existing record or confirm that this is a different person.",
    nextField: "next field",
    jobSearch: "job search",
    upload: "Upload",
    notes: "Notes",
    addNote: "Add note",
    statusHistory: "Status history",
    allJobs: "All jobs",
    search: "Search",
    code: "Code",
    phone: "Phone",
    clinicNotes: "Clinic notes",
    alternatives: "Alternative codes:",
    addClinic: "Add clinic",
    qrBaseUrl: "QR base address",
    defaultPrinter: "Default label printer",
    selectPrinter: "Select printer",
    printerMissing: "No Windows printer is installed.",
    photoAdd: "Add photo",
    send: "Send",
    firstName: "Patient first name",
    lastName: "Last name",
    dueDate: "Due date",
    material: "Material",
    shade: "Shade",
    priority: "Priority",
    unitCount: "Unit count",
    description: "Description",
    label: "Label",
    teeth: "Teeth",
    clinicName: "Clinic name",
    shortCode: "Clinic short code",
    optional: "optional",
    address: "Address",
    directPrint: "Print label directly",
    catalogHelp:
      "Add or remove options shown in new jobs. Values already used by older jobs are preserved.",
    newMaterial: "New material",
    newJobType: "New job type",
    newJobHelp: "Select a job type from the list or type a custom value.",
    typeOrSelect: "Type or select from the list",
    clinicHelp:
      "Only clinic name and short code are required. The system fills a suitable code while you type the name.",
    shortCodeHelp:
      "Generated automatically. Use 3 or 4 uppercase letters/digits, such as DPL, DPK or DAR.",
    clinicAddress: "Clinic address",
    clinicNotesPlaceholder: "Workflow, delivery details, special requests…",
    patientSearchPlaceholder: "Patient name or code",
    printHelp:
      "F10 saves the job and sends the label directly to the selected Windows printer without a print dialog.",
    qrHelp:
      "A stable local address prevents existing QR labels from breaking when the IP address changes.",
    upcomingJobs: "Upcoming jobs",
    galleryHelp: "Manage job photos by patient, clinic, job code and category.",
    gallerySearch: "Patient, clinic or job code",
    allCategories: "All categories",
    noPhotos: "No photos yet",
    noPhotosHelp: "Photos uploaded from job details or a QR page appear here.",
    retry: "Try again",
    deletePhoto: "Delete",
    deletePhotoConfirm: "Permanently delete this photo?",
    loadMore: "Load more",
    photoUnavailable: "Preview unavailable",
    qrDisable: "Disable QR access",
    qrEnable: "Enable QR access",
    qrRegenerate: "Regenerate QR",
    viaQr: "Via QR",
    viaPanel: "From panel",
    backupNow: "Back up now",
  },
  de: {
    tagline: "Auftragsverfolgung für Dentallabore",
    username: "Benutzername",
    password: "Passwort",
    login: "Anmelden",
    loggingIn: "Anmeldung…",
    dashboard: "Übersicht",
    jobs: "Aufträge",
    newRecord: "Neuer Auftrag",
    workflow: "Auftragsstatus",
    clinics: "Kliniken",
    patients: "Patienten",
    photos: "Fotos",
    users: "Benutzer",
    settings: "Einstellungen",
    logout: "Abmelden",
    dashboardTitle: "Übersicht",
    newJob: "+ Neuer Auftrag",
    dueToday: "Heute fällig",
    overdue: "Überfällig",
    createdToday: "Heute erstellt",
    byStatus: "Aufträge nach Status",
    inLab: "Im Labor",
    dispatched: "Versandt / Ausgegeben",
    jobList: "Auftragsliste",
    searchJob: "Auftragscode / Barcode scannen und Enter drücken",
    previous: "← Zurück",
    next: "Weiter →",
    page: "Seite",
    jobCode: "Auftragscode",
    patient: "Patient",
    clinic: "Klinik",
    type: "Art",
    due: "Fällig",
    status: "Status",
    workflowTitle: "Auftragsstatus",
    workflowHelp:
      "Aufträge werden nur als im Labor oder als versandt/ausgegeben gruppiert.",
    usersTitle: "Benutzer- und Rechteverwaltung",
    addUser: "Benutzer hinzufügen",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    role: "Rolle",
    active: "Aktiv",
    passive: "Inaktiv",
    newPassword: "Neues Passwort (leer lassen, um es beizubehalten)",
    roleAdmin: "Administrator",
    roleEmployee: "Mitarbeiter",
    roleViewer: "Nur Ansicht",
    userSaved: "Benutzer gespeichert.",
    settingsTitle: "Systemeinstellungen",
    language: "Sprache",
    appearance: "Darstellung",
    light: "Hell",
    dark: "Dunkel",
    theme: "Design",
    catalogTitle: "Auftragsarten und Materialien",
    add: "Hinzufügen",
    remove: "Entfernen",
    materials: "Materialien",
    jobTypes: "Auftragsarten",
    noDefaultMaterial: "Kein Standardmaterial",
    newJobTitle: "Neuer Patient und Auftrag",
    select: "Auswählen",
    normal: "Normal",
    high: "Hoch",
    urgent: "Dringend",
    digitalModel: "Digitales Modell erforderlich",
    toothSelection: "Zahnauswahl (FDI)",
    savePrint: "Speichern und Etikett drucken",
    loading: "Wird geladen…",
    duplicatePatient:
      "In dieser Klinik gibt es einen Patienten mit demselben Namen.",
    duplicateHelp:
      "Vorhandenen Datensatz auswählen oder eine andere Person bestätigen.",
    nextField: "nächstes Feld",
    jobSearch: "Auftragssuche",
    upload: "Hochladen",
    notes: "Notizen",
    addNote: "Notiz hinzufügen",
    statusHistory: "Statusverlauf",
    allJobs: "Alle Aufträge",
    search: "Suchen",
    code: "Code",
    phone: "Telefon",
    clinicNotes: "Kliniknotizen",
    alternatives: "Alternative Codes:",
    addClinic: "Klinik hinzufügen",
    qrBaseUrl: "QR-Basisadresse",
    defaultPrinter: "Standard-Etikettendrucker",
    selectPrinter: "Drucker auswählen",
    printerMissing: "Kein Windows-Drucker installiert.",
    photoAdd: "Foto hinzufügen",
    send: "Senden",
    firstName: "Vorname des Patienten",
    lastName: "Nachname",
    dueDate: "Fälligkeitsdatum",
    material: "Material",
    shade: "Farbe",
    priority: "Priorität",
    unitCount: "Einheiten",
    description: "Beschreibung",
    label: "Etikett",
    teeth: "Zähne",
    clinicName: "Klinikname",
    shortCode: "Klinik-Kurzcode",
    optional: "optional",
    address: "Adresse",
    directPrint: "Etikett direkt drucken",
    catalogHelp:
      "Optionen für neue Aufträge hinzufügen oder entfernen. In älteren Aufträgen verwendete Werte bleiben erhalten.",
    newMaterial: "Neues Material",
    newJobType: "Neue Auftragsart",
    newJobHelp:
      "Auftragsart aus der Liste wählen oder einen eigenen Wert eingeben.",
    typeOrSelect: "Eingeben oder aus der Liste wählen",
    clinicHelp:
      "Nur Klinikname und Kurzcode sind erforderlich. Beim Eingeben des Namens wird ein passender Code vorgeschlagen.",
    shortCodeHelp:
      "Wird automatisch erzeugt. 3 oder 4 Großbuchstaben/Ziffern, z. B. DPL, DPK oder DAR.",
    clinicAddress: "Klinikadresse",
    clinicNotesPlaceholder: "Arbeitsweise, Lieferdetails, Sonderwünsche…",
    patientSearchPlaceholder: "Patientenname oder Code",
    printHelp:
      "F10 speichert den Auftrag und sendet das Etikett ohne Druckdialog direkt an den ausgewählten Windows-Drucker.",
    qrHelp:
      "Eine feste lokale Adresse verhindert, dass vorhandene QR-Etiketten bei einer IP-Änderung ungültig werden.",
    upcomingJobs: "Anstehende Aufträge",
    galleryHelp: "Auftragsfotos nach Patient, Klinik, Auftragscode und Kategorie verwalten.",
    gallerySearch: "Patient, Klinik oder Auftragscode",
    allCategories: "Alle Kategorien",
    noPhotos: "Noch keine Fotos",
    noPhotosHelp: "Fotos aus Auftragsdetails oder einer QR-Seite erscheinen hier.",
    retry: "Erneut versuchen",
    deletePhoto: "Löschen",
    deletePhotoConfirm: "Dieses Foto dauerhaft löschen?",
    loadMore: "Mehr laden",
    photoUnavailable: "Vorschau nicht verfügbar",
    qrDisable: "QR-Zugriff sperren",
    qrEnable: "QR-Zugriff aktivieren",
    qrRegenerate: "QR erneuern",
    viaQr: "Über QR",
    viaPanel: "Aus der Verwaltung",
    backupNow: "Jetzt sichern",
  },
};
const currentLanguage = (): Language =>
  (localStorage.getItem("language") as Language) || "tr";
const currentLocale = () =>
  ({ tr: "tr-TR", en: "en-GB", de: "de-DE" })[currentLanguage()];
const tt = (key: string) =>
  messages[currentLanguage()][key] || messages.tr[key] || key;
const statusLabel = (status: string) =>
  status === "Dispatched" ? tt("dispatched") : tt("inLab");
const API = import.meta.env.VITE_API_URL || "/api";
const auth = () => localStorage.getItem("token");
async function api(path: string, opts: RequestInit = {}) {
  const h: any = { ...(opts.headers || {}) };
  if (auth()) h.Authorization = `Bearer ${auth()}`;
  if (opts.body && !(opts.body instanceof FormData))
    h["Content-Type"] = "application/json";
  let r: Response;
  try {
    r = await fetch(API + path, { ...opts, headers: h });
  } catch {
    throw new Error(
      "Sunucuya ulaşılamadı. OpenDental Lab uygulamasının açık olduğundan emin olun.",
    );
  }
  if (r.status === 401 && path !== "/auth/login") {
    localStorage.removeItem("token");
    window.location.replace("/login?expired=1");
    throw new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
  }
  if (!r.ok)
    throw new Error(
      (await r.json().catch(() => ({}))).message ||
        `İşlem başarısız (${r.status})`,
    );
  return r.status === 204 ? null : r.json();
}
function uploadApi(
  path: string,
  body: FormData,
  onProgress: (value: number) => void,
) {
  return new Promise<any>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", API + path);
    const token = auth();
    if (token) request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable)
        onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => reject(new Error("Sunucuya ulaşılamadı."));
    request.onload = () => {
      let result: any = {};
      try {
        result = request.responseText ? JSON.parse(request.responseText) : null;
      } catch {
        result = {};
      }
      if (request.status >= 200 && request.status < 300) resolve(result);
      else
        reject(
          new Error(result?.message || `Yükleme başarısız (${request.status})`),
        );
    };
    request.send(body);
  });
}
const statuses = ["InLab", "Dispatched"];
const photoCategories = [
  "Intraoral",
  "Shade",
  "Impression",
  "Model",
  "TryIn",
  "Design",
  "Production",
  "Finished",
  "Revision",
  "ClinicNote",
  "Other",
];
const categoryNames: Record<Language, Record<string, string>> = {
  tr: {
    Intraoral: "Ağız içi",
    Shade: "Renk",
    Impression: "Ölçü",
    Model: "Model",
    TryIn: "Prova",
    Design: "Tasarım",
    Production: "Üretim",
    Finished: "Bitmiş iş",
    Revision: "Revizyon",
    ClinicNote: "Klinik notu",
    Other: "Diğer",
  },
  en: {
    Intraoral: "Intraoral",
    Shade: "Shade",
    Impression: "Impression",
    Model: "Model",
    TryIn: "Try-in",
    Design: "Design",
    Production: "Production",
    Finished: "Finished",
    Revision: "Revision",
    ClinicNote: "Clinic note",
    Other: "Other",
  },
  de: {
    Intraoral: "Intraoral",
    Shade: "Farbe",
    Impression: "Abformung",
    Model: "Modell",
    TryIn: "Anprobe",
    Design: "Design",
    Production: "Produktion",
    Finished: "Fertige Arbeit",
    Revision: "Korrektur",
    ClinicNote: "Kliniknotiz",
    Other: "Sonstiges",
  },
};
const categoryLabel = (value: string) =>
  categoryNames[currentLanguage()][value] || value;
function Login() {
  const [e, setE] = useState(""),
    [busy, setBusy] = useState(false),
    [language, setLanguage] = useState<Language>(currentLanguage()),
    [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  async function go(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setE("");
    setBusy(true);
    const f = new FormData(ev.currentTarget);
    try {
      const x = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(f)),
      });
      localStorage.setItem("token", x.token);
      window.location.replace("/");
    } catch (x: any) {
      setE(x.message || "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login">
      <form onSubmit={go} className="card">
        <div className="preferences">
          <select
            value={language}
            aria-label={tt("language")}
            onChange={(x) => {
              const value = x.target.value as Language;
              localStorage.setItem("language", value);
              setLanguage(value);
            }}
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              const value = theme === "dark" ? "light" : "dark";
              localStorage.setItem("theme", value);
              setTheme(value);
            }}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
        <h1>OpenDental Lab</h1>
        <p>{tt("tagline")}</p>
        <input
          name="username"
          autoComplete="username"
          placeholder={tt("username")}
          required
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={tt("password")}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? tt("loggingIn") : tt("login")}
        </button>
        {e && <p className="error">{e}</p>}
      </form>
    </main>
  );
}
function Layout() {
  const nav = useNavigate(),
    [language, setLanguage] = useState<Language>(currentLanguage()),
    [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const shortcuts = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        event.preventDefault();
        nav("/jobs");
      }
    };
    window.addEventListener("keydown", shortcuts);
    return () => window.removeEventListener("keydown", shortcuts);
  }, [nav]);
  return (
    <>
      <aside>
        <div className="sidebar-brand" aria-label="OpenDental Lab">
          <span>OD</span>
          <small>LAB</small>
        </div>
        {[
          ["/", tt("dashboard")],
          ["/jobs", tt("jobs")],
          ["/new", tt("newRecord")],
          ["/kanban", tt("workflow")],
          ["/clinics", tt("clinics")],
          ["/patients", tt("patients")],
          ["/gallery", tt("photos")],
          ["/users", tt("users")],
          ["/settings", tt("settings")],
        ].map((x) => (
          <NavLink key={x[0]} to={x[0]} end={x[0] === "/"}>
            {x[1]}
          </NavLink>
        ))}
        <div className="sidebar-preferences">
          <select
            value={language}
            onChange={(x) => {
              const value = x.target.value as Language;
              localStorage.setItem("language", value);
              setLanguage(value);
            }}
          >
            <option value="tr">TR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
          <button
            className="secondary"
            onClick={() => {
              const value = theme === "dark" ? "light" : "dark";
              localStorage.setItem("theme", value);
              setTheme(value);
            }}
          >
            {theme === "dark" ? `☀ ${tt("light")}` : `☾ ${tt("dark")}`}
          </button>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            nav("/login");
          }}
        >
          {tt("logout")}
        </button>
      </aside>
      <section className="content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="new" element={<NewJob />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="clinics" element={<Clinics />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="label/:id" element={<Label />} />
        </Routes>
      </section>
    </>
  );
}
function Dashboard() {
  const [j, setJ] = useState<any[]>([]);
  useEffect(() => {
    api("/jobs").then(setJ);
  }, []);
  const today = new Date().toDateString();
  const upcoming = [...j]
    .filter((x) => x.status !== "Dispatched" && x.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 6);
  return (
    <>
      <header>
        <h1>{tt("dashboardTitle")}</h1>
        <Link className="button" to="/new">
          {tt("newJob")}
        </Link>
      </header>
      <div className="stats">
        <Stat
          n={
            j.filter(
              (x) => x.dueDate && new Date(x.dueDate).toDateString() === today,
            ).length
          }
          t={tt("dueToday")}
        />
        <Stat
          n={
            j.filter(
              (x) =>
                x.dueDate &&
                new Date(x.dueDate) < new Date() &&
                x.status !== "Dispatched",
            ).length
          }
          t={tt("overdue")}
        />
        <Stat
          n={j.filter((x) => x.status === "InLab").length}
          t={tt("inLab")}
        />
        <Stat
          n={
            j.filter((x) => new Date(x.createdAt).toDateString() === today)
              .length
          }
          t={tt("createdToday")}
        />
      </div>
      <h2>{tt("byStatus")}</h2>
      <div className="stats">
        {statuses.map((s) => (
          <Stat
            key={s}
            n={j.filter((x) => x.status === s).length}
            t={statusLabel(s)}
          />
        ))}
      </div>
      <section className="dashboard-section">
        <h2>{tt("upcomingJobs")}</h2>
        <div className="card table-wrap">
          <table className="compact-table">
            <thead>
              <tr>
                <th>{tt("jobCode")}</th>
                <th>{tt("patient")}</th>
                <th>{tt("clinic")}</th>
                <th>{tt("type")}</th>
                <th>{tt("due")}</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link to={`/jobs/${job.id}`}><b>{job.jobCode}</b></Link>
                  </td>
                  <td>{job.patient?.firstName} {job.patient?.lastName}</td>
                  <td>{job.clinic?.name}</td>
                  <td>{job.jobType}</td>
                  <td>{new Date(job.dueDate).toLocaleDateString(currentLocale())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
function QuickCatalog() {
  const [materials, setMaterials] = useState<any[]>([]),
    [types, setTypes] = useState<any[]>([]),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const load = () =>
    Promise.all([api("/materials"), api("/job-types")]).then(([m, t]) => {
      setMaterials(m);
      setTypes(t);
    });
  useEffect(() => {
    void load();
  }, []);
  async function addMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") || "").trim();
    try {
      await api("/materials", {
        method: "POST",
        body: JSON.stringify({
          name,
          isActive: true,
          sortOrder: materials.length + 1,
        }),
      });
      form.reset();
      setMessage(`Materyal eklendi: ${name}`);
      setError("");
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  }
  async function addType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    try {
      await api("/job-types", {
        method: "POST",
        body: JSON.stringify({
          name,
          defaultMaterial: data.get("defaultMaterial") || null,
          isActive: true,
          sortOrder: types.length + 1,
        }),
      });
      form.reset();
      setMessage(`İş türü eklendi: ${name}`);
      setError("");
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  }
  async function remove(
    kind: "materials" | "job-types",
    id: number,
    name: string,
  ) {
    if (
      !window.confirm(
        `${name} listesinden kaldırılsın mı? Eski işler etkilenmez.`,
      )
    )
      return;
    try {
      await api(`/${kind}/${id}`, { method: "DELETE" });
      setMessage(`${name} listeden kaldırıldı.`);
      setError("");
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  }
  return (
    <section className="quick-catalog card">
      <h2>{tt("catalogTitle")}</h2>
      <p>{tt("catalogHelp")}</p>
      <div className="grid2">
        <form className="inline" onSubmit={addMaterial}>
          <input name="name" required placeholder={tt("newMaterial")} />
          <button>{tt("add")}</button>
        </form>
        <form className="inline" onSubmit={addType}>
          <input name="name" required placeholder={tt("newJobType")} />
          <select name="defaultMaterial" defaultValue="">
            <option value="">{tt("noDefaultMaterial")}</option>
            {materials.map((material) => (
              <option key={material.id} value={material.name}>
                {material.name}
              </option>
            ))}
          </select>
          <button>{tt("add")}</button>
        </form>
      </div>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid2 catalog-lists">
        <div>
          <h3>{tt("materials")}</h3>
          {materials.map((item) => (
            <div className="catalog-row" key={item.id}>
              <span>{item.name}</span>
              <button
                className="danger"
                onClick={() => remove("materials", item.id, item.name)}
              >
                {tt("remove")}
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3>{tt("jobTypes")}</h3>
          {types.map((item) => (
            <div className="catalog-row" key={item.id}>
              <span>
                {item.name}
                {item.defaultMaterial ? ` → ${item.defaultMaterial}` : ""}
              </span>
              <button
                className="danger"
                onClick={() => remove("job-types", item.id, item.name)}
              >
                {tt("remove")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Stat({ n, t }: any) {
  return (
    <div className="card stat">
      <b>{n}</b>
      <span>{t}</span>
    </div>
  );
}
function Jobs() {
  const [j, setJ] = useState<any[]>([]),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1);
  const nav = useNavigate();
  const load = () =>
    api(
      `/jobs?page=${page}&pageSize=50${q ? `&q=${encodeURIComponent(q)}` : ""}`,
    ).then(setJ);
  useEffect(() => {
    void load();
  }, [page]);
  return (
    <>
      <header>
        <h1>{tt("jobList")}</h1>
        <Link className="button" to="/new">
          {tt("newJob").replace("+ ", "")}
        </Link>
      </header>
      <input
        autoFocus
        className="scan"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            api(`/jobs/code/${q}`)
              .then((x) => nav(`/jobs/${x.id}`))
              .catch(() => {
                setPage(1);
                load();
              });
        }}
        placeholder={tt("searchJob")}
      />
      <Table rows={j} />
      <div className="pager">
        <button disabled={page === 1} onClick={() => setPage((x) => x - 1)}>
          {tt("previous")}
        </button>
        <span>
          {tt("page")} {page}
        </span>
        <button disabled={j.length < 50} onClick={() => setPage((x) => x + 1)}>
          {tt("next")}
        </button>
      </div>
    </>
  );
}
function Table({ rows }: any) {
  return (
    <table>
      <thead>
        <tr>
          <th>{tt("jobCode")}</th>
          <th>{tt("patient")}</th>
          <th>{tt("clinic")}</th>
          <th>{tt("type")}</th>
          <th>{tt("due")}</th>
          <th>{tt("status")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((x: any) => (
          <tr key={x.id}>
            <td>
              <Link to={`/jobs/${x.id}`}>{x.jobCode}</Link>
            </td>
            <td>
              {x.patient?.firstName} {x.patient?.lastName}
            </td>
            <td>{x.clinic?.name}</td>
            <td>{x.jobType}</td>
            <td>{x.dueDate?.slice(0, 10)}</td>
            <td>
              <span className="pill">{statusLabel(x.status)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
const teeth = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46,
  45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];
function NewJob() {
  const [c, setC] = useState<any[]>([]),
    [types, setTypes] = useState<any[]>([]),
    [materials, setMaterials] = useState<any[]>([]),
    [jobType, setJobType] = useState(""),
    [material, setMaterial] = useState(""),
    [sel, setSel] = useState<number[]>([]),
    [err, setErr] = useState(""),
    [matches, setMatches] = useState<any[]>([]),
    [patientId, setPatientId] = useState<number | null>(null),
    [forceNew, setForceNew] = useState(false);
  const saveMode = useRef<"save" | "print">("save");
  const nav = useNavigate();
  useEffect(() => {
    api("/clinics").then(setC);
    api("/job-types").then(setTypes);
    api("/materials").then(setMaterials);
  }, []);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = new FormData(e.currentTarget),
      f = Object.fromEntries(form);
    try {
      if (!patientId && !forceNew) {
        const found = await api(
          `/patients/matches?clinicId=${f.clinicId}&firstName=${encodeURIComponent(String(f.firstName))}&lastName=${encodeURIComponent(String(f.lastName))}`,
        );
        if (found.length) {
          setMatches(found);
          return;
        }
      }
      const x = await api("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...f,
          clinicId: +f.clinicId,
          teeth: sel,
          unitCount: +f.unitCount || sel.length,
          patientId,
          digitalModelRequired: form.get("digitalModelRequired") === "on",
        }),
      });
      if (saveMode.current === "print") {
        await api(`/jobs/${x.id}/print`, { method: "POST" });
      }
      nav(`/jobs/${x.id}`);
    } catch (x: any) {
      setErr(x.message);
    }
  }
  return (
    <>
      <h1>{tt("newJobTitle")}</h1>
      <p>{tt("newJobHelp")}</p>
      <form
        className="form card"
        onSubmit={save}
        onKeyDown={(event) => {
          if (event.key === "F9" || event.key === "F10") {
            event.preventDefault();
            saveMode.current = event.key === "F10" ? "print" : "save";
            event.currentTarget.requestSubmit();
            return;
          }
          if (event.key === "Enter") {
            const target = event.target as HTMLElement;
            if (target.tagName === "TEXTAREA" || target.tagName === "BUTTON")
              return;
            event.preventDefault();
            const controls = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                "input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button[type=submit]",
              ),
            ).filter((element) => element.tabIndex !== -1);
            const next = controls[controls.indexOf(target) + 1];
            next?.focus();
          }
        }}
      >
        <label>
          {tt("clinic")}
          <select name="clinicId" required>
            <option value="">{tt("select")}</option>
            {c.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid2">
          <label>
            {tt("firstName")}
            <input name="firstName" required disabled={!!patientId} />
          </label>
          <label>
            {tt("lastName")}
            <input name="lastName" required disabled={!!patientId} />
          </label>
          <label>
            {tt("dueDate")}
            <input name="dueDate" type="date" />
          </label>
          <label>
            {tt("type")}
            <input
              name="jobType"
              list="job-type-list"
              required
              value={jobType}
              onChange={(event) => {
                const value = event.target.value;
                setJobType(value);
                const selected = types.find(
                  (item) =>
                    item.name.toLocaleLowerCase("tr") ===
                    value.toLocaleLowerCase("tr"),
                );
                if (selected?.defaultMaterial)
                  setMaterial(selected.defaultMaterial);
              }}
              placeholder={tt("typeOrSelect")}
            />
            <datalist id="job-type-list">
              {types.map((x) => (
                <option key={x.id} value={x.name} />
              ))}
            </datalist>
          </label>
          <label>
            {tt("material")}
            <input
              name="material"
              list="material-list"
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
              placeholder={tt("typeOrSelect")}
            />
            <datalist id="material-list">
              {materials.map((x) => (
                <option key={x.id} value={x.name} />
              ))}
            </datalist>
          </label>
          <label>
            {tt("shade")}
            <input name="shade" />
          </label>
          <label>
            {tt("priority")}
            <select name="priority">
              <option value="Normal">{tt("normal")}</option>
              <option value="High">{tt("high")}</option>
              <option value="Urgent">{tt("urgent")}</option>
            </select>
          </label>
          <label>
            {tt("unitCount")}
            <input
              name="unitCount"
              type="number"
              min="1"
              value={sel.length || 1}
              readOnly
            />
          </label>
        </div>
        <label className="check">
          <input name="digitalModelRequired" type="checkbox" />{" "}
          <b>{tt("digitalModel")}</b>
        </label>
        {patientId && (
          <div className="warning">
            Mevcut hasta seçildi. Yeni iş bu hastanın geçmişine eklenecek.{" "}
            <button
              type="button"
              onClick={() => {
                setPatientId(null);
                setForceNew(false);
              }}
            >
              Seçimi kaldır
            </button>
          </div>
        )}
        {matches.length > 0 && !patientId && (
          <div className="warning">
            <b>{tt("duplicatePatient")}</b>
            <p>{tt("duplicateHelp")}</p>
            {matches.map((m) => (
              <div key={m.id}>
                <Link to={`/patients/${m.id}`}>
                  {m.patientCode} · {m.firstName} {m.lastName} · {m.jobCount} iş
                </Link>{" "}
                <button
                  type="button"
                  onClick={() => {
                    setPatientId(m.id);
                    setMatches([]);
                  }}
                >
                  Bu hastayı kullan
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForceNew(true);
                setMatches([]);
              }}
            >
              Farklı kişi, yeni hasta oluştur
            </button>
          </div>
        )}
        <label>{tt("toothSelection")}</label>
        <div className="teeth">
          {teeth.map((t) => (
            <button
              key={t}
              type="button"
              className={sel.includes(t) ? "on" : ""}
              onClick={() =>
                setSel((s) =>
                  s.includes(t) ? s.filter((x) => x !== t) : [...s, t],
                )
              }
            >
              {t}
            </button>
          ))}
        </div>
        <label>
          {tt("description")}
          <textarea name="description" />
        </label>
        <div className="shortcut-actions">
          <button type="submit" onClick={() => (saveMode.current = "save")}>
            {tt("save")} <kbd>F9</kbd>
          </button>
          <button type="submit" onClick={() => (saveMode.current = "print")}>
            {tt("savePrint")} <kbd>F10</kbd>
          </button>
          <small>
            <kbd>Enter</kbd> {tt("nextField")} · <kbd>F3</kbd> {tt("jobSearch")}
          </small>
        </div>
        {err && <p className="error">{err}</p>}
      </form>
    </>
  );
}
function JobDetail() {
  const { id } = useParams(),
    [j, setJ] = useState<any>(),
    [uploadProgress, setUploadProgress] = useState(0),
    [uploadError, setUploadError] = useState(""),
    [jobMessage, setJobMessage] = useState("");
  const load = () => api(`/jobs/${id}`).then(setJ);
  useEffect(() => {
    void load();
  }, [id]);
  if (!j) return <p>{tt("loading")}</p>;
  async function note(e: any) {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    await api(`/jobs/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text: new FormData(formEl).get("text") }),
    });
    formEl.reset();
    load();
  }
  async function upload(e: any) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    setUploadError("");
    setUploadProgress(1);
    try {
      await uploadApi(
        `/jobs/${id}/photos`,
        new FormData(form),
        setUploadProgress,
      );
      form.reset();
      setUploadProgress(100);
      await load();
      setTimeout(() => setUploadProgress(0), 700);
    } catch (x: any) {
      setUploadError(x.message);
      setUploadProgress(0);
    }
  }
  async function regenerateQr() {
    if (
      !window.confirm(
        "Eski QR bağlantısı geçersiz olacak. Yeni QR oluşturulsun mu?",
      )
    )
      return;
    await api(`/jobs/${id}/regenerate-access-token`, { method: "POST" });
    setJobMessage("QR bağlantısı yenilendi. Yeni etiketi yazdırın.");
    await load();
  }
  async function toggleQr() {
    await api(`/jobs/${id}/access`, {
      method: "PATCH",
      body: JSON.stringify({ enabled: !j.accessEnabled }),
    });
    setJobMessage(
      j.accessEnabled ? "QR erişimi kapatıldı." : "QR erişimi açıldı.",
    );
    await load();
  }
  return (
    <>
      <header>
        <div>
          <h1>{j.jobCode}</h1>
          <p>
            <Link to={`/patients/${j.patient.id}`}>
              {j.patient.firstName} {j.patient.lastName}
            </Link>{" "}
            · {j.clinic.name}
          </p>
        </div>
        <div className="header-actions">
          <Link className="button" to={`/label/${id}`}>
            {tt("label")}
          </Link>
          <button className="secondary" onClick={toggleQr}>
            {j.accessEnabled ? tt("qrDisable") : tt("qrEnable")}
          </button>
          <button className="secondary" onClick={regenerateQr}>
            {tt("qrRegenerate")}
          </button>
        </div>
      </header>
      {jobMessage && <p className="success card">{jobMessage}</p>}
      <div className="card detail">
        <b>{j.jobType}</b>
        <span>
          {j.material} · {j.shade}
        </span>
        <span>
          {tt("teeth")}: {j.teeth} / {j.unitCount}
        </span>
        {j.digitalModelRequired && (
          <strong className="digital-badge">◈ {tt("digitalModel")}</strong>
        )}
        <select
          value={j.status}
          onChange={(e) =>
            api(`/jobs/${id}/status`, {
              method: "PATCH",
              body: JSON.stringify({ status: e.target.value }),
            }).then(load)
          }
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>
      <h2>{tt("photos")}</h2>
      <form onSubmit={upload}>
        <input
          name="files"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
        />
        <select name="category">
          {photoCategories.map((x) => (
            <option key={x} value={x}>
              {categoryLabel(x)}
            </option>
          ))}
        </select>
        <button disabled={uploadProgress > 0 && uploadProgress < 100}>
          {tt("upload")}
        </button>
      </form>
      {uploadProgress > 0 && (
        <div className="upload-progress">
          <div style={{ width: `${uploadProgress}%` }} />
          <span>%{uploadProgress}</span>
        </div>
      )}
      {uploadError && <p className="error">{uploadError}</p>}
      <div className="photos">
        {j.photos.map((p: any) => (
          <img
            key={p.id}
            src={`${location.origin}/uploads/${p.thumbnailStoredFileName || p.storedFileName}`}
            alt={categoryLabel(p.category)}
          />
        ))}
      </div>
      <h2>{tt("notes")}</h2>
      {j.notes.map((n: any) => (
        <p key={n.id} className="card">
          {n.text} <small>{n.createdViaQr ? tt("viaQr") : tt("viaPanel")}</small>
        </p>
      ))}
      <form onSubmit={note}>
        <textarea name="text" required />
        <button>{tt("addNote")}</button>
      </form>
      <h2>{tt("statusHistory")}</h2>
      {j.statusHistory.map((h: any) => (
        <p key={h.id}>
          {statusLabel(h.oldStatus)} → {statusLabel(h.newStatus)} ·{" "}
          {new Date(h.changedAt).toLocaleString(currentLocale())}
        </p>
      ))}
    </>
  );
}
function Kanban() {
  const [j, setJ] = useState<any[]>([]);
  useEffect(() => {
    api("/jobs?pageSize=200").then(setJ);
  }, []);
  return (
    <>
      <h1>{tt("workflowTitle")}</h1>
      <p>{tt("workflowHelp")}</p>
      <div className="kanban">
        {statuses.map((s) => (
          <div key={s}>
            <h3>{statusLabel(s)}</h3>
            {j
              .filter((x) => x.status === s)
              .map((x) => (
                <Link key={x.id} className="card" to={`/jobs/${x.id}`}>
                  <b>{x.jobCode}</b>
                  <span>
                    {x.patient.firstName} {x.patient.lastName}
                  </span>
                </Link>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
function Clinics() {
  const [c, setC] = useState<any[]>([]),
    [s, setS] = useState<string[]>([]),
    [name, setName] = useState(""),
    [code, setCode] = useState(""),
    [phone, setPhone] = useState(""),
    [address, setAddress] = useState(""),
    [notes, setNotes] = useState(""),
    [isActive, setIsActive] = useState(true),
    [editingId, setEditingId] = useState<number | null>(null),
    [msg, setMsg] = useState(""),
    [err, setErr] = useState("");
  const load = () =>
    api("/clinics")
      .then(setC)
      .catch((x: any) => setErr(x.message));
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (name.trim().length < 2) {
      setS([]);
      return;
    }
    const timer = setTimeout(
      () =>
        api(`/clinics/suggestions?name=${encodeURIComponent(name)}`)
          .then((x: string[]) => {
            setS(x);
            if (!code && x.length) setCode(x[0]);
          })
          .catch((x: any) => setErr(x.message)),
      350,
    );
    return () => clearTimeout(timer);
  }, [name]);
  async function submit(e: any) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      const created = await api(
        editingId ? `/clinics/${editingId}` : "/clinics",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify({
            name,
            shortCode: code.trim().toUpperCase(),
            phone: phone || null,
            address: address || null,
            notes: notes || null,
            isActive,
          }),
        },
      );
      setMsg(
        `${created.name} kliniği başarıyla ${editingId ? "güncellendi" : "eklendi"}.`,
      );
      setName("");
      setCode("");
      setPhone("");
      setAddress("");
      setNotes("");
      setIsActive(true);
      setEditingId(null);
      setS([]);
      await load();
    } catch (x: any) {
      setErr(x.message || "Klinik eklenemedi.");
    }
  }
  return (
    <>
      <h1>{tt("clinics")}</h1>
      <p>{tt("clinicHelp")}</p>
      <form className="card form" onSubmit={submit}>
        <label>
          {tt("clinicName")} *
          <input
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editingId) setCode("");
            }}
            placeholder="Örn. Dental Park"
          />
        </label>
        <label>
          {tt("shortCode")} *
          <input
            name="shortCode"
            required
            disabled={editingId !== null}
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 4),
              )
            }
            pattern="[A-Z0-9]{3,4}"
            placeholder="Örn. DPK"
          />
          <small>{tt("shortCodeHelp")}</small>
        </label>
        {s.length > 0 && (
          <div>
            <small>{tt("alternatives")}</small>
            <div className="suggestions">
              {s.map((x) => (
                <button type="button" key={x} onClick={() => setCode(x)}>
                  {x}
                </button>
              ))}
            </div>
          </div>
        )}
        <label>
          {tt("phone")} — {tt("optional")}
          <input
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={tt("phone")}
          />
        </label>
        <label>
          {tt("address")} — {tt("optional")}
          <textarea
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={tt("clinicAddress")}
          />
        </label>
        <label>
          {tt("clinicNotes")} — {tt("optional")}
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={tt("clinicNotesPlaceholder")}
          />
        </label>
        {editingId && (
          <label className="check">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            {tt("active")}
          </label>
        )}
        <div className="actions">
          <button type="submit">
            {editingId ? tt("save") : tt("addClinic")}
          </button>
          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setEditingId(null);
                setName("");
                setCode("");
                setPhone("");
                setAddress("");
                setNotes("");
                setIsActive(true);
              }}
            >
              {tt("cancel")}
            </button>
          )}
        </div>
        {msg && <p className="success">{msg}</p>}
        {err && <p className="error">{err}</p>}
      </form>
      <table>
        <thead>
          <tr>
            <th>{tt("code")}</th>
            <th>{tt("clinic")}</th>
            <th>{tt("phone")}</th>
            <th>{tt("notes")}</th>
            <th>{tt("status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {c.map((x) => (
            <tr key={x.id}>
              <td>
                <b>{x.shortCode}</b>
              </td>
              <td>{x.name}</td>
              <td>{x.phone || "—"}</td>
              <td>{x.notes || "—"}</td>
              <td>{x.isActive ? "Aktif" : "Pasif"}</td>
              <td>
                <button
                  className="secondary"
                  onClick={() => {
                    setEditingId(x.id);
                    setName(x.name);
                    setCode(x.shortCode);
                    setPhone(x.phone || "");
                    setAddress(x.address || "");
                    setNotes(x.notes || "");
                    setIsActive(x.isActive);
                    setMsg("");
                    setErr("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {tt("edit")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
function Patients() {
  const [x, setX] = useState<any[]>([]),
    [q, setQ] = useState("");
  const load = () =>
    api(`/patients${q ? `?q=${encodeURIComponent(q)}` : ""}`).then(setX);
  useEffect(() => {
    void load();
  }, []);
  return (
    <>
      <h1>{tt("patients")}</h1>
      <div className="inline">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder={tt("patientSearchPlaceholder")}
        />
        <button onClick={load}>{tt("search")}</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>{tt("code")}</th>
            <th>{tt("patient")}</th>
            <th>{tt("clinic")}</th>
          </tr>
        </thead>
        <tbody>
          {x.map((p) => (
            <tr key={p.id}>
              <td>
                <Link to={`/patients/${p.id}`}>{p.patientCode}</Link>
              </td>
              <td>
                {p.firstName} {p.lastName}
              </td>
              <td>{p.clinic?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
function PatientDetail() {
  const { id } = useParams(),
    [p, setP] = useState<any>();
  useEffect(() => {
    api(`/patients/${id}`).then(setP);
  }, [id]);
  if (!p) return <p>{tt("loading")}</p>;
  return (
    <>
      <header>
        <div>
          <h1>
            {p.firstName} {p.lastName}
          </h1>
          <p>
            {p.patientCode} · {p.clinic.name}
          </p>
        </div>
        <Link className="button" to="/new">
          Bu hastaya yeni iş
        </Link>
      </header>
      <h2>{tt("allJobs")}</h2>
      {p.jobs.map((j: any) => (
        <div className="card patient-job" key={j.id}>
          <Link to={`/jobs/${j.id}`}>
            <b>
              {j.jobCode} · {j.jobType}
            </b>
          </Link>
          <span>
            {j.material} · {j.shade} · {statusLabel(j.status)}
          </span>
          <div className="mini-timeline">
            {j.activities?.map((a: any) => (
              <small key={a.id}>
                {new Date(a.createdAt).toLocaleDateString(currentLocale())} —{" "}
                {a.stepType}
                {a.description ? `: ${a.description}` : ""}
              </small>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
function GalleryPhoto({ photo, onOpen }: { photo: any; onOpen: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <button className="photo-open" onClick={onOpen}>
      {broken ? (
        <span className="photo-fallback" aria-label={tt("photoUnavailable")}>
          <b>⌁</b>
          <small>{tt("photoUnavailable")}</small>
        </span>
      ) : (
        <img
          loading="lazy"
          src={`${location.origin}/uploads/${photo.thumbnailStoredFileName || photo.storedFileName}`}
          alt={`${photo.jobCode} ${categoryLabel(photo.category)}`}
          onError={() => setBroken(true)}
        />
      )}
    </button>
  );
}

function Gallery() {
  const [photos, setPhotos] = useState<any[]>([]),
    [q, setQ] = useState(""),
    [category, setCategory] = useState(""),
    [page, setPage] = useState(1),
    [hasMore, setHasMore] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [selected, setSelected] = useState<any>();
  const load = async (reset = false, pageOverride?: number) => {
    setLoading(true);
    setError("");
    try {
      const target = reset ? 1 : (pageOverride ?? page);
      const result = await api(
        `/photos?page=${target}&pageSize=60${q ? `&q=${encodeURIComponent(q)}` : ""}${category ? `&category=${category}` : ""}`,
      );
      setPhotos((items) => (reset ? result : [...items, ...result]));
      setHasMore(result.length === 60);
      if (reset) setPage(1);
    } catch (x: any) {
      setError(x.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(true);
  }, [category]);
  async function changeCategory(photo: any, value: string) {
    try {
      await api(`/photos/${photo.id}/category`, {
        method: "PATCH",
        body: JSON.stringify({ category: value }),
      });
      setPhotos((items) =>
        items.map((x) => (x.id === photo.id ? { ...x, category: value } : x)),
      );
    } catch (x: any) {
      setError(x.message);
    }
  }
  async function remove(photo: any) {
    if (!window.confirm(`${photo.jobCode} — ${tt("deletePhotoConfirm")}`)) return;
    try {
      await api(`/photos/${photo.id}`, { method: "DELETE" });
      setPhotos((items) => items.filter((x) => x.id !== photo.id));
      setSelected(undefined);
    } catch (x: any) {
      setError(x.message);
    }
  }
  return (
    <>
      <header>
        <div>
          <h1>{tt("photos")}</h1>
          <p>{tt("galleryHelp")}</p>
        </div>
      </header>
      <div className="card gallery-toolbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void load(true);
          }}
          placeholder={tt("gallerySearch")}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">{tt("allCategories")}</option>
          {photoCategories.map((x) => (
            <option key={x} value={x}>
              {categoryLabel(x)}
            </option>
          ))}
        </select>
        <button onClick={() => load(true)}>{tt("search")}</button>
      </div>
      {error && (
        <p className="error card">
          {error} <button onClick={() => load(true)}>{tt("retry")}</button>
        </p>
      )}
      {!loading && !photos.length && (
        <div className="card empty-state">
          <b>{tt("noPhotos")}</b>
          <span>{tt("noPhotosHelp")}</span>
        </div>
      )}
      <div className="photo-gallery">
        {photos.map((photo) => (
          <article className="card photo-card" key={photo.id}>
            <GalleryPhoto photo={photo} onOpen={() => setSelected(photo)} />
            <div className="photo-meta">
              <Link to={`/jobs/${photo.jobId}`}>
                <b>{photo.jobCode}</b>
              </Link>
              <span>
                {photo.patientName} · {photo.clinicName}
              </span>
              <small>
                {new Date(photo.uploadedAt).toLocaleString(currentLocale())}
                {photo.uploadedViaQr ? " · QR" : ""}
              </small>
              <select
                value={photo.category}
                onChange={(e) => changeCategory(photo, e.target.value)}
              >
                {photoCategories.map((x) => (
                  <option key={x} value={x}>
                    {categoryLabel(x)}
                  </option>
                ))}
              </select>
              <button className="danger" onClick={() => remove(photo)}>
                {tt("deletePhoto")}
              </button>
            </div>
          </article>
        ))}
      </div>
      {loading && <p>{tt("loading")}</p>}
      {!loading && hasMore && (
        <button
          className="load-more"
          onClick={() => {
            const next = page + 1;
            setPage(next);
            void load(false, next);
          }}
        >
          {tt("loadMore")}
        </button>
      )}
      {selected && (
        <div
          className="lightbox"
          role="dialog"
          onClick={() => setSelected(undefined)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelected(undefined)}
            >
              ×
            </button>
            <img
              src={`${location.origin}/uploads/${selected.storedFileName}`}
              alt={selected.jobCode}
            />
            <p>
              <b>{selected.jobCode}</b> · {selected.patientName} ·{" "}
              {categoryLabel(selected.category)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
function Users() {
  const empty = {
    id: 0,
    username: "",
    password: "",
    role: "Employee",
    isActive: true,
  };
  const [users, setUsers] = useState<any[]>([]),
    [model, setModel] = useState<any>(empty),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const load = () =>
    api("/users")
      .then(setUsers)
      .catch((x) => setError(x.message));
  useEffect(() => {
    void load();
  }, []);
  const roleText = (role: string) =>
    tt(
      role === "Admin"
        ? "roleAdmin"
        : role === "Viewer"
          ? "roleViewer"
          : "roleEmployee",
    );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api(model.id ? `/users/${model.id}` : "/users", {
        method: model.id ? "PUT" : "POST",
        body: JSON.stringify({
          username: model.username,
          password: model.password || null,
          role: model.role,
          isActive: model.isActive,
        }),
      });
      setModel(empty);
      setMessage(tt("userSaved"));
      await load();
    } catch (x: any) {
      setError(x.message);
    }
  }

  return (
    <>
      <h1>{tt("usersTitle")}</h1>
      <form className="card form user-form" onSubmit={submit}>
        <h2>{model.id ? tt("edit") : tt("addUser")}</h2>
        <div className="grid2">
          <label>
            {tt("username")}
            <input
              required
              minLength={3}
              maxLength={50}
              value={model.username}
              onChange={(e) => setModel({ ...model, username: e.target.value })}
            />
          </label>
          <label>
            {model.id ? tt("newPassword") : tt("password")}
            <input
              type="password"
              required={!model.id}
              minLength={8}
              value={model.password}
              onChange={(e) => setModel({ ...model, password: e.target.value })}
            />
          </label>
          <label>
            {tt("role")}
            <select
              value={model.role}
              onChange={(e) => setModel({ ...model, role: e.target.value })}
            >
              <option value="Admin">{tt("roleAdmin")}</option>
              <option value="Employee">{tt("roleEmployee")}</option>
              <option value="Viewer">{tt("roleViewer")}</option>
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={model.isActive}
              onChange={(e) =>
                setModel({ ...model, isActive: e.target.checked })
              }
            />{" "}
            {tt("active")}
          </label>
        </div>
        <div className="inline actions">
          <button>{tt("save")}</button>
          {model.id > 0 && (
            <button
              type="button"
              className="secondary"
              onClick={() => setModel(empty)}
            >
              {tt("cancel")}
            </button>
          )}
        </div>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
      <table>
        <thead>
          <tr>
            <th>{tt("username")}</th>
            <th>{tt("role")}</th>
            <th>{tt("status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <b>{user.username}</b>
              </td>
              <td>{roleText(user.role)}</td>
              <td>
                <span className={`pill ${user.isActive ? "" : "passive"}`}>
                  {user.isActive ? tt("active") : tt("passive")}
                </span>
              </td>
              <td>
                <button
                  className="secondary"
                  onClick={() => {
                    setMessage("");
                    setError("");
                    setModel({ ...user, password: "" });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {tt("edit")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
function Settings() {
  const [publicBaseUrl, setPublicBaseUrl] = useState("http://lab.local:5080"),
    [printers, setPrinters] = useState<string[]>([]),
    [defaultPrinter, setDefaultPrinter] = useState(""),
    [language, setLanguage] = useState<Language>(currentLanguage()),
    [theme, setTheme] = useState(localStorage.getItem("theme") || "light"),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/settings"), api("/settings/printers")])
      .then(([settings, installedPrinters]) => {
        const baseUrl = settings.find(
          (x: any) => x.key === "PublicBaseUrl",
        )?.value;
        const savedPrinter = settings.find(
          (x: any) => x.key === "DefaultPrinter",
        )?.value;
        if (baseUrl) setPublicBaseUrl(baseUrl);
        setPrinters(installedPrinters);
        setDefaultPrinter(savedPrinter || "");
      })
      .catch((x) => setError(x.message));
  }, []);

  async function saveSettings() {
    setMessage("");
    setError("");
    try {
      await Promise.all([
        api("/settings/PublicBaseUrl", {
          method: "PUT",
          body: JSON.stringify({ value: publicBaseUrl }),
        }),
        api("/settings/DefaultPrinter", {
          method: "PUT",
          body: JSON.stringify({ value: defaultPrinter }),
        }),
      ]);
      setMessage("Ayarlar kaydedildi.");
    } catch (x: any) {
      setError(x.message);
    }
  }
  async function createBackup() {
    setMessage("");
    setError("");
    try {
      const result = await api("/settings/backup", { method: "POST" });
      setMessage(`${result.message} ${result.folder}\\${result.fileName}`);
    } catch (x: any) {
      setError(x.message);
    }
  }

  return (
    <>
      <h1>{tt("settingsTitle")}</h1>
      <div className="card form">
        <div className="grid2">
          <label>
            {tt("language")}
            <select
              value={language}
              onChange={(e) => {
                const value = e.target.value as Language;
                localStorage.setItem("language", value);
                setLanguage(value);
                window.location.reload();
              }}
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
          <label>
            {tt("appearance")}
            <select
              value={theme}
              onChange={(e) => {
                const value = e.target.value;
                localStorage.setItem("theme", value);
                document.documentElement.dataset.theme = value;
                setTheme(value);
              }}
            >
              <option value="light">{tt("light")}</option>
              <option value="dark">{tt("dark")}</option>
            </select>
          </label>
        </div>
        <label>
          {tt("qrBaseUrl")}
          <input
            value={publicBaseUrl}
            onChange={(e) => setPublicBaseUrl(e.target.value)}
          />
        </label>
        <label>
          {tt("defaultPrinter")}
          <select
            value={defaultPrinter}
            onChange={(e) => setDefaultPrinter(e.target.value)}
          >
            <option value="">{tt("selectPrinter")}</option>
            {printers.map((printer) => (
              <option key={printer} value={printer}>
                {printer}
              </option>
            ))}
          </select>
        </label>
        {!printers.length && <p className="error">{tt("printerMissing")}</p>}
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button onClick={saveSettings}>{tt("save")}</button>
          <button className="secondary" onClick={createBackup}>
            {tt("backupNow")}
          </button>
        </div>
        <p>{tt("printHelp")}</p>
        <p>{tt("qrHelp")}</p>
      </div>
      <QuickCatalog />
    </>
  );
}

function Label() {
  const { id } = useParams(),
    [label, setLabel] = useState<any>(),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");

  useEffect(() => {
    api(`/jobs/${id}/label`)
      .then(setLabel)
      .catch((x) => setError(x.message));
  }, [id]);

  async function printLabel() {
    setMessage("");
    setError("");
    try {
      const result = await api(`/jobs/${id}/print`, { method: "POST" });
      setMessage(`${result.message} ${result.printer || ""}`.trim());
    } catch (x: any) {
      setError(x.message);
    }
  }

  if (!label) return error ? <p className="error">{error}</p> : null;
  const job = label.job;
  return (
    <>
      <button className="no-print" onClick={printLabel}>
        {tt("directPrint")}
      </button>
      {message && <p className="success no-print">{message}</p>}
      {error && <p className="error no-print">{error}</p>}
      <div className="label">
        <div>
          <small>{job.clinic.name}</small>
          <h1>{job.jobCode}</h1>
          <b>
            {job.patient.firstName} {job.patient.lastName}
          </b>
          <p>
            {job.jobType} · {job.material} · {job.shade}
            <br />
            Diş: {job.teeth} · {job.unitCount} üye
            <br />
            Teslim: {job.dueDate?.slice(0, 10)}
          </p>
          <img
            className="barcode"
            src={label.barcodeData}
            alt={`Code 128 ${job.jobCode}`}
          />
        </div>
        <img className="qr" src={label.qrData} alt={`QR ${job.jobCode}`} />
      </div>
    </>
  );
}

function PublicJob() {
  const { token } = useParams(),
    [j, setJ] = useState<any>(),
    [e, setE] = useState(""),
    [actionError, setActionError] = useState(""),
    [uploadProgress, setUploadProgress] = useState(0);
  const load = () =>
    api(`/public/jobs/${token}`)
      .then(setJ)
      .catch((x) => setE(x.message));
  useEffect(() => {
    void load();
  }, [token]);
  if (e)
    return (
      <main className="public">
        <h1>{e}</h1>
      </main>
    );
  if (!j) return null;
  async function send(ev: any, type: string) {
    ev.preventDefault();
    const formEl = ev.currentTarget as HTMLFormElement;
    setActionError("");
    try {
      if (type === "photos") {
        setUploadProgress(1);
        await uploadApi(
          `/public/jobs/${token}/photos`,
          new FormData(formEl),
          setUploadProgress,
        );
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 700);
      } else {
        await api(`/public/jobs/${token}/notes`, {
          method: "POST",
          body: JSON.stringify({ text: new FormData(formEl).get("text") }),
        });
      }
      formEl.reset();
      await load();
    } catch (x: any) {
      setActionError(x.message);
      setUploadProgress(0);
    }
  }
  return (
    <main className="public">
      <h1>{j.jobCode}</h1>
      <div className="card detail">
        <b>
          {j.patient.firstName} {j.patient.lastName}
        </b>
        <span>{j.clinic.name}</span>
        <span>
          {j.jobType} · {j.material} · {j.shade}
        </span>
        <span>
          Diş {j.teeth} · {j.unitCount} üye
        </span>
        <strong>{statusLabel(j.status)}</strong>
      </div>
      <h2>{tt("photoAdd")}</h2>
      <form onSubmit={(e) => send(e, "photos")}>
        <input
          name="files"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          multiple
          required
        />
        <select name="category">
          {photoCategories.map((x) => (
            <option key={x} value={x}>
              {categoryLabel(x)}
            </option>
          ))}
        </select>
        <button disabled={uploadProgress > 0 && uploadProgress < 100}>
          {tt("upload")}
        </button>
      </form>
      {uploadProgress > 0 && (
        <div className="upload-progress">
          <div style={{ width: `${uploadProgress}%` }} />
          <span>%{uploadProgress}</span>
        </div>
      )}
      {actionError && <p className="error">{actionError}</p>}
      <h2>{tt("addNote")}</h2>
      <form onSubmit={(e) => send(e, "notes")}>
        <textarea name="text" required />
        <button>{tt("send")}</button>
      </form>
    </main>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/j/:token" element={<PublicJob />} />
        <Route
          path="/*"
          element={auth() ? <Layout /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
