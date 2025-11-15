"use client";

import { useState, useCallback, useMemo } from "react";

export interface FilterState {
  deliveryTime: [number, number];
  rating: number[];
  priceRange: [number, number];
  features: {
    freeDelivery: boolean;
    openNow: boolean;
    offers: boolean;
    verified: boolean;
    topRated: boolean;
  };
}

const defaultFilters: FilterState = {
  deliveryTime: [0, 60],
  rating: [],
  priceRange: [0, 500],
  features: {
    freeDelivery: false,
    openNow: false,
    offers: false,
    verified: false,
    topRated: false,
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
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 500 ||
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

