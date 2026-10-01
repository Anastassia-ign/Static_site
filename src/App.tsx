import { useMemo, useRef, useState } from "react";

type IconName = "calendar" | "chevron" | "plus" | "columns" | "download" | "search" | "filter" | "sort" | "external" | "first" | "prev" | "next" | "last" | "chart" | "check" | "cancel" | "trash";

function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  const svg: Record<IconName, React.ReactNode> = {
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    columns: <><rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></>,
    download: <><path d="M12 3v11M8 10l4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 4 4"/></>,
    filter: <path d="M4 5h16l-6.3 7v5.1l-3.4 1.8V12L4 5Z"/>,
    sort: <><path d="m12 6 3 3H9l3-3ZM12 18l-3-3h6l-3 3Z"/></>,
    external: <><path d="M14 5h5v5M19 5l-8 8"/><path d="M17 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4"/></>,
    first: <><path d="m13 7-5 5 5 5M18 7l-5 5 5 5"/></>, prev: <path d="m15 7-5 5 5 5"/>, next: <path d="m9 7 5 5-5 5"/>, last: <><path d="m11 7 5 5-5 5M6 7l5 5-5 5"/></>,
    chart: <><path d="M4 19V5M4 19h16"/><path d="m7 14 3-3 3 2 4-5"/></>,
    check: <path d="m5 12 4.2 4.2L19 6.5"/>,
    cancel: <><circle cx="12" cy="12" r="8.5"/><path d="m8.5 8.5 7 7m0-7-7 7"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{svg[name]}</svg>;
}

const rows = [
  ["odaronnaya-lordfilm.ru", "29", "446", "1 537,93", "13,79", "212,12", "6,15", "3,22"],
  ["shreekkk-lordfilms.ru", "60", "490", "816,67", "13,87", "113,24", "6,79", "3,31"],
  ["vetrenyy-holm-turktv.ru", "132", "1 193", "903,79", "14,19", "128,26", "16,93", "8,15"],
  ["turkish-tv-series.tv preroll RU", "4", "0", "0,00", "0,00", "0,00", "0,00", "0,00"],
  ["kiberpank-jutsu.ru", "5", "0", "0,00", "0,00", "0,00", "0,00", "0,00"],
  ["ironman-lordfilm.ru", "2", "85", "4 250,00", "11,43", "485,63", "0,97", "0,28"],
  ["foto-recipes.ru", "2", "0", "0,00", "0,00", "0,00", "0,00", "0,00"],
  ["portalonline.ru", "478", "155", "32,43", "12,22", "3,96", "1,89", "0,70"],
];

const dataGroups = ["Показатели", "Таргетинг", "Финансы", "Default", "ГЕО", "Страны", "Категории", "Сегменты", "Домены", "Рекламные кампании", "Рекламные объявления", "Тип JS запросов", "Тип трафика", "Менеджеры", "Компании", "Вебмастера"];
const dataOptions: Record<string, Record<string, string[]>> = {
  "Показатели": { "Основные": ["JS Запросы", "Показы (web)", "Клики (web)", "Fill Rate (web)", "Конверсия", "CTR (web)", "Видимость (web)", "Досмотры (web)"], "Денежное": ["CPM (web)", "eCPM (web)"] },
  "Default": { "Основные": ["Показы (all)", "Показы (def)", "Def %", "Клики (all)", "Fill Rate (all)"], "Конверсия": ["CTR (all)", "Видимость (all)", "Досмотры (all)"], "Денежное": ["CPM (all)", "eCPM (all)"] },
  "Таргетинг": { "Группировка": ["Платформы", "Форматы", "ОС", "Браузеры"] },
  "Тип трафика": { "Группировка": ["Black", "White", "N/A"] },
  "Финансы": { "Показатели": ["Выбрать все", "Доход мастера", "Доход от WEB", "Рефералы", "Акции", "Договор", "Доход системы", "Доход Default"] },
};

function DropButton({ children }: { children: React.ReactNode }) { return <button className="filter-btn">{children}<Icon name="chevron" size={14}/></button>; }
function ColumnTitle({ children, onFilter }: { children: React.ReactNode; onFilter: () => void }) { return <span className="column-title"><button className="column-filter-button" onClick={(event) => { event.stopPropagation(); onFilter(); }} aria-label={`Фильтр: ${children}`}><Icon name="filter" size={15}/></button><span>{children}</span><Icon name="sort" size={13}/></span>; }
const modalGroupingCatalog: Record<string, string[]> = {
  "Дата": ["По дням", "По неделям", "По месяцам", "По годам"],
  "География": ["По GEO", "По странам"],
  "Трафик": ["Тип трафика", "Категории", "Сегменты"],
  "Технологии": ["Платформа", "Браузеры", "ОС"],
  "Форматы": ["Autoplay", "Banner", "Fullscreen", "Preroll", "Preloader"],
  "Реклама": ["Рекламные кампании", "Рекламные объявления"],
};
const trafficDetailCatalog: Record<string, string[]> = {
  "Тип трафика": ["Black", "White", "N/A"],
  "Платформа": ["Desktop", "Mobile", "Tablet", "Smart TV", "Console"],
  "Браузеры": ["Google Chrome", "Safari", "Microsoft Edge", "Mozilla Firefox", "Samsung Internet", "Opera", "Яндекс Браузер"],
  "ОС": ["Windows", "Android", "iOS", "macOS", "Linux", "ChromeOS"],
};

const siteCategories = ["Авто и мото", "Бизнес и финансы", "Дом и сад", "Еда и напитки", "Здоровье и красота", "Игры", "Кино и сериалы", "Компьютеры и электроника", "Музыка", "Наука и образование", "Недвижимость", "Новости и медиа", "Покупки", "Путешествия", "Спорт", "Юмор и развлечения"];
const siteSegments = ["Аниме", "Букмекеры", "Видеохостинги", "Детские товары", "Доставка еды", "Интернет-магазины", "Киберспорт", "Красота и уход", "Криптовалюты", "Личные блоги", "Мобильные игры", "Онлайн-кинотеатры", "Ремонт и строительство", "Социальные сети", "Стриминговые сервисы", "Туризм по России"];

const campaignThemes = ["CineNova", "MovieGo", "StreamBox", "PrimeVideo", "SeriesHub", "KinoLine", "MangoPlay", "VideoMix"];
const advertisingCampaigns = Array.from({ length: 40 }, (_, index) => `Campaign ${String(index + 1).padStart(2, "0")} · ${campaignThemes[index % campaignThemes.length]}`);
const advertisingCreatives = Array.from({ length: 50 }, (_, index) => `creative_${String(index + 1).padStart(3, "0")} · ${campaignThemes[(index * 3) % campaignThemes.length]}`);

