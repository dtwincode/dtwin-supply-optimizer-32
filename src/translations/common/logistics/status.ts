
export const statusTranslations = {
  inTransit: {
    en: "In Transit",
    ar: "قيد النقل"
  },
  delivered: {
    en: "Delivered",
    ar: "تم التوصيل"
  },
  processing: {
    en: "Processing",
    ar: "قيد المعالجة"
  },
  outForDelivery: {
    en: "Out for Delivery",
    ar: "خارج للتسليم"
  },
  exception: {
    en: "Exception",
    ar: "استثناء"
  },
  delayedEta: {
    en: "Delayed (3h+)",
    ar: "متأخر (3 ساعات+)"
  },
  // Remove these duplicate properties as they are already in the status object
  // planned, inProgress, and completed are now only inside the status object
  statusLabel: {
    en: "Status",
    ar: "الحالة"
  },
  // The status field needs to match the interface exactly
  status: {
    planned: {
      en: "Planned",
      ar: "مخطط"
    },
    inProgress: {
      en: "In Progress",
      ar: "قيد التنفيذ"
    },
    completed: {
      en: "Completed",
      ar: "مكتمل"
    }
  },
  pending: {
    en: "Pending",
    ar: "معلق"
  }
};
