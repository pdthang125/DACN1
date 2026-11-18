"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveServicesAction } from "@/lib/actions/services";

export function useActiveServices() {
  return useQuery({
    queryKey: ["activeServices", "booking"],
    queryFn: getActiveServicesAction,
  });
}
