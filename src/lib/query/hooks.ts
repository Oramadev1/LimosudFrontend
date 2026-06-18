"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createReservation,
  getAllVehicles,
  getLocations,
  getLookups,
  getVehicle,
} from "@/lib/api/public";
import { queryKeys } from "@/lib/query/keys";
import type { CreateReservationPayload } from "@/types/api";

export function useAllVehiclesQuery() {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: getAllVehicles,
  });
}

export function useVehicleQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.vehicle(slug),
    queryFn: async () => {
      const response = await getVehicle(slug);
      return response.data;
    },
    enabled: Boolean(slug),
  });
}

export function useLocationsQuery() {
  return useQuery({
    queryKey: queryKeys.locations,
    queryFn: async () => {
      const response = await getLocations();
      return response.data;
    },
  });
}

export function useLookupsQuery() {
  return useQuery({
    queryKey: queryKeys.lookups,
    queryFn: getLookups,
    staleTime: 10 * 60_000,
  });
}

export function useCreateReservationMutation() {
  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => createReservation(payload),
  });
}
