"use client";

import { Suspense, useEffect } from "react";
import { notFound } from "next/navigation";

import CheckoutForm from "@/components/CheckoutForm";
import { useLocationsQuery, useVehicleQuery } from "@/lib/query/hooks";

function CheckoutSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="h-48 rounded-[10px] bg-white dark:bg-white"
          />
        ))}
      </div>
      <div className="h-80 w-full rounded-[10px] bg-white lg:w-[340px] dark:bg-white" />
    </div>
  );
}

export default function CheckoutPageClient({ slug }: { slug: string }) {
  const {
    data: vehicle,
    isPending: vehiclePending,
    isError: vehicleError,
  } = useVehicleQuery(slug);
  const {
    data: locations = [],
    isPending: locationsPending,
    isError: locationsError,
  } = useLocationsQuery();

  useEffect(() => {
    if (!vehiclePending && !locationsPending && (vehicleError || locationsError || !vehicle)) {
      notFound();
    }
  }, [vehiclePending, locationsPending, vehicleError, locationsError, vehicle]);

  if (vehiclePending || locationsPending) {
    return (
      <div className="checkout-light w-full px-6 py-8">
        <CheckoutSkeleton />
      </div>
    );
  }

  if (vehicleError || locationsError || !vehicle) {
    return null;
  }

  return (
    <div className="checkout-light w-full px-6 py-8">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutForm vehicle={vehicle} locations={locations} />
      </Suspense>
    </div>
  );
}
