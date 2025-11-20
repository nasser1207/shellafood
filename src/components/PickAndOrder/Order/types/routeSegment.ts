/**
 * Route Segment Types for Multi-Direction Pick and Order
 * Each segment represents one pickup → dropoff → package flow
 */

export interface LocationPoint {
  id: string;
  type: "pickup" | "dropoff";
  label: string;
  location: { lat: number; lng: number } | null;
  streetName: string;
  areaName: string;
  city: string;
  building: string;
  additionalDetails: string;
  buildingPhoto: string | null;
  contactName: string;
  contactPhone: string;
}

export interface PackageDetails {
  description: string;
  weight: string;
  dimensions: string;
  specialInstructions: string;
  images: string[];
  video: string | null;
  isFragile: boolean;
  requiresRefrigeration: boolean;
}

export interface RouteSegment {
  id: string;
  pickupPoint: LocationPoint;
  dropoffPoint: LocationPoint;
  packageDetails: PackageDetails;
  status: "pending" | "in_progress" | "completed";
}

export interface VehicleOptions {
  truckType: string;
  cargoType?: string;
  isFragile?: boolean;
  requiresRefrigeration?: boolean;
  loadingEquipmentNeeded: boolean;
  deliveryPreference: "standard" | "express" | "scheduled";
  scheduledTime?: Date;
  additionalEquipment: {
    loadingRamp: boolean;
    straps: boolean;
    movingBlankets: boolean;
  };
}

export interface MotorbikeOptions {
  packageType: string;
  isDocuments: boolean;
  isExpress: boolean;
}

export interface MultiDirectionOrder {
  transportType: string;
  orderType: string;
  routeSegments: RouteSegment[];
  vehicleOptions: VehicleOptions | MotorbikeOptions;
  currentStep: number;
  currentSegmentIndex: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