const domainPrefixes = ["kino", "film", "video", "stream", "media", "series", "play", "online", "portal", "watch"];
const domainZones = ["ru", "com", "net", "tv", "site"];
const reportDomains = Array.from({ length: 100 }, (_, index) => `${domainPrefixes[index % domainPrefixes.length]}-${String(index + 1).padStart(3, "0")}.${domainZones[index % domainZones.length]}`);
const sourceDomains = Array.from({ length: 130 }, (_, index) => `src-${String(index + 1).padStart(3, "0")}.adtech-${["edge", "cdn", "media", "track", "supply"][index % 5]}.internal`);
const reportDates = ["20.08.2026", "19.08.2026", "18.08.2026", "17.08.2026"];
const reportFormats = ["Banner · 300 × 250", "Banner · 728 × 90", "Preroll · 640 × 360", "Fullscreen · 320 × 480", "Native · 300 × 100", "Preloader · 640 × 360", "Banner · 160 × 600", "Video · 1280 × 720"];

const groupingExamples: Record<string, string[]> = {
  "По дням": ["20 авг 2026", "19 авг 2026", "18 авг 2026", "17 авг 2026", "16 авг 2026", "15 авг 2026", "14 авг 2026", "13 авг 2026"],
  "По неделям": ["17–23 авг 2026", "10–16 авг 2026", "03–09 авг 2026"],
  "По месяцам": ["Август 2026", "Июль 2026", "Июнь 2026"],
  "По годам": ["2026", "2025", "2024"],
  "По GEO": ["RU", "KZ", "BY", "DE", "US"],
  "По странам": ["Россия", "Казахстан", "Беларусь", "Германия", "США"],
  "Тип трафика": ["White", "Black", "N/A"],
  "Платформа": ["Desktop", "Mobile", "Tablet"],
  "Браузеры": ["Google Chrome", "Safari", "Microsoft Edge", "Mozilla Firefox"],
  "ОС": ["Windows", "Android", "iOS", "macOS"],
  "Категории": siteCategories,
  "Сегменты": siteSegments,
  "Название блока": ["Баннер 300×250", "Преролл", "Видеоблок", "Fullscreen", "Нативный блок"],
  "Autoplay": ["Autoplay"],
  "Banner": ["Banner"],
  "Fullscreen": ["Fullscreen"],
  "Preroll": ["Preroll"],
  "Preloader": ["Preloader"],
};

function seededValue(seed: number) {
  const value = Math.sin(seed * 999) * 10000;
  return value - Math.floor(value);
}

function mockMetricValue(label: string, seed: number, multiplier = 1) {
  const value = seededValue(seed + label.length);
  if (/(CTR|Rate|Видимость|Конверсия|Досмотры|Def %)/i.test(label)) return `${(value * 48.5 + 0.5).toFixed(2).replace(".", ",")}%`;
  if (/(CPM|Доход|eCPM)/i.test(label)) return `${((value * 4800 + 120) * multiplier).toFixed(2).replace(".", ",")}`;
  return Math.round((value * 420000 + 800) * multiplier).toLocaleString("ru-RU");
}

const databaseMetricLabels = Array.from(new Set(Object.values(dataOptions).flatMap((groups) => Object.values(groups).flat()).filter((label) => label !== "Выбрать все")));
const databaseFormats = reportFormats.map((value) => ({ format: value.split(" · ")[0], size: value.split(" · ")[1] ?? "—" }));
const databaseDomains = [...reportDomains, ...sourceDomains];
const reportDatabase = databaseDomains.flatMap((domain, domainIndex) => reportDates.flatMap((date, dateIndex) => databaseFormats.map((placement, formatIndex) => ({
  id: `${domain}-${date}-${placement.format}-${placement.size}`,
  domain,
  date,
  geo: ["RU", "KZ", "BY", "DE", "US"][domainIndex % 5],
  country: ["Россия", "Казахстан", "Беларусь", "Германия", "США"][domainIndex % 5],
  format: placement.format,
  formatSize: placement.size,
  metrics: Object.fromEntries(databaseMetricLabels.map((label, metricIndex) => [label, mockMetricValue(label, (domainIndex + 1) * (dateIndex + 2) * (formatIndex + 3) * (metricIndex + 2))])),
}))));

const modalMetricCatalog: Record<string, { label: string; category: string; branch: string; options: string[] }[]> = {
  "Основное": [
    { label: "Основные", category: "Показатели", branch: "Основные", options: ["JS Запросы", "Показы (web)", "Клики (web)", "Fill Rate (web)"] },
    { label: "Конверсия", category: "Показатели", branch: "Основные", options: ["Конверсия", "CTR (web)", "Видимость (web)", "Досмотры (web)"] },
    { label: "Денежное", category: "Показатели", branch: "Денежное", options: ["CPM (web)", "eCPM (web)"] },
  ],
  "Финансы": [
    { label: "Доход системы", category: "Финансы", branch: "Показатели", options: ["Доход системы", "Доход Default", "Доход от WEB"] },
    { label: "Расход системы", category: "Финансы", branch: "Показатели", options: ["Доход мастера", "Рефералы", "Договор", "Акции"] },
  ],
  "Default": [
    { label: "Основные", category: "Default", branch: "Основные", options: ["Показы (all)", "Показы (def)", "Def %", "Клики (all)", "Fill Rate (all)"] },
    { label: "Конверсия", category: "Default", branch: "Конверсия", options: ["CTR (all)", "Видимость (all)", "Досмотры (all)"] },
    { label: "Денежное", category: "Default", branch: "Денежное", options: ["CPM (all)", "eCPM (all)"] },
  ],
};

