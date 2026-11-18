"use server";

import { getActiveServicesService } from "@/lib/services/services.service";

export async function getActiveServicesAction() {
  return getActiveServicesService();
}