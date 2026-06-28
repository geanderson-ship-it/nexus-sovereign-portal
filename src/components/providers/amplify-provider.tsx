"use client";

import { Amplify } from "aws-amplify";
import React, { ReactNode } from "react";
import outputs from "@/../amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });

export function AmplifyProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
