import { CommonTranslations } from "./types";
import { uiTranslations } from "./common/ui";
import { inventoryTranslations } from "./common/inventory";
import { moduleTranslations } from "./common/modules";
import { chartTranslations } from "./common/charts";
import { paginationTranslations } from "./common/pagination";
import { logisticsTranslations } from "./common/logistics";
import { ddsopTranslations } from "./common/ddsop";
import { zonesTranslations } from "./common/zones";

export const commonTranslations: any = {
  // UI translations
  ...uiTranslations,
  name: {
    en: "Name",
    ar: "الاسم",
  },

  // Basic common translations that were missing
  overview: { en: "Overview", ar: "ملخص" },
  loading: { en: "Loading...", ar: "جار التحميل..." },
  noData: { en: "No data available", ar: "لا توجد بيانات" },
  error: { en: "Error", ar: "خطأ" },
  success: { en: "Success", ar: "نجاح" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  back: { en: "Back", ar: "رجوع" },
  next: { en: "Next", ar: "التالي" },
  submit: { en: "Submit", ar: "إرسال" },
  skus: { en: "SKUs", ar: "وحدات التخزين" },
  create: { en: "Create", ar: "إنشاء" },
  ddsop: {
    title: {
      en: "Demand-Driven S&OP",
      ar: "تخطيط المبيعات والعمليات المدفوع بالطلب",
    },
    approved: { en: "Approved", ar: "موافَق عليه" },
    inReview: { en: "In Review", ar: "قيد المراجعة" },
    metrics: { en: "Metrics", ar: "المقاييس" },
    success: { en: "Success", ar: "نجاح" },
    startReconciliation: { en: "Start Reconciliation", ar: "بدء التسوية" },
    reconciliationReport: { en: "Reconciliation Report", ar: "تقرير التسوية" },
    description: {
      en: "Integrate demand-driven operational planning with strategic S&OP processes",
      ar: "دمج التخطيط التشغيلي المدفوع بالطلب مع عمليات تخطيط المبيعات والعمليات الاستراتيجية",
    },
    compliantMode: {
      en: "Compliant Mode",
      ar: "وضع الامتثال",
    },
    filters: {
      en: "Filters",
      ar: "تصفية",
    },
    generateReport: {
      en: "Generate Report",
      ar: "إنشاء تقرير",
    },

    // Main navigation and tabs
    operationalModel: {
      en: "Operational Model",
      ar: "نموذج التشغيل",
    },
    sandopIntegration: {
      en: "S&OP Integration",
      ar: "تكامل تخطيط المبيعات والعمليات",
    },
    collaborativeExecution: {
      en: "Collaborative Execution",
      ar: "التنفيذ التعاوني",
    },
    adaptivePlanning: {
      en: "Adaptive Planning",
      ar: "التخطيط التكيفي",
    },
    operationalDashboard: {
      en: "Operational Dashboard",
      ar: "لوحة معلومات التشغيل",
    },

    // Component descriptions
    operationalModelDescription: {
      en: "DDOM operational model with key performance metrics and execution visibility",
      ar: "نموذج التشغيل المدفوع بالطلب مع مقاييس الأداء الرئيسية ورؤية التنفيذ",
    },
    sandopIntegrationDescription: {
      en: "Bi-directional integration between operational DDMRP and strategic S&OP processes",
      ar: "التكامل ثنائي الاتجاه بين العمليات التشغيلية DDMRP والاستراتيجية S&OP",
    },
    collaborativeExecutionDescription: {
      en: "Real-time collaboration and execution management across the supply chain",
      ar: "التعاون في الوقت الحقيقي وإدارة التنفيذ عبر سلسلة التوريد",
    },
    adaptivePlanningDescription: {
      en: "Adaptive planning cycles and market signal detection for responsive planning",
      ar: "دورات التخطيط التكيفية واكتشاف إشارات السوق للتخطيط سريع الاستجابة",
    },

    // Metrics
    integrationMetrics: {
      en: "S&OP Integration Metrics",
      ar: "مقاييس تكامل تخطيط المبيعات والعمليات",
    },
    executionMetrics: {
      en: "Execution Metrics",
      ar: "مقاييس التنفيذ",
    },
    operationalMetrics: {
      en: "Operational Metrics",
      ar: "المقاييس التشغيلية",
    },
    adaptiveMetrics: {
      en: "Adaptive Planning Metrics",
      ar: "مقاييس التخطيط التكيفي",
    },

    // New metrics specifically shown in the image
    tacticalCycleAdherence: {
      en: "Cycle Adherence",
      ar: "الالتزام بالدورة",
    },
    marketResponseTime: {
      en: "Market Response Time",
      ar: "وقت الاستجابة للسوق",
    },
    signalDetectionRate: {
      en: "Signal Detection Rate",
      ar: "معدل اكتشاف الإشارات",
    },
    adjustmentAccuracy: {
      en: "Adjustment Accuracy",
      ar: "دقة التعديل",
    },
    days: {
      en: "days",
      ar: "أيام",
    },

    // KPI translations
    flowIndex: {
      en: "Flow Index",
      ar: "مؤشر التدفق",
    },
    demandSignalQuality: {
      en: "Demand Signal Quality",
      ar: "جودة إشارة الطلب",
    },
    executionVariance: {
      en: "Execution Variance",
      ar: "تباين التنفيذ",
    },
    adaptiveResponseTime: {
      en: "Adaptive Response Time",
      ar: "وقت الاستجابة التكيفية",
    },
    planVsActualVariance: {
      en: "Plan vs Actual Variance",
      ar: "تباين الخطة مقابل الفعلي",
    },

    // Collaborative execution
    shareExecutionPlan: {
      en: "Share Execution Plan",
      ar: "مشاركة خطة التنفيذ",
    },
    actions: {
      en: "Actions",
      ar: "إجراءات",
    },
    alerts: {
      en: "Alerts",
      ar: "تنبيهات",
    },
    decisions: {
      en: "Decisions",
      ar: "قرارات",
    },
    notes: {
      en: "Notes",
      ar: "ملاحظات",
    },
    addNewItem: {
      en: "Add new item...",
      ar: "إضافة عنصر جديد...",
    },
    add: {
      en: "Add",
      ar: "إضافة",
    },
    itemAdded: {
      en: "Item added successfully",
      ar: "تمت إضافة العنصر بنجاح",
    },
    executionPlanShared: {
      en: "Execution plan shared with team",
      ar: "تمت مشاركة خطة التنفيذ مع الفريق",
    },

    // Buffer and resource metrics
    bufferpenetrationresponse: {
      en: "Buffer Penetration Response",
      ar: "استجابة اختراق المخزون",
    },
    resourceutilization: {
      en: "Resource Utilization",
      ar: "استخدام الموارد",
    },
    tacticalcycleadherence: {
      en: "Tactical Cycle Adherence",
      ar: "الالتزام بالدورة التكتيكية",
    },
    demandsignalquality: {
      en: "Demand Signal Quality",
      ar: "جودة إشارة الطلب",
    },
    strategicdecouplingeffectiveness: {
      en: "Strategic Decoupling Effectiveness",
      ar: "فعالية الفصل الاستراتيجي",
    },

    // Adaptive planning
    planningCycles: {
      en: "Planning Cycles",
      ar: "دورات التخطيط",
    },
    cycleMetrics: {
      en: "Cycle Metrics",
      ar: "مقاييس الدورة",
    },
    marketSignals: {
      en: "Market Signals",
      ar: "إشارات السوق",
    },
    frequency: {
      en: "Frequency",
      ar: "التكرار",
    },
    nextCycle: {
      en: "Next Cycle",
      ar: "الدورة التالية",
    },
    triggerCycle: {
      en: "Trigger Cycle",
      ar: "بدء الدورة",
    },
    cycleTriggered: {
      en: "Adaptive cycle has been triggered",
      ar: "تم بدء الدورة التكيفية",
    },

    // S&OP integration
    sopCycles: {
      en: "S&OP Cycles",
      ar: "دورات تخطيط المبيعات والعمليات",
    },
    reconciliation: {
      en: "Reconciliation",
      ar: "التوفيق",
    },
    lastCompleted: {
      en: "Last Completed",
      ar: "آخر اكتمال",
    },
    viewDetails: {
      en: "View Details",
      ar: "عرض التفاصيل",
    },
    active: {
      en: "Active",
      ar: "نشط",
    },
    reconciliationStarted: {
      en: "Reconciliation process started",
      ar: "بدأت عملية التوفيق",
    },
    projectionsLoaded: {
      en: "Projections loaded successfully",
      ar: "تم تحميل التوقعات بنجاح",
    },
    adjustmentReviewed: {
      en: "Adjustment #{id} has been reviewed",
      ar: "تمت مراجعة التعديل رقم {id}",
    },
    tacticalAdjustments: {
      en: "Tactical Adjustments",
      ar: "التعديلات التكتيكية",
    },
    viewProjections: {
      en: "View Projections",
      ar: "عرض التوقعات",
    },
    scenarioPlanning: {
      en: "Scenario Planning",
      ar: "تخطيط السيناريوهات",
    },
    demandSupplyReconciliation: {
      en: "Demand-Supply Reconciliation",
      ar: "مطابقة العرض والطلب",
    },
    lastDdmrpReconciliation: {
      en: "Last DDMRP Reconciliation",
      ar: "آخر مطابقة DDMRP",
    },

    // Status badges
    onTrack: {
      en: "On Track",
      ar: "على المسار الصحيح",
    },
    warning: {
      en: "Warning",
      ar: "تحذير",
    },
    alert: {
      en: "Alert",
      ar: "تنبيه",
    },
    upcoming: {
      en: "Upcoming",
      ar: "قادم",
    },
    standby: {
      en: "On Standby",
      ar: "في الانظار",
    },
    pendingAction: {
      en: "Pending Action",
      ar: "في انتظار الإجراء",
    },
    inAssessment: {
      en: "In Assessment",
      ar: "قيد التقييم",
    },
    monitored: {
      en: "Monitored",
      ar: "مراقب",
    },
    completed: {
      en: "Completed",
      ar: "مكتمل",
    },
    inProgress: {
      en: "In Progress",
      ar: "قيد التنفيذ",
    },
    pending: {
      en: "Pending",
      ar: "معلق",
    },

    // Priority and impact
    highImpact: {
      en: "High Impact",
      ar: "تأثير مرتفع",
    },
    mediumImpact: {
      en: "Medium Impact",
      ar: "تأثير متوسط",
    },
    lowImpact: {
      en: "Low Impact",
      ar: "تأثير منخفض",
    },
    highPriority: {
      en: "High Priority",
      ar: "أولوية عالية",
    },
    mediumPriority: {
      en: "Medium Priority",
      ar: "أولوية متوسطة",
    },
    lowPriority: {
      en: "Low Priority",
      ar: "أولوية منخفضة",
    },

    // Trend indicators
    improving: {
      en: "Improving",
      ar: "في تحسن",
    },
    declining: {
      en: "Declining",
      ar: "في تراجع",
    },
    stable: {
      en: "Stable",
      ar: "مستقر",
    },

    // Table headers and metrics
    metric: {
      en: "Metric",
      ar: "مقياس",
    },
    status: {
      en: "Status",
      ar: "الحالة",
    },
    actual: {
      en: "Actual",
      ar: "الفعلي",
    },
    target: {
      en: "Target",
      ar: "الهدف",
    },
    trend: {
      en: "Trend",
      ar: "الاتجاه",
    },
    planned: {
      en: "Planned",
      ar: "المخطط",
    },
    variance: {
      en: "Variance",
      ar: "التباين",
    },
    detected: {
      en: "Detected",
      ar: "تم اكتشافه",
    },
    review: {
      en: "Review",
      ar: "مراجعة",
    },
    justNow: {
      en: "Just now",
      ar: "الآن",
    },
    all: {
      en: "All",
      ar: "الكل",
    },
    hours: {
      en: "hours",
      ar: "ساعات",
    },

    // Specific metric names used in the operational dashboard
    // These entries replace the duplicate ones that were causing errors
    tacticalCycle: {
      en: "Tactical Cycle",
      ar: "الدورة التكتيكية",
    },

    // Added for execution metrics
    current: {
      en: "Current",
      ar: "الحالي",
    },
    takeAction: {
      en: "Take Action",
      ar: "اتخاذ إجراء",
    },
    metricsDisplayed: {
      en: "metrics displayed",
      ar: "المقاييس المعروضة",
    },
    criticalItems: {
      en: "critical items",
      ar: "العناصر الحرجة",
    },
    warningItems: {
      en: "warning items",
      ar: "عناصر التحذير",
    },
    immediateActionNeeded: {
      en: "Immediate action needed",
      ar: "إجراء فوري مطلوب",
    },
    preventiveActionRecommended: {
      en: "Preventive action recommended",
      ar: "إجراء وقائي موصى به",
    },
    continuedMonitoringAdvised: {
      en: "Continued monitoring advised",
      ar: "ينصح بالمراقبة المستمرة",
    },
    maintainCurrentApproach: {
      en: "Maintain current approach",
      ar: "الحفاظ على النهج الحالي",
    },
    reviewAndAnalyze: {
      en: "Review and analyze",
      ar: "مراجعة وتحليل",
    },
    actionInitiated: {
      en: "Action has been initiated",
      ar: "تم بدء الإجراء",
    },
  },
  // Zone translations
  zones: zonesTranslations,

  // Individual inventory translations
  inventory: inventoryTranslations,

  // Chart translations
  // chartTitles: { en: "Chart Titles", ar: "عناوين الرسوم البيانية" },
  chartTitles: {
    bufferProfile: {
      en: "Buffer Profile",
      ar: "ملف المخزون",
    },
    replenishment: {
      en: "Replenishment",
      ar: "إعادة التزويد",
    },
    netFlow: {
      en: "Net Flow",
      ar: "التدفق الصافي",
    },
    demandVariability: {
      en: "Demand Variability",
      ar: "تغير الطلب",
    },
    inventoryTrends: {
      en: "Inventory Trends",
      ar: "اتجاهات المخزون",
    },
  },
  // zones: {
  //   red: {
  //     en: "Red Zone",
  //     ar: "المنطقة الحمراء",
  //   },
  //   yellow: {
  //     en: "Yellow Zone",
  //     ar: "المنطقة الصفراء",
  //   },
  //   green: {
  //     en: "Green Zone",
  //     ar: "المنطقة الخضراء",
  //   },
  // },
  // Add missing chart translations for replenishment and netFlow
  replenishment: { en: "Replenishment", ar: "إعادة التزويد" },
  netFlow: { en: "Net Flow", ar: "التدفق الصافي" },
  inventoryTrends: { en: "Inventory Trends", ar: "اتجاهات المخزون" },

  // Pagination translations
  previous: paginationTranslations.previous,
  page: paginationTranslations.page,
  of: paginationTranslations.of,
  perPage: paginationTranslations.perPage,
  items: paginationTranslations.items,
  showing: paginationTranslations.showing,
  to: paginationTranslations.to,

  // Add other required common translations
  settings: { en: "Settings", ar: "الإعدادات" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  save: { en: "Save", ar: "حفظ" },
  delete: { en: "Delete", ar: "حذف" },
  edit: { en: "Edit", ar: "تعديل" },
  search: { en: "Search", ar: "بحث" },
  filter: { en: "Filter", ar: "تصفية" },
  apply: { en: "Apply", ar: "تطبيق" },
  reset: { en: "Reset", ar: "إعادة ضبط" },
  modules: { en: "Modules", ar: "الوحدات" },
  skuCount: { en: "SKU Count", ar: "عدد وحدات التخزين" },
  accuracyLabel: { en: "Accuracy", ar: "الدقة" },
  pipelineValue: { en: "Pipeline Value", ar: "قيمة خط الأنابيب" },
  activeCampaigns: { en: "Active Campaigns", ar: "الحملات النشطة" },
  onTimeDelivery: { en: "On-Time Delivery", ar: "التسليم في الوقت المحدد" },
  reportCount: { en: "Available Reports", ar: "التقارير المتاحة" },
  thisQuarter: { en: "this quarter", ar: "هذا الربع" },
  fromLastMonth: { en: "from last month", ar: "من الشهر الماضي" },
  fromLastWeek: { en: "from last week", ar: "من الأسبوع الماضي" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  purchaseOrderCreated: {
    en: "Purchase order created successfully",
    ar: "تم إنشاء طلب الشراء بنجاح",
  },
  refresh: { en: "Refresh", ar: "تحديث" },
};
