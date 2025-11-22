/**
 * AutoSelectConfirmModal Component (Redesigned)
 * Full-height sheet modal for driver confirmation with modern design
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  Phone,
  Truck,
  Bike,
  CheckCircle2,
  Clock,
  Award,
  Shield,
  MessageCircle,
  UserCircle,
  Navigation,
  Info,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import CountUp from "react-countup";

// Simple animation variant
const slideFromBottomVariants: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

interface Driver {
  id: string;
  name: string;
  rating: number;
  completedTrips: number;
  vehicleType: string;
  vehicleModel: string;
  licensePlate: string;
  phone: string;
  distance: string;
  estimatedArrival: string;
  avatar: string;
}

interface PriceBreakdown {
  basePrice: number;
  distanceCharge: number;
  extraCharges: { label: string; amount: number }[];
  total: number;
}

interface AutoSelectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driver: Driver;
  priceBreakdown: PriceBreakdown;
  isArabic: boolean;
  isMotorbike: boolean;
}

export default function AutoSelectConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  driver,
  priceBreakdown,
  isArabic,
  isMotorbike,
}: AutoSelectConfirmModalProps) {
  const router = useRouter();
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const VehicleIcon = isMotorbike ? Bike : Truck;

  const handleViewDetails = () => {
    sessionStorage.setItem("autoSelectModalOpen", "true");
    sessionStorage.setItem("autoSelectModalDriverId", driver.id);
    router.push(`/driver/${driver.id}?fromModal=true`);
  };

  const handleChat = () => {
    sessionStorage.setItem("autoSelectModalOpen", "true");
    sessionStorage.setItem("autoSelectModalDriverId", driver.id);
    router.push(`/driver/${driver.id}/chat?fromModal=true`);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConfirm();
  };

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <motion.div
              variants={slideFromBottomVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-lg max-h-[90vh] overflow-hidden flex flex-col"
              style={{
                paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2 sm:hidden">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label={isArabic ? "إغلاق" : "Close"}
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="text-center pr-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full mb-2">
                    <span className="text-xs font-semibold">
                      {isArabic ? "أفضل سائق" : "Best Match"}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isArabic ? "تأكيد الاختيار" : "Confirm Selection"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isArabic
                      ? "راجع تفاصيل السائق والسعر"
                      : "Review driver details and pricing"}
                  </p>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-5 space-y-5">
                  {/* Driver Card */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">

                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-white dark:border-gray-800">
                          <Image
                            src={driver.avatar}
                            alt={driver.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* Rating Badge */}
                        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-yellow-500 rounded text-white flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-white" />
                          <span className="text-xs font-semibold">
                            {driver.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {driver.name}
                          </h3>
                          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Award className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-bold text-gray-900 dark:text-white">
                              {driver.completedTrips.toLocaleString()}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                              {isArabic ? "رحلة" : "trips"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Navigation className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-bold text-gray-900 dark:text-white">
                              {driver.distance}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                              {isArabic ? "بعيد" : "away"}
                            </span>
                          </div>
                        </div>

                        {/* Vehicle Chip */}
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm">
                          <VehicleIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {driver.vehicleModel}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            • {driver.licensePlate}
                          </span>
                        </div>

                        {/* Arrival Time */}
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {isArabic ? "الوصول خلال:" : "Arrives in:"}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {driver.estimatedArrival}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleViewDetails}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <UserCircle className="w-3.5 h-3.5" />
                        <span>{isArabic ? "التفاصيل" : "Details"}</span>
                      </button>
                      <button
                        onClick={handleChat}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{isArabic ? "محادثة" : "Chat"}</span>
                      </button>
                      <a
                        href={`tel:${driver.phone}`}
                        className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPriceDetails(!showPriceDetails)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isArabic ? "السعر الإجمالي" : "Total Price"}
                        </p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          <CountUp
                            end={priceBreakdown.total}
                            duration={1}
                            decimals={2}
                            preserveValue
                          />
                          <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">
                            {isArabic ? "ريال" : "SAR"}
                          </span>
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: showPriceDetails ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {showPriceDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                            {/* Base Price */}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {isArabic ? "السعر الأساسي" : "Base Price"}
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {priceBreakdown.basePrice.toFixed(2)}{" "}
                                {isArabic ? "ريال" : "SAR"}
                              </span>
                            </div>

                            {/* Distance Charge */}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {isArabic ? "رسوم المسافة" : "Distance Charge"}
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {priceBreakdown.distanceCharge.toFixed(2)}{" "}
                                {isArabic ? "ريال" : "SAR"}
                              </span>
                            </div>

                            {/* Extra Charges */}
                            {priceBreakdown.extraCharges.map((charge, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-600 dark:text-gray-400">
                                  {charge.label}
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {charge.amount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
                                </span>
                              </div>
                            ))}

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {isArabic ? "الإجمالي" : "Total"}
                                </span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                  {priceBreakdown.total.toFixed(2)}{" "}
                                  {isArabic ? "ريال" : "SAR"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Info Note */}
                    <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <p>
                        {isArabic
                          ? "السعر النهائي قد يختلف بناءً على الطريق الفعلي والوقت"
                          : "Final price may vary based on actual route and time"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-white dark:bg-gray-800">
                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isArabic ? "جاري التأكيد..." : "Confirming..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isArabic ? "تأكيد الطلب" : "Confirm Order"}</span>
                    </>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  onClick={onClose}
                  disabled={isConfirming}
                  className="w-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
