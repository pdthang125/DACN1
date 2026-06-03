"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/actions/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });
}