
"use client";

import { useContext } from "react";
import { LocaleContext, LocaleContextType } from "@/components/providers/locale-provider";

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
