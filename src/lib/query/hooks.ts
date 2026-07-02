"use client";

import { useQuery } from "@tanstack/react-query";

import { useLockedMutation } from "@/lib/use-locked-mutation";

import {
  createReservation,
  getAllVehicles,
  getLocations,
  getLookups,
  getVehicle,
  getVehicleSchedule,
} from "@/lib/api/public";
import { queryKeys } from "@/lib/query/keys";
import type { CreateReservationPayload, Vehicle } from "@/types/api";

export function useAllVehiclesQuery(initialData?: Vehicle[]) {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: getAllVehicles,
    ...(initialData?.length
      ? {
          initialData,
          staleTime: 60_000,
        }
      : {}),
  });
}

export function useVehicleQuery(slug: string, initialData?: Vehicle) {
  return useQuery({
    queryKey: queryKeys.vehicle(slug),
    queryFn: async () => {
      const response = await getVehicle(slug);
      return response.data;
    },
    enabled: Boolean(slug),
    ...(initialData
      ? {
          initialData,
          staleTime: 60_000,
        }
      : {}),
  });
}

export function useVehicleScheduleQuery(vehicleId: number) {
  return useQuery({
    queryKey: queryKeys.vehicleSchedule(vehicleId),
    queryFn: () => getVehicleSchedule(vehicleId),
    enabled: vehicleId > 0,
    staleTime: 60_000,
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
  return useLockedMutation({
    mutationFn: (payload: CreateReservationPayload) => createReservation(payload),
  });
}
