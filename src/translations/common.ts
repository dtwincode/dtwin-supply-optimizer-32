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
      errorLoading: "Error loading inventory data"
    },
    
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
      errorLoading: "خطأ في تحميل بيانات المخزون"
    },
    
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
