"use client";

import { useState, useCallback, useMemo } from "react";

export interface FilterState {
  deliveryTime: [number, number];
  rating: number[];
  distanceRange: [number, number];
  features: {
    freeDelivery: boolean;
    openNow: boolean;
    offers: boolean;
    verified: boolean;
    topRated: boolean;
    previouslyOrdered: boolean; // I bought from them
  };
}

const defaultFilters: FilterState = {
  deliveryTime: [0, 60],
  rating: [],
  distanceRange: [0, 50],
  features: {
    freeDelivery: false,
    openNow: false,
    offers: false,
    verified: false,
    topRated: false,
    previouslyOrdered: false,
  },
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.rating.length > 0 ||
      filters.distanceRange[0] > 0 ||
      filters.distanceRange[1] < 10 ||
      Object.values(filters.features).some((v) => v === true)
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}

