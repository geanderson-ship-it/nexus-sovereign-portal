"use client";

import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";
import React, { ReactNode } from "react";
import outputs from "@/../amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });

if (typeof window !== "undefined") {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({
      secure: window.location.protocol === "https:",
      path: "/",
      sameSite: "lax",
    })
  );
}

export function AmplifyProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
