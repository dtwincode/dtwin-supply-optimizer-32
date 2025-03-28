
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { modulesSummaryTranslations, moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';
import { logisticsTranslations } from './common/logistics';
import { ddsopTranslations } from './common/ddsop';
import { zonesTranslations } from './common/zones';

// Creating a proper CommonTranslations object that matches the interface
export const commonTranslations = {
  en: {
    loading: "Loading...",
    noData: "No data available",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    skus: "SKUs",
    create: "Create",
    
    // Zone translations
    zones: {
      green: "Green Zone",
      yellow: "Yellow Zone",
      red: "Red Zone"
    },
    
    // Individual inventory translations
    inventory: {
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      overstock: "Overstock",
      onOrder: "On Order",
      allocated: "Allocated",
      available: "Available",
      decouplingPoints: "Decoupling Points",
      configureDecouplingPoints: "Configure Decoupling Points",
      refresh: "Refresh",
      addDecouplingPoint: "Add Decoupling Point",
      decouplingNetwork: "Network View",
      listView: "List View",
      locationId: "Location ID",
      type: "Type",
      description: "Description",
      actions: "Actions",
      noDecouplingPoints: "No Decoupling Points",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Confirm Delete",
      success: "Success",
      decouplingPointDeleted: "Decoupling Point Deleted",
      decouplingPointSaved: "Decoupling Point Saved",
      networkVisualization: "Network Visualization",
      nodes: "Nodes",
      links: "Links",
      totalItems: "Total Items",
      networkHelp: "Network Help",
      nodesDescription: "Network nodes represent locations in the supply chain",
      linksDescription: "Links represent connections between nodes"
    },
    
    // Chart translations
    chartTitles: {
      bufferProfile: "Buffer Profile",
      demandVariability: "Demand Variability"
    },
    
    // Add missing chart translations
    replenishment: "Replenishment",
    netFlow: "Net Flow",
    inventoryTrends: "Inventory Trends",
    
    // Pagination translations 
    previous: "Previous",
    page: "Page",
    of: "of",
    perPage: "Per Page",
    items: "Items",
    showing: "Showing",
    to: "to",
    
    // Add other required common translations
    settings: "Settings",
    logout: "Logout",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    filter: "Filter",
    apply: "Apply",
    reset: "Reset",
    modules: "Modules",
    skuCount: "SKU Count",
    accuracyLabel: "Accuracy",
    pipelineValue: "Pipeline Value",
    activeCampaigns: "Active Campaigns",
    onTimeDelivery: "On-Time Delivery",
    reportCount: "Available Reports",
    thisQuarter: "this quarter",
    fromLastMonth: "from last month",
    fromLastWeek: "from last week",
    viewDetails: "View Details",
    purchaseOrderCreated: "Purchase order created successfully",
    refresh: "Refresh",
    
    // Required by the interface
    warning: "Warning",
    info: "Information",
    clear: "Clear",
    all: "All",
    none: "None",
    select: "Select",
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    email: "Email",
    phone: "Phone",
    address: "Address",
    name: "Name",
    description: "Description",
    update: "Update"
  },
  ar: {
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات متاحة",
    error: "خطأ",
    success: "نجاح",
    confirm: "تأكيد",
    back: "رجوع",
    next: "التالي",
    submit: "إرسال",
    skus: "وحدات التخزين",
    create: "إنشاء",
    
    // Zone translations
    zones: {
      green: "المنطقة الخضراء",
      yellow: "المنطقة الصفراء",
      red: "المنطقة الحمراء"
    },
    
    // Individual inventory translations
    inventory: {
      lowStock: "مخزون منخفض",
      outOfStock: "نفاد المخزون",
      inStock: "متوفر في المخزون",
      overstock: "فائض المخزون",
      onOrder: "قيد الطلب",
      allocated: "مخصص",
      available: "متاح",
      decouplingPoints: "نقاط الفصل",
      configureDecouplingPoints: "تكوين نقاط الفصل",
      refresh: "تحديث",
      addDecouplingPoint: "إضافة نقطة فصل",
      decouplingNetwork: "عرض الشبكة",
      listView: "عرض القائمة",
      locationId: "معرف الموقع",
      type: "النوع",
      description: "الوصف",
      actions: "إجراءات",
      noDecouplingPoints: "لا توجد نقاط فصل",
      edit: "تعديل",
      delete: "حذف",
      confirmDelete: "تأكيد الحذف",
      success: "نجاح",
      decouplingPointDeleted: "تم حذف نقطة الفصل",
      decouplingPointSaved: "تم حفظ نقطة الفصل",
      networkVisualization: "تصور الشبكة",
      nodes: "النقاط",
      links: "الروابط",
      totalItems: "إجمالي العناصر",
      networkHelp: "مساعدة الشبكة",
      nodesDescription: "عقد الشبكة تمثل المواقع في سلسلة التوريد",
      linksDescription: "الروابط تمثل الاتصالات بين النقاط"
    },
    
    // Chart translations
    chartTitles: {
      bufferProfile: "ملف تعريف المخزون",
      demandVariability: "تغير الطلب"
    },
    
    // Add missing chart translations
    replenishment: "إعادة التزويد",
    netFlow: "التدفق الصافي",
    inventoryTrends: "اتجاهات المخزون",
    
    // Pagination translations 
    previous: "السابق",
    page: "صفحة",
    of: "من",
    perPage: "لكل صفحة",
    items: "عناصر",
    showing: "عرض",
    to: "إلى",
    
    // Add other required common translations
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    search: "بحث",
    filter: "تصفية",
    apply: "تطبيق",
    reset: "إعادة تعيين",
    modules: "الوحدات",
    skuCount: "عدد وحدات التخزين",
    accuracyLabel: "الدقة",
    pipelineValue: "قيمة خط الأنابيب",
    activeCampaigns: "الحملات النشطة",
    onTimeDelivery: "التسليم في الوقت المحدد",
    reportCount: "التقارير المتاحة",
    thisQuarter: "هذا الربع",
    fromLastMonth: "من الشهر الماضي",
    fromLastWeek: "من الأسبوع الماضي",
    viewDetails: "عرض التفاصيل",
    purchaseOrderCreated: "تم إنشاء أمر الشراء بنجاح",
    refresh: "تحديث",
    
    // Required by the interface
    warning: "تحذير",
    info: "معلومات",
    clear: "مسح",
    all: "الكل",
    none: "لا شيء",
    select: "اختيار",
    login: "تسجيل الدخول",
    register: "تسجيل",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    name: "الاسم",
    description: "الوصف",
    update: "تحديث"
  }
};