export default function App() {
  const [search, setSearch] = useState("");
  const [columnWidths, setColumnWidths] = useState<number[]>([280, 145, 90, 140, 190, 145, 165, 165, 165, 165, 165, 165]);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const resizeRef = useRef<{ index: number; startX: number; startWidth: number } | null>(null);
  const [activeColumnFilter, setActiveColumnFilter] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [pageSize, setPageSize] = useState("25");
  const [activeDatePreset, setActiveDatePreset] = useState("Сегодня");
  const [dateRange, setDateRange] = useState({ from: "2026-08-20", to: "2026-08-20" });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [configExpanded, setConfigExpanded] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"Группировки" | "Метрики" | "Домены">("Группировки");
  const [modalCategory, setModalCategory] = useState("Дата");
  const [combineGroupingData, setCombineGroupingData] = useState(false);
  const [geoGroups, setGeoGroups] = useState(["RU"]);
  const [geoCountries, setGeoCountries] = useState<string[]>([]);
  const [countryQuery, setCountryQuery] = useState("");
  const [sngExpanded, setSngExpanded] = useState(true);
  const [geoDetailMode, setGeoDetailMode] = useState<"geo" | "countries" | null>(null);
  const [trafficDetailMode, setTrafficDetailMode] = useState<string | null>(null);
  const [trafficValues, setTrafficValues] = useState<Record<string, string[]>>({});
  const [technologyDetailMode, setTechnologyDetailMode] = useState<string | null>(null);
  const [technologyValues, setTechnologyValues] = useState<Record<string, string[]>>({});
  const [siteCategoryQuery, setSiteCategoryQuery] = useState("");
  const [siteSegmentQuery, setSiteSegmentQuery] = useState("");
  const [selectedSiteCategories, setSelectedSiteCategories] = useState<string[]>([]);
  const [selectedSiteSegments, setSelectedSiteSegments] = useState<string[]>([]);
  const [advertisingDetailMode, setAdvertisingDetailMode] = useState<"campaigns" | "creatives" | null>(null);
  const [campaignQuery, setCampaignQuery] = useState("");
  const [creativeQuery, setCreativeQuery] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([]);
  const [domainQuery, setDomainQuery] = useState("");
  const [sourceQuery, setSourceQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [dataGroup, setDataGroup] = useState("Показатели");
  const [treeOpen, setTreeOpen] = useState(false);
  const [groupings, setGroupings] = useState(["По дням", "По странам"]);
  const [filters, setFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>(["Показатели", "Финансы"]);
  const [selectedItems, setSelectedItems] = useState([
    { category: "Показатели", branch: "Основные", label: "JS Запросы" },
    { category: "Показатели", branch: "Основные", label: "Показы (web)" },
    { category: "Показатели", branch: "Основные", label: "Клики (web)" },
    { category: "Показатели", branch: "Денежное", label: "CPM (web)" },
    { category: "Показатели", branch: "Денежное", label: "eCPM (web)" },
    { category: "Финансы", branch: "Показатели", label: "Доход мастера" },
    { category: "Финансы", branch: "Показатели", label: "Доход системы" },
  ]);
  const [builtConfig, setBuiltConfig] = useState({
    domains: [] as string[],
    sources: [] as string[],
    combineDomains: false,
    metricLabels: selectedItems.map((item) => item.label),
  });
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; isDefault: boolean; config: null | { groupings: string[]; items: typeof selectedItems; domains: string[]; sources: string[]; combineDomains: boolean; dateRange: typeof dateRange; datePreset: string; geoGroups: string[]; geoCountries: string[]; trafficValues: Record<string, string[]>; technologyValues: Record<string, string[]>; siteCategories: string[]; siteSegments: string[]; campaigns: string[]; creatives: string[] } }>>([{ id: "standard", name: "Стандартный", isDefault: true, config: null }]);
  const [activeTemplateId, setActiveTemplateId] = useState("standard");
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [templateEditorOpen, setTemplateEditorOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDefault, setTemplateDefault] = useState(false);
  const tableColumns = selectedItems.map((item) => item.label);
  const reportColumns = builtConfig.metricLabels;
  const reportRows = useMemo(() => {
    const selectedDomainNames = [...builtConfig.domains, ...builtConfig.sources];
    const domainsToShow = selectedDomainNames.length ? selectedDomainNames : reportDomains.slice(0, 4);
    const records = reportDatabase.filter((record) => domainsToShow.includes(record.domain));
    if (!builtConfig.combineDomains) return records.map((record) => ({ ...record, metricValues: reportColumns.map((label) => record.metrics[label] ?? "—") }));
    const grouped = new Map<string, typeof records>();
    records.forEach((record) => {
      const key = `${record.date}|${record.geo}|${record.country}|${record.format}|${record.formatSize}`;
      grouped.set(key, [...(grouped.get(key) ?? []), record]);
    });
    return Array.from(grouped.values()).map((items) => ({
      ...items[0],
      id: `combined-${items[0].id}`,
      domain: "Все домены",
      metricValues: reportColumns.map((label) => {
        const values = items.map((item) => Number(String(item.metrics[label] ?? "0").replace(/[^0-9,]/g, "").replace(",", "."))).filter(Number.isFinite);
        const isRate = /(CTR|Rate|Видимость|Конверсия|Досмотры|Def %)/i.test(label);
        const aggregate = isRate ? values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1) : values.reduce((sum, value) => sum + value, 0);
        return isRate ? `${aggregate.toFixed(2).replace(".", ",")}%` : /(CPM|Доход|eCPM)/i.test(label) ? aggregate.toFixed(2).replace(".", ",") : Math.round(aggregate).toLocaleString("ru-RU");
      }),
    }));
  }, [builtConfig, reportColumns]);
  const filteredRows = useMemo(() => reportRows.filter((row) => `${row.domain} ${row.format}`.toLowerCase().includes(search.toLowerCase()) && (!columnFilters["ГЕО"] || row.geo.toLowerCase().includes(columnFilters["ГЕО"].toLowerCase())) && (!columnFilters["Страна"] || row.country.toLowerCase().includes(columnFilters["Страна"].toLowerCase())) && (!columnFilters["Формат"] || row.format.toLowerCase().includes(columnFilters["Формат"].toLowerCase())) && (!columnFilters["Размер"] || row.formatSize.toLowerCase().includes(columnFilters["Размер"].toLowerCase())) && reportColumns.every((label, index) => !columnFilters[label] || row.metricValues[index].toLowerCase().includes(columnFilters[label].toLowerCase()))), [search, reportRows, reportColumns, columnFilters]);
  const reportTotals = useMemo(() => reportColumns.map((label, index) => {
    const values = filteredRows.map((row) => Number(row.metricValues[index].replace(/[^0-9,]/g, "").replace(",", "."))).filter(Number.isFinite);
    if (!values.length) return "—";
    const isRate = /(CTR|Rate|Видимость|Конверсия|Досмотры|Def %)/i.test(label);
    const total = isRate ? values.reduce((sum, value) => sum + value, 0) / values.length : values.reduce((sum, value) => sum + value, 0);
    return isRate ? `${total.toFixed(2).replace(".", ",")}%` : /(CPM|Доход|eCPM)/i.test(label) ? total.toFixed(2).replace(".", ",") : Math.round(total).toLocaleString("ru-RU");
  }), [filteredRows, reportColumns]);
  const isSelected = (category: string, branch: string, label: string) => selectedItems.some((item) => item.category === category && item.branch === branch && item.label === label);
  const columnWidth = (index: number) => columnWidths[index] ?? (index === 0 ? 280 : index === 1 ? 145 : index === 2 ? 90 : index === 3 ? 140 : index === 4 ? 190 : index === 5 ? 145 : 165);
  const tableWidth = Math.max(1370, Array.from({ length: reportColumns.length + 6 }, (_, index) => columnWidth(index)).reduce((total, width) => total + width, 0));

  function startColumnResize(event: React.PointerEvent<HTMLButtonElement>, index: number) {
    event.preventDefault();
    event.stopPropagation();
    resizeRef.current = { index, startX: event.clientX, startWidth: columnWidth(index) };
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.classList.add("is-column-resizing");
    setResizingColumn(index);
  }

  function resizeColumn(event: React.PointerEvent<HTMLButtonElement>) {
    const resize = resizeRef.current;
    if (!resize) return;
    const minWidth = resize.index === 0 ? 220 : resize.index === 1 ? 120 : resize.index === 2 ? 75 : resize.index === 3 ? 110 : resize.index === 4 ? 150 : resize.index === 5 ? 120 : 120;
    const nextWidth = Math.max(minWidth, Math.min(560, resize.startWidth + event.clientX - resize.startX));
    setColumnWidths((widths) => widths.map((width, index) => index === resize.index ? nextWidth : width));
  }

  function finishColumnResize() {
    if (!resizeRef.current) return;
    resizeRef.current = null;
    document.body.classList.remove("is-column-resizing");
    setResizingColumn(null);
  }

  function saveTemplate() {
    const name = templateName.trim();
    if (!name) return;
    const id = `template-${Date.now()}`;
    const config = { groupings: [...groupings], items: selectedItems.map((item) => ({ ...item })), domains: [...selectedDomains], sources: [...selectedSources], combineDomains: combineGroupingData, dateRange: { ...dateRange }, datePreset: activeDatePreset, geoGroups: [...geoGroups], geoCountries: [...geoCountries], trafficValues: Object.fromEntries(Object.entries(trafficValues).map(([key, values]) => [key, [...values]])), technologyValues: Object.fromEntries(Object.entries(technologyValues).map(([key, values]) => [key, [...values]])), siteCategories: [...selectedSiteCategories], siteSegments: [...selectedSiteSegments], campaigns: [...selectedCampaigns], creatives: [...selectedCreatives] };
    setTemplates((items) => [...items.map((item) => ({ ...item, isDefault: templateDefault ? false : item.isDefault })), { id, name, isDefault: templateDefault, config }]);
    setActiveTemplateId(id);
    setTemplateEditorOpen(false);
    setTemplateName("");
    setTemplateDefault(false);
  }

  function applyTemplate(id: string) {
    const template = templates.find((item) => item.id === id);
    if (!template) return;
    setActiveTemplateId(id);
    setTemplateMenuOpen(false);
    if (!template.config) return;
    setGroupings([...template.config.groupings]);
    setSelectedItems(template.config.items.map((item) => ({ ...item })));
    setSelectedDomains([...template.config.domains]);
    setSelectedSources([...template.config.sources]);
    setCombineGroupingData(template.config.combineDomains);
    setDateRange({ ...template.config.dateRange });
    setActiveDatePreset(template.config.datePreset);
    setGeoGroups([...template.config.geoGroups]);
    setGeoCountries([...template.config.geoCountries]);
    setTrafficValues(Object.fromEntries(Object.entries(template.config.trafficValues).map(([key, values]) => [key, [...values]])));
    setTechnologyValues(Object.fromEntries(Object.entries(template.config.technologyValues).map(([key, values]) => [key, [...values]])));
    setSelectedSiteCategories([...template.config.siteCategories]);
    setSelectedSiteSegments([...template.config.siteSegments]);
    setSelectedCampaigns([...template.config.campaigns]);
    setSelectedCreatives([...template.config.creatives]);
    setBuiltConfig({ domains: [...template.config.domains], sources: [...template.config.sources], combineDomains: template.config.combineDomains, metricLabels: template.config.items.map((item) => item.label) });
  }

  function deleteActiveTemplate() {
    const template = templates.find((item) => item.id === activeTemplateId);
    if (!template || !template.config) return;
    const fallback = templates.find((item) => item.isDefault && item.id !== template.id) ?? templates.find((item) => item.id !== template.id);
    setTemplates((items) => items.filter((item) => item.id !== template.id));
    setActiveTemplateId(fallback?.id ?? "standard");
    setTemplateMenuOpen(false);
  }

  function buildReport() {
    setBuiltConfig({
      domains: [...selectedDomains],
      sources: [...selectedSources],
      combineDomains: combineGroupingData,
      metricLabels: [...tableColumns],
    });
    requestAnimationFrame(() => document.querySelector(".data-card")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function exportReportToExcel() {
    const header = ["Домен", "Дата", "ГЕО", "Страна", "Формат", "Размер", ...reportColumns];
    const values = filteredRows.map((row) => [row.domain, row.date, row.geo, row.country, row.format, row.formatSize, ...row.metricValues]);
    const workbook = [header, ...values].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join("\t")).join("\n");
    const file = new Blob([`\ufeff${workbook}`], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xls";
    link.click();
    URL.revokeObjectURL(url);
  }

  function toggleTreeBranch(category: string) {
    setExpanded((items) => items.includes(category) ? items.filter((item) => item !== category) : [...items, category]);
  }
  function toggleLeaf(category: string, branch: string, label: string) {
    setDataGroup(category);
    setSelectedItems((items) => isSelected(category, branch, label) ? items.filter((item) => !(item.category === category && item.branch === branch && item.label === label)) : [...items, { category, branch, label }]);
  }
  function toggleBranchSelection(category: string, branch: string, options: string[]) {
    const available = options.filter((item) => item !== "Выбрать все");
    const allSelected = available.every((option) => isSelected(category, branch, option));
    setDataGroup(category);
    setSelectedItems((items) => allSelected ? items.filter((item) => !(item.category === category && item.branch === branch && available.includes(item.label))) : [...items.filter((item) => !(item.category === category && item.branch === branch)), ...available.map((label) => ({ category, branch, label }))]);
  }

  return <main className="wm-page">
    <header className="page-header"><div><nav className="breadcrumbs"><span>Веб-мастера</span><i>/</i><span>warhouse@list.ru</span><i>/</i><span>Статистика</span></nav><h1>Статистика всех сайтов</h1></div><div className="header-actions"><div className="template-control"><button className="filter-btn template-trigger" onClick={() => setTemplateMenuOpen((value) => !value)}>Шаблон: {templates.find((item) => item.id === activeTemplateId)?.name ?? "Стандартный"}<Icon name="chevron" size={14}/></button>{templateMenuOpen && <div className="template-menu">{templates.map((template) => <button key={template.id} className={template.id === activeTemplateId ? "active" : ""} onClick={() => applyTemplate(template.id)}>{template.name}{template.isDefault && <small>по умолчанию</small>}</button>)}</div>}</div>{templates.find((item) => item.id === activeTemplateId)?.config && <button className="square-btn template-delete-button" aria-label="Удалить шаблон" onClick={deleteActiveTemplate}><Icon name="trash"/></button>}<button className="square-btn template-add-button" aria-label="Добавить шаблон" onClick={() => setTemplateEditorOpen(true)}><Icon name="plus"/></button></div></header>
    <section className="report-period" aria-label="Период отчёта"><div className="date-dropdown"><button className={`btn date-range-button ${datePickerOpen ? "active" : ""}`} onClick={() => setDatePickerOpen((value) => !value)}><Icon name="calendar" size={16}/><span>{new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${dateRange.from}T00:00:00`)).replace(" г.", "")} — {new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${dateRange.to}T00:00:00`)).replace(" г.", "")}</span><Icon name="chevron" size={14}/></button>{datePickerOpen && <div className="card date-popover shadow-sm"><div className="card-body"><div className="date-input-row"><label>С<input type="date" className="form-control form-control-sm" value={dateRange.from} onChange={(event) => { setDateRange((value) => ({ ...value, from: event.target.value })); setActiveDatePreset(""); }}/></label><label>По<input type="date" className="form-control form-control-sm" value={dateRange.to} onChange={(event) => { setDateRange((value) => ({ ...value, to: event.target.value })); setActiveDatePreset(""); }}/></label></div><div className="date-popover-footer"><button className="btn btn-sm btn-link" onClick={() => setDatePickerOpen(false)}>Отмена</button><button className="btn btn-sm btn-primary" onClick={() => setDatePickerOpen(false)}>Применить</button></div></div></div>}</div><div className="btn-group period-presets" role="group" aria-label="Быстрый выбор периода">{["Сегодня", "Вчера", "7 дней", "14 дней"].map((preset) => <button key={preset} type="button" className={`btn ${activeDatePreset === preset ? "active" : ""}`} onClick={() => { setActiveDatePreset(preset); setDateRange(preset === "Сегодня" ? { from: "2026-08-20", to: "2026-08-20" } : preset === "Вчера" ? { from: "2026-08-19", to: "2026-08-19" } : preset === "7 дней" ? { from: "2026-08-14", to: "2026-08-20" } : { from: "2026-08-07", to: "2026-08-20" }); }}>{preset}</button>)}</div></section>
    <section className="card bootstrap-config shadow-sm border-0" aria-label="Конфигуратор отчёта">
      <div className="card-body p-0">
        <div className="config-header"><button className="config-toggle" onClick={() => setConfigExpanded((value) => !value)} aria-expanded={configExpanded}><h2>Параметры отчёта</h2><span className="config-summary">{selectedItems.length} полей · {groupings.length} группировки</span><span className="config-toggle-icon"><Icon name="chevron" size={16}/></span></button></div>{configExpanded && <div className="config-collapse">
        <div className="config-section"><div className="config-section-title"><span className="config-step">1</span><div><h3>Группировки</h3></div></div><div className="config-section-main grouping-compact"><div className="selected-tags">{groupings.map((item, index) => <span className="badge rounded-pill config-badge" key={`${item}-${index}`}>{item}<button aria-label={`Убрать ${item}`} onClick={() => setGroupings((items) => items.filter((value) => value !== item))}>×</button></span>)}</div><button className="btn btn-sm btn-outline-primary config-modal-link" onClick={() => { setModalTab("Группировки"); setModalCategory("Дата"); setReportModalOpen(true); }}><Icon name="plus" size={15}/> Добавить</button></div></div>
        <div className="config-section"><div className="config-section-title"><span className="config-step">2</span><div><h3>Метрики <small>{selectedItems.length}</small></h3></div></div><div className="config-section-main"><div className="selected-tags metric-tags">{selectedItems.length ? selectedItems.map((item, index) => <span className="badge rounded-pill config-badge metric-badge" key={`${item.category}-${item.branch}-${item.label}-${index}`}>{item.label}<button aria-label={`Убрать ${item.label}`} onClick={() => toggleLeaf(item.category, item.branch, item.label)}>×</button></span>) : <span className="empty-config">Пока нет выбранных показателей</span>}</div><div className="metric-add"><button className="btn btn-sm btn-outline-primary config-modal-link" onClick={() => { setModalTab("Метрики"); setModalCategory("Основное"); setReportModalOpen(true); }}><Icon name="plus" size={15}/> Добавить</button></div></div></div>
        <div className="config-section config-section-last"><div className="config-section-title"><span className="config-step">3</span><div><h3>Домены <small>{selectedDomains.length + selectedSources.length}</small></h3></div></div><div className="config-section-main"><div className="selected-tags">{[...selectedDomains, ...selectedSources].map((item, index) => <span className="badge rounded-pill config-badge" key={`${item}-${index}`}>{item}<button aria-label={`Убрать ${item}`} onClick={() => { setSelectedDomains((items) => items.filter((value) => value !== item)); setSelectedSources((items) => items.filter((value) => value !== item)); }}>×</button></span>)}</div><button className="btn btn-sm btn-outline-primary config-modal-link" onClick={() => { setModalTab("Домены"); setModalCategory("Домены"); setReportModalOpen(true); }}><Icon name="plus" size={15}/> Добавить</button></div></div>
        <div className="config-footer"><span>{`${selectedItems.length} метрик· ${groupings.length} группировок · ${selectedDomains.length + selectedSources.length} доменов`}</span><div><button className="btn export-excel-button" onClick={exportReportToExcel}><Icon name="download" size={15} className="excel-download-icon"/><span>{"\u00A0\u00A0"}</span></button><button className="btn btn-primary build-report-action" onClick={buildReport}>Построить отчёт</button></div></div></div>}
      </div>
    </section>
    <section className="data-card"><div className="table-responsive"><table className="report-table" style={{ width: tableWidth }}><colgroup><col style={{ width: columnWidth(0) }}/><col style={{ width: columnWidth(1) }}/><col style={{ width: columnWidth(2) }}/><col style={{ width: columnWidth(3) }}/><col style={{ width: columnWidth(4) }}/><col style={{ width: columnWidth(5) }}/>{reportColumns.map((label, index) => <col key={`${label}-${index}`} style={{ width: columnWidth(index + 6) }}/>)}</colgroup><thead><tr><th className="domain-col table-column-head"><label className="url-search"><Icon name="search" size={17}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Фильтр по домену" /></label><button className={`column-resizer ${resizingColumn === 0 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, 0)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label="Изменить ширину колонки домена" /></th><th className="table-column-head report-date-column">Дата<button className={`column-resizer ${resizingColumn === 1 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, 1)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label="Изменить ширину колонки даты" /></th><th className="table-column-head geo-column"><ColumnTitle onFilter={() => setActiveColumnFilter((current) => current === "ГЕО" ? null : "ГЕО")}>ГЕО</ColumnTitle>{activeColumnFilter === "ГЕО" && <div className="column-filter-popover"><input autoFocus value={columnFilters["ГЕО"] ?? ""} onChange={(event) => setColumnFilters((filters) => ({ ...filters, "ГЕО": event.target.value }))} placeholder="Фильтр..."/><button onClick={() => { setColumnFilters((filters) => ({ ...filters, "ГЕО": "" })); setActiveColumnFilter(null); }}>Сбросить</button></div>}<button className={`column-resizer ${resizingColumn === 2 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, 2)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label="Изменить ширину колонки ГЕО" /></th><th className="table-column-head country-column"><ColumnTitle onFilter={() => setActiveColumnFilter((current) => current === "Страна" ? null : "Страна")}>Страна</ColumnTitle>{activeColumnFilter === "Страна" && <div className="column-filter-popover"><input autoFocus value={columnFilters["Страна"] ?? ""} onChange={(event) => setColumnFilters((filters) => ({ ...filters, "Страна": event.target.value }))} placeholder="Фильтр..."/><button onClick={() => { setColumnFilters((filters) => ({ ...filters, "Страна": "" })); setActiveColumnFilter(null); }}>Сбросить</button></div>}<button className={`column-resizer ${resizingColumn === 3 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, 3)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label="Изменить ширину колонки страны" /></th><th className="table-column-head format-column"><ColumnTitle onFilter={() => setActiveColumnFilter((current) => current === "Формат" ? null : "Формат")}>Формат</ColumnTitle>{activeColumnFilter === "Формат" && <div className="column-filter-popover"><input autoFocus value={columnFilters["Формат"] ?? ""} onChange={(event) => setColumnFilters((filters) => ({ ...filters, "Формат": event.target.value }))} placeholder="Фильтр..."/><button onClick={() => { setColumnFilters((filters) => ({ ...filters, "Формат": "" })); setActiveColumnFilter(null); }}>Сбросить</button></div>}<button className={`column-resizer ${resizingColumn === 4 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, 4)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label="Изменить ширину колонки формата" /></th><th className="table-column-head format-size-column"><ColumnTitle onFilter={() => setActiveColumnFilter((current) => current === "Размер" ? null : "Размер")}>Размер</ColumnTitle>{activeColumnFilter === "Размер" && <div className="column-filter-popover"><input autoFocus value={columnFilters["Размер"] ?? ""} onChange={(event) => setColumnFilters((filters) => ({ ...filters, "Размер": event.target.value }))} placeholder="Фильтр..."/><button onClick={() => { setColumnFilters((filters) => ({ ...filters, "Размер": "" })); setActiveColumnFilter(null); }}>Сбросить</button></div>}<button className={`column-resizer ${resizingColumn === 5 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, 5)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label="Изменить ширину колонки размера" /></th>{reportColumns.map((label, index) => <th className="table-column-head" key={`${label}-${index}`}><ColumnTitle onFilter={() => setActiveColumnFilter((current) => current === label ? null : label)}>{label}</ColumnTitle>{activeColumnFilter === label && <div className="column-filter-popover"><input autoFocus value={columnFilters[label] ?? ""} onChange={(event) => setColumnFilters((filters) => ({ ...filters, [label]: event.target.value }))} placeholder="Фильтр..."/><button onClick={() => { setColumnFilters((filters) => ({ ...filters, [label]: "" })); setActiveColumnFilter(null); }}>Сбросить</button></div>}<button className={`column-resizer ${resizingColumn === index + 6 ? "is-resizing" : ""}`} onPointerDown={(event) => startColumnResize(event, index + 6)} onPointerMove={resizeColumn} onPointerUp={finishColumnResize} onLostPointerCapture={finishColumnResize} aria-label={`Изменить ширину колонки ${label}`} /></th>)}</tr></thead><tbody><tr className="summary"><td colSpan={6}>Итого</td>{reportColumns.map((label, index) => <td key={`${label}-${index}`}>{reportTotals[index]}</td>)}</tr>{filteredRows.map((row) => <tr key={row.id}><td className="report-domain-cell">{row.domain}</td><td className="report-date-cell">{row.date}</td><td className="geo-cell">{row.geo}</td><td className="country-cell">{row.country}</td><td className="format-cell">{row.format}</td><td className="format-size-cell">{row.formatSize}</td>{reportColumns.map((label, index) => <td key={`${row.id}-${label}-${index}`}>{row.metricValues[index]}</td>)}</tr>)}</tbody></table>{filteredRows.length === 0 && <div className="no-results">Нет доменов или форматов, соответствующих фильтру</div>}</div><footer className="table-footer"><span>Показано {filteredRows.length} из {reportRows.length} записей</span><div className="pagination"><button aria-label="Первая страница"><Icon name="first"/></button><button aria-label="Предыдущая страница"><Icon name="prev"/></button><button className="current">1</button><button aria-label="Следующая страница"><Icon name="next"/></button><button aria-label="Последняя страница"><Icon name="last"/></button></div></footer></section>
    {templateEditorOpen && <><div className="modal-backdrop show template-backdrop"></div><div className="template-editor" role="dialog" aria-modal="true" aria-label="Новый шаблон"><div className="template-editor-content"><label>Шаблон:<input autoFocus value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Название шаблона"/></label><button className="template-confirm" onClick={saveTemplate} aria-label="Сохранить шаблон"><Icon name="check" size={23}/></button><button className="template-cancel" onClick={() => setTemplateEditorOpen(false)} aria-label="Отмена"><Icon name="cancel" size={22}/></button><label className="template-default"><input type="checkbox" checked={templateDefault} onChange={(event) => setTemplateDefault(event.target.checked)}/>Применять по умолчанию</label></div></div></>}
    {reportModalOpen && <><div className="modal-backdrop show report-modal-backdrop"></div><div className="modal d-block report-builder-modal" role="dialog" aria-modal="true" aria-labelledby="report-builder-title"><div className="modal-dialog modal-dialog-centered report-builder-dialog"><div className="modal-content"><div className="modal-header"><div className="report-builder-heading"><div><h5 className="modal-title" id="report-builder-title">{modalTab === "Группировки" ? "Настройка группировок" : modalTab === "Метрики" ? "Выбор метрик" : "Выбор доменов"}</h5><span>{modalTab === "Группировки" ? "Параметры для строк отчёта" : modalTab === "Метрики" ? "Параметры для колонок таблицы" : "Домены и технические источники"}</span></div></div><button type="button" className="btn-close" onClick={() => setReportModalOpen(false)} aria-label="Закрыть"/></div><div className="modal-body"><div className="builder-layout"><section className="builder-categories"><p>Разделы</p>{Object.keys(modalTab === "Группировки" ? modalGroupingCatalog : modalTab === "Метрики" ? modalMetricCatalog : { "Домены": [], "Источники": [] }).map((category) => { const selectedCount = modalTab === "Группировки" ? modalGroupingCatalog[category].filter((option) => groupings.includes(option)).length : 0; return <button key={category} className={modalCategory === category ? "active" : ""} onClick={() => setModalCategory(category)}><span>{category}{modalTab === "Группировки" && <b className="category-selection-count">{selectedCount}</b>}</span><Icon name="chevron" size={14}/></button>; })}</section><section className={`builder-options ${modalTab === "Домены" ? "domain-options" : ""}`}>{modalTab !== "Домены" && <div className="builder-options-head"><div><p>{modalTab}</p><h6>{modalCategory}</h6></div><span>{modalTab === "Группировки" ? "Для строк отчёта" : "Для колонок таблицы"}</span></div>}{modalTab === "Группировки" ? modalCategory === "География" ? <div className="grouping-tree">{modalGroupingCatalog[modalCategory].map((option) => { const selected = groupings.includes(option); const mode = option === "По GEO" ? "geo" : "countries"; return <div className="grouping-tree-node" key={option}><button className={`parameter-option ${selected ? "selected" : ""}`} onClick={() => { setGeoDetailMode(selected && geoDetailMode === mode ? null : mode); setGroupings((items) => selected ? items.filter((item) => item !== option) : [...items.filter((item) => item !== "По GEO" && item !== "По странам"), option]); }}><span>{option}</span><i>{selected ? "Выбрано" : "Добавить"}</i></button>{selected && geoDetailMode === "geo" && option === "По GEO" && <div className="tree-details">{["RU", "SNG", "EU", "OTHER"].map((geo) => <label className="geo-check" key={geo}><input type="checkbox" checked={geoGroups.includes(geo)} onChange={() => setGeoGroups((items) => items.includes(geo) ? items.filter((item) => item !== geo) : [...items, geo])}/><span>{geo}</span></label>)}</div>}{selected && geoDetailMode === "countries" && option === "По странам" && <div className="tree-details countries-tree-details"><div className="input-group input-group-sm geo-search"><span className="input-group-text"><Icon name="search" size={13}/></span><input className="form-control" value={countryQuery} onChange={(event) => setCountryQuery(event.target.value)} placeholder="Поиск страны"/></div><div className="country-tree"><button className="country-region" onClick={() => setSngExpanded((value) => !value)}><Icon name="chevron" size={14}/><input type="checkbox" checked={geoCountries.includes("СНГ")} onClick={(event) => event.stopPropagation()} onChange={() => setGeoCountries((items) => items.includes("СНГ") ? items.filter((item) => item !== "СНГ") : [...items, "СНГ"])} /><span>СНГ</span></button>{sngExpanded && <div className="country-children">{["Россия", "Беларусь", "Казахстан", "Азербайджан", "Армения", "Узбекистан", "Кыргызстан", "Таджикистан"].filter((country) => country.toLowerCase().includes(countryQuery.toLowerCase())).map((country) => <label className="geo-check" key={country}><input type="checkbox" checked={geoCountries.includes(country)} onChange={() => setGeoCountries((items) => items.includes(country) ? items.filter((item) => item !== country) : [...items, country])}/><span>{country}</span></label>)}</div>}{["Европа", "Азия", "Африка", "Северная Америка", "Южная Америка", "Австралия и Океания"].filter((region) => region.toLowerCase().includes(countryQuery.toLowerCase())).map((region) => <button className="country-region" key={region}><Icon name="chevron" size={14}/><input type="checkbox" checked={geoCountries.includes(region)} onClick={(event) => event.stopPropagation()} onChange={() => setGeoCountries((items) => items.includes(region) ? items.filter((item) => item !== region) : [...items, region])}/><span>{region}</span></button>)}</div></div>}</div>; })}</div> : modalCategory === "Технологии" ? <div className="grouping-tree">{modalGroupingCatalog[modalCategory].map((option) => { const selected = groupings.includes(option); const values = trafficDetailCatalog[option] ?? []; return <div className="grouping-tree-node" key={option}><button className={`parameter-option ${selected ? "selected" : ""}`} onClick={() => { setTechnologyDetailMode(selected && technologyDetailMode === option ? null : option); setGroupings((items) => selected ? items.filter((item) => item !== option) : [...items, option]); }}><span>{option}</span><i>{selected ? "Выбрано" : "Добавить"}</i></button>{selected && technologyDetailMode === option && <div className="tree-details traffic-tree-details"><strong>{option}</strong>{values.map((value) => <label className="geo-check" key={value}><input type="checkbox" checked={(technologyValues[option] ?? []).includes(value)} onChange={() => setTechnologyValues((items) => { const optionValues = items[option] ?? []; return { ...items, [option]: optionValues.includes(value) ? optionValues.filter((item) => item !== value) : [...optionValues, value] }; })}/><span>{value}</span></label>)}</div>}</div>; })}</div> : modalCategory === "Трафик" ? <div className="grouping-tree">{modalGroupingCatalog[modalCategory].map((option) => { const selected = groupings.includes(option); const isCategories = option === "Категории"; const isSegments = option === "Сегменты"; const hasTaxonomyList = isCategories || isSegments; const query = isCategories ? siteCategoryQuery : siteSegmentQuery; const values = isCategories ? siteCategories : isSegments ? siteSegments : trafficDetailCatalog[option] ?? []; const selectedValues = isCategories ? selectedSiteCategories : isSegments ? selectedSiteSegments : trafficValues[option] ?? []; const setQuery = isCategories ? setSiteCategoryQuery : setSiteSegmentQuery; const setSelectedValues = isCategories ? setSelectedSiteCategories : isSegments ? setSelectedSiteSegments : null; return <div className="grouping-tree-node" key={option}><button className={`parameter-option ${selected ? "selected" : ""}`} onClick={() => { setTrafficDetailMode(selected && trafficDetailMode === option ? null : option); setGroupings((items) => selected ? items.filter((item) => item !== option) : [...items, option]); }}><span>{option}</span><i>{selected ? "Выбрано" : "Добавить"}</i></button>{selected && trafficDetailMode === option && <div className="tree-details traffic-tree-details">{hasTaxonomyList && <div className="input-group input-group-sm geo-search"><span className="input-group-text"><Icon name="search" size={13}/></span><input className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isCategories ? "Поиск категории" : "Поиск сегмента"}/></div>}<strong>{option}</strong>{values.filter((value) => value.toLowerCase().includes(query.toLowerCase())).map((value) => <label className="geo-check" key={value}><input type="checkbox" checked={selectedValues.includes(value)} onChange={() => { if (setSelectedValues) setSelectedValues((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value]); else setTrafficValues((items) => { const optionValues = items[option] ?? []; return { ...items, [option]: optionValues.includes(value) ? optionValues.filter((item) => item !== value) : [...optionValues, value] }; }); }}/><span>{value}</span></label>)}</div>}</div>; })}</div> : modalCategory === "Реклама" ? <div className="grouping-tree">{modalGroupingCatalog[modalCategory].map((option) => { const selected = groupings.includes(option); const isCampaigns = option === "Рекламные кампании"; const isCreatives = option === "Рекламные объявления"; const mode = isCampaigns ? "campaigns" : "creatives"; const detailActive = (isCampaigns || isCreatives) && selected && advertisingDetailMode === mode; const list = isCampaigns ? advertisingCampaigns : advertisingCreatives; const query = isCampaigns ? campaignQuery : creativeQuery; const selectedList = isCampaigns ? selectedCampaigns : selectedCreatives; return <div className="grouping-tree-node" key={option}><button className={`parameter-option ${selected ? "selected" : ""}`} onClick={() => { if (isCampaigns || isCreatives) setAdvertisingDetailMode(selected && advertisingDetailMode === mode ? null : mode); setGroupings((items) => selected ? items.filter((item) => item !== option) : [...items, option]); }}><span>{option}</span><i>{selected ? "Выбрано" : "Добавить"}</i></button>{detailActive && <div className="tree-details advertising-tree-details"><div className="input-group input-group-sm geo-search"><span className="input-group-text"><Icon name="search" size={13}/></span><input className="form-control" value={query} onChange={(event) => isCampaigns ? setCampaignQuery(event.target.value) : setCreativeQuery(event.target.value)} placeholder={isCampaigns ? "Поиск кампании" : "Поиск объявления"}/></div><div className="advertising-list">{list.filter((item) => item.toLowerCase().includes(query.toLowerCase())).map((item) => <label className="geo-check" key={item}><input type="checkbox" checked={selectedList.includes(item)} onChange={() => { const update = (items: string[]) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]; if (isCampaigns) setSelectedCampaigns(update); else setSelectedCreatives(update); }}/><span>{item}</span></label>)}</div></div>}</div>; })}</div> : <div className="option-list">{modalGroupingCatalog[modalCategory].map((option) => <button key={option} className={`parameter-option ${groupings.includes(option) ? "selected" : ""}`} onClick={() => setGroupings((items) => { const selected = items.includes(option); if (modalCategory === "Дата") { return selected ? items.filter((item) => item !== option) : [...items.filter((item) => !modalGroupingCatalog["Дата"].includes(item)), option]; } return selected ? items.filter((item) => item !== option) : [...items, option]; })}><span>{option}</span><i>{groupings.includes(option) ? "Выбрано" : "Добавить"}</i></button>)}</div> : modalTab === "Домены" ? <div className="domain-picker"><div className="domain-picker-summary"><div><span className="domain-picker-kicker">{modalCategory === "Домены" ? "Сайты" : "Технические домены"}</span><strong>{modalCategory === "Домены" ? reportDomains.length : sourceDomains.length} доступно</strong></div><span className="domain-selected-count">Выбрано: {(modalCategory === "Домены" ? selectedDomains : selectedSources).length}</span></div><div className="input-group input-group-sm domain-search"><span className="input-group-text"><Icon name="search" size={14}/></span><input className="form-control" value={modalCategory === "Домены" ? domainQuery : sourceQuery} onChange={(event) => modalCategory === "Домены" ? setDomainQuery(event.target.value) : setSourceQuery(event.target.value)} placeholder={modalCategory === "Домены" ? "Найти домен" : "Найти технический домен"}/></div><div className="domain-picker-list">{(modalCategory === "Домены" ? reportDomains : sourceDomains).filter((item) => item.toLowerCase().includes((modalCategory === "Домены" ? domainQuery : sourceQuery).toLowerCase())).map((item) => { const chosen = (modalCategory === "Домены" ? selectedDomains : selectedSources).includes(item); return <label className={`domain-option-row ${chosen ? "selected" : ""}`} key={item}><input type="checkbox" checked={chosen} onChange={() => modalCategory === "Домены" ? setSelectedDomains((items) => chosen ? items.filter((value) => value !== item) : [...items, item]) : setSelectedSources((items) => chosen ? items.filter((value) => value !== item) : [...items, item])}/><span className="domain-option-name">{item}</span><span className="domain-option-kind">{modalCategory === "Домены" ? "Сайт" : "Источник"}</span></label>; })}</div></div> : <div className="option-list metric-options-list">{modalMetricCatalog[modalCategory].flatMap((group) => [<div key={`heading-${group.label}`} className="option-section-label">{group.label}</div>, ...group.options.map((option) => <button key={`${group.label}-${option}`} className={`parameter-option ${isSelected(group.category, group.branch, option) ? "selected" : ""}`} onClick={() => toggleLeaf(group.category, group.branch, option)}><span>{option}</span><i>{isSelected(group.category, group.branch, option) ? "Выбрано" : "Добавить"}</i></button>)])}</div>}</section></div></div><div className="modal-footer report-builder-footer">{modalTab === "Домены" && <div><button type="button" className={`combine-data-button ${combineGroupingData ? "active" : ""}`} onClick={() => setCombineGroupingData((value) => !value)} aria-pressed={combineGroupingData}><span className="combine-data-toggle" aria-hidden="true"></span>Объединять данные</button></div>}{modalTab === "Метрики" && <div><span>Метрики: <b>{selectedItems.length}</b></span></div>}<div><button className="btn btn-light" onClick={() => setReportModalOpen(false)}>Отмена</button><button className="btn btn-primary" onClick={() => setReportModalOpen(false)}>Применить</button></div></div></div></div></div></>}
  </main>;
}
