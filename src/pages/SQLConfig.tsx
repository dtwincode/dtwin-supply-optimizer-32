import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
// assuming i18next/react-i18next setup

interface ValidationLog {
  id: string;
  module: string;
  file_name: string;
  row_count: number;
  error_count: number;
  status: string;
  created_at: string;
}

export default function SQLConfig() {
  const { toast } = useToast();
  const { t } = useI18n();

  const {
    data: logs,
    error,
    isError,
  } = useQuery({
    queryKey: ["validationLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_validation_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as ValidationLog[];
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        variant: "destructive",
        title: t("sqlConfig.errorLoading"),
        description:
          error instanceof Error ? error.message : t("common.unknownError"),
      });
    }
  }, [error, isError, toast, t]);

  if (isError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="p-6">
            <div className="text-red-500">
              {t("sqlConfig.errorLoading")}:{" "}
              {error instanceof Error
                ? error.message
                : t("common.unknownError")}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{t("sqlConfig.title")}</h1>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t("sqlConfig.recentLogs")}
            </h2>
            {logs ? (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.file_name}</span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          log.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.status === "completed"
                          ? t("sqlConfig.completed")
                          : t("sqlConfig.failed")}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        {t("sqlConfig.module")}: {log.module}
                      </p>
                      <p>
                        {t("sqlConfig.rows")}: {log.row_count}
                      </p>
                      {log.error_count > 0 && (
                        <p className="text-red-500">
                          {t("sqlConfig.errors")}: {log.error_count}
                        </p>
                      )}
                      <p>
                        {t("sqlConfig.date")}:{" "}
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">{t("sqlConfig.loading")}</div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import DashboardLayout from "@/components/DashboardLayout";
// import { Card } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { useQuery } from "@tanstack/react-query";

// interface ValidationLog {
//   id: string;
//   module: string;
//   file_name: string;
//   row_count: number;
//   error_count: number;
//   status: string;
//   created_at: string;
// }

// export default function SQLConfig() {
//   const { toast } = useToast();

//   const { data: logs, error, isError } = useQuery({
//     queryKey: ['validationLogs'],
//     queryFn: async () => {
//       console.log("Fetching validation logs...");
//       const { data, error } = await supabase
//         .from('data_validation_logs')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(5);

//       if (error) {
//         console.error("Supabase error:", error);
//         throw error;
//       }

//       console.log("Fetched logs:", data);
//       return data as ValidationLog[];
//     }
//   });

//   // Handle errors with useEffect instead of relying on onError
//   useEffect(() => {
//     if (isError && error) {
//       console.error("Query error:", error);
//       toast({
//         variant: "destructive",
//         title: "Error fetching logs",
//         description: error instanceof Error ? error.message : "Unknown error"
//       });
//     }
//   }, [error, isError, toast]);

//   if (isError) {
//     return (
//       <DashboardLayout>
//         <div className="p-6">
//           <Card className="p-6">
//             <div className="text-red-500">
//               Error loading validation logs: {error instanceof Error ? error.message : "Unknown error"}
//             </div>
//           </Card>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         <Card className="p-6">
//           <h1 className="text-2xl font-bold mb-4">SQL Configuration</h1>
//           <div className="space-y-4">
//             <h2 className="text-xl font-semibold">Recent Validation Logs</h2>
//             {logs ? (
//               <div className="space-y-2">
//                 {logs.map((log) => (
//                   <div key={log.id} className="p-4 bg-muted rounded-lg">
//                     <div className="flex justify-between">
//                       <span className="font-medium">{log.file_name}</span>
//                       <span className={`px-2 py-1 rounded text-sm ${
//                         log.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {log.status}
//                       </span>
//                     </div>
//                     <div className="mt-2 text-sm text-muted-foreground">
//                       <p>Module: {log.module}</p>
//                       <p>Rows: {log.row_count}</p>
//                       {log.error_count > 0 && (
//                         <p className="text-red-500">Errors: {log.error_count}</p>
//                       )}
//                       <p>Date: {new Date(log.created_at).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-4">Loading validation logs...</div>
//             )}
//           </div>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }
