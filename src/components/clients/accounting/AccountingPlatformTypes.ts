
import { Client } from "@/types/client";
import React from "react";

export interface AccountingPlatform {
  id: string;
  name: string;
  logo: React.ComponentType;
  available: boolean;
}

export interface CustomPlatform {
  id: string;
  name: string;
}

export interface AccountingSyncProps {
  client: Client;
}
