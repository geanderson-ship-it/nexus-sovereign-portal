"use client";

import { Amplify } from "aws-amplify";
import React, { ReactNode } from "react";

// Em um ambiente real do Amplify Gen 2, este arquivo é gerado automaticamente.
// Durante a migração, o Amplify Hosting injetará as configurações necessárias.
try {
  // @ts-ignore - O arquivo é gerado dinamicamente pelo Amplify CLI/Hosting
  const outputs = require("@/../amplify_outputs.json");
  Amplify.configure(outputs);
} catch (e) {
  console.warn("Amplify configuration file (amplify_outputs.json) not found. This is expected if the backend is not yet deployed.");
}

export function AmplifyProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
