"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Package, User, Phone, Upload, X, AlertCircle, Building2, HelpCircle } from "lucide-react";
import Image from "next/image";
import type { RouteSegment, ValidationErrors } from "../types/routeSegment";
import { PhoneInputField } from "@/components/Utils/PhoneInput";

interface SegmentDetailsFormProps {
  segment: RouteSegment;
  onUpdate: (updates: Partial<RouteSegment>) => void;
  errors: ValidationErrors;
  touched: { [key: string]: boolean };
  setTouched: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isArabic: boolean;
  currentUser: { name: string; phone: string };
}

type TabType = "pickup" | "dropoff" | "package";

export const SegmentDetailsForm: React.FC<SegmentDetailsFormProps> = ({
  segment,
  onUpdate,
  errors,
  touched,
  setTouched,
  isArabic,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("pickup");
  const [showHelp, setShowHelp] = useState<{ [key: string]: boolean }>({});
  const helpRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(helpRefs.current).forEach((key) => {
        if (helpRefs.current[key] && !helpRefs.current[key]?.contains(event.target as Node)) {
          setShowHelp((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleHelp = (key: string) => {
    setShowHelp((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "pickup",
      label: isArabic ? "الالتقاط" : "Pickup",
      icon: <MapPin className="w-4 h-4" />,
      color: "green",
    },
    {
      id: "dropoff",
      label: isArabic ? "التوصيل" : "Dropoff",
      icon: <Navigation className="w-4 h-4" />,
      color: "orange",
    },
    {
      id: "package",
      label: isArabic ? "الطرد" : "Package",
      icon: <Package className="w-4 h-4" />,
      color: "blue",
    },
  ];

  const updatePickupField = useCallback(
    (field: string, value: any) => {
      onUpdate({
        pickupPoint: {
          ...segment.pickupPoint,
          [field]: value,
        },
      });
    },
    [segment, onUpdate]
  );

  const updateDropoffField = useCallback(
    (field: string, value: any) => {
      onUpdate({
        dropoffPoint: {
          ...segment.dropoffPoint,
          [field]: value,
        },
      });
    },
    [segment, onUpdate]
  );

  const updatePackageField = useCallback(
    (field: string, value: any) => {
      onUpdate({
        packageDetails: {
          ...segment.packageDetails,
          [field]: value,
        },
      });
    },
    [segment, onUpdate]
  );

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "pickup" | "dropoff") => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert(isArabic ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت" : "File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert(isArabic ? "يرجى اختيار صورة فقط" : "Please select an image file only");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "pickup") {
          updatePickupField("buildingPhoto", reader.result as string);
        } else {
          updateDropoffField("buildingPhoto", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [isArabic, updatePickupField, updateDropoffField]
  );

  const handlePackageImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const currentImages = segment.packageDetails.images || [];
      if (currentImages.length + files.length > 5) {
        alert(isArabic ? "يمكنك رفع 5 صور كحد أقصى" : "Maximum 5 images allowed");
        return;
      }

      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(isArabic ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت" : "File size must be less than 5MB");
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert(isArabic ? "يرجى اختيار صورة فقط" : "Please select an image file only");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          updatePackageField("images", [...currentImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
    [segment.packageDetails.images, isArabic, updatePackageField]
  );

  const removePackageImage = useCallback(
    (index: number) => {
      const newImages = segment.packageDetails.images.filter((_, i) => i !== index);
      updatePackageField("images", newImages);
    },
    [segment.packageDetails.images, updatePackageField]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all
              border-b-2 -mb-px
              ${activeTab === tab.id
                ? tab.color === "green"
                  ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                  : tab.color === "orange"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                  : "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "pickup" && (
          <motion.div
            key="pickup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              {isArabic ? "تفاصيل نقطة الالتقاط" : "Pickup Point Details"}
            </h3>

            {/* Location Display */}
            {segment.pickupPoint.location && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {isArabic ? "الموقع المحدد" : "Selected Location"}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      {segment.pickupPoint.streetName && (
                        <p><span className="font-semibold">{isArabic ? "الشارع:" : "Street:"}</span> {segment.pickupPoint.streetName}</p>
                      )}
                      {segment.pickupPoint.areaName && (
                        <p><span className="font-semibold">{isArabic ? "المنطقة:" : "Area:"}</span> {segment.pickupPoint.areaName}</p>
                      )}
                      {segment.pickupPoint.city && (
                        <p><span className="font-semibold">{isArabic ? "المدينة:" : "City:"}</span> {segment.pickupPoint.city}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Info - Auto-filled from current user */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                {isArabic ? "معلومات المرسل" : "Sender Information"}
              </h4>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">{currentUser.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-mono">{currentUser.phone}</span>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  {isArabic ? "تفاصيل إضافية (رقم المبنى، المدخل، إلخ)" : "Additional Details (Building #, Entrance, etc.)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative" ref={(el) => { helpRefs.current["pickup-details"] = el; }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHelp("pickup-details");
                    }}
                    className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
                    aria-label={isArabic ? "مساعدة" : "Help"}
                  >
                    <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  </button>
                  <AnimatePresence>
                    {showHelp["pickup-details"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className={`absolute ${isArabic ? "left-0" : "right-0"} top-6 sm:top-7 z-50 w-40 sm:w-48 md:w-56 p-2 sm:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                          {isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
                        </p>
                        <p>
                          {isArabic
                            ? "أضف تفاصيل دقيقة مثل رقم المبنى والمدخل والطابق لمساعدة السائق على الوصول بسهولة."
                            : "Add precise details like building number, entrance, and floor to help the driver reach easily."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <textarea
                value={segment.pickupPoint.additionalDetails}
                onChange={(e) => updatePickupField("additionalDetails", e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, [`${segment.id}-pickup-details`]: true }))}
                rows={3}
                placeholder={isArabic ? "مثال: المبنى 5، البوابة 2" : "Example: Building 5, Gate 2"}
                className={`w-full px-4 py-3 text-sm rounded-xl border-2 ${
                  touched[`${segment.id}-pickup-details`] && errors[`${segment.id}-pickup-details`]
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
              />
              {touched[`${segment.id}-pickup-details`] && errors[`${segment.id}-pickup-details`] && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`${segment.id}-pickup-details`]}
                </p>
              )}
            </div>

            {/* Building Photo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "صورة المبنى (اختياري)" : "Building Photo (Optional)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, "pickup")}
                className="hidden"
                id={`pickup-photo-${segment.id}`}
              />
              {!segment.pickupPoint.buildingPhoto ? (
                <label
                  htmlFor={`pickup-photo-${segment.id}`}
                  className="block w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {isArabic ? "انقر لرفع صورة" : "Click to upload photo"}
                    </span>
                  </div>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <Image
                    src={segment.pickupPoint.buildingPhoto}
                    alt="Pickup Building"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => updatePickupField("buildingPhoto", null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "dropoff" && (
          <motion.div
            key="dropoff"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-500" />
              {isArabic ? "تفاصيل نقطة التوصيل" : "Dropoff Point Details"}
            </h3>

            {/* Location Display */}
            {segment.dropoffPoint.location && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {isArabic ? "الموقع المحدد" : "Selected Location"}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      {segment.dropoffPoint.streetName && (
                        <p><span className="font-semibold">{isArabic ? "الشارع:" : "Street:"}</span> {segment.dropoffPoint.streetName}</p>
                      )}
                      {segment.dropoffPoint.areaName && (
                        <p><span className="font-semibold">{isArabic ? "المنطقة:" : "Area:"}</span> {segment.dropoffPoint.areaName}</p>
                      )}
                      {segment.dropoffPoint.city && (
                        <p><span className="font-semibold">{isArabic ? "المدينة:" : "City:"}</span> {segment.dropoffPoint.city}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recipient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? "اسم المستلم" : "Recipient Name"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={segment.dropoffPoint.contactName}
                  onChange={(e) => updateDropoffField("contactName", e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, [`${segment.id}-dropoff-name`]: true }))}
                  placeholder={isArabic ? "أدخل الاسم" : "Enter name"}
                  className={`w-full px-4 py-3 text-sm rounded-xl border-2 ${
                    touched[`${segment.id}-dropoff-name`] && errors[`${segment.id}-dropoff-name`]
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
                />
                {touched[`${segment.id}-dropoff-name`] && errors[`${segment.id}-dropoff-name`] && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[`${segment.id}-dropoff-name`]}
                  </p>
                )}
              </div>

              <div>
                <PhoneInputField
                  label={isArabic ? "رقم الهاتف" : "Phone"}
                  value={segment.dropoffPoint.contactPhone}
                  onChange={(phone) => {
                    updateDropoffField("contactPhone", phone);
                    setTouched((prev) => ({ ...prev, [`${segment.id}-dropoff-phone`]: true }));
                  }}
                  isArabic={isArabic}
                  required={true}
                  name={`${segment.id}-dropoff-phone`}
                  error={touched[`${segment.id}-dropoff-phone`] && errors[`${segment.id}-dropoff-phone`] ? errors[`${segment.id}-dropoff-phone`] : undefined}
                  disabled={false}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  {isArabic ? "تفاصيل إضافية (رقم الشقة، الطابق، إلخ)" : "Additional Details (Apt #, Floor, etc.)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative" ref={(el) => { helpRefs.current["dropoff-details"] = el; }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHelp("dropoff-details");
                    }}
                    className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
                    aria-label={isArabic ? "مساعدة" : "Help"}
                  >
                    <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  </button>
                  <AnimatePresence>
                    {showHelp["dropoff-details"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className={`absolute ${isArabic ? "left-0" : "right-0"} top-6 sm:top-7 z-50 w-40 sm:w-48 md:w-56 p-2 sm:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                          {isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
                        </p>
                        <p>
                          {isArabic
                            ? "أضف تفاصيل دقيقة مثل رقم الشقة والطابق والمدخل لمساعدة السائق على الوصول بسهولة."
                            : "Add precise details like apartment number, floor, and entrance to help the driver reach easily."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <textarea
                value={segment.dropoffPoint.additionalDetails}
                onChange={(e) => updateDropoffField("additionalDetails", e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, [`${segment.id}-dropoff-details`]: true }))}
                rows={3}
                placeholder={isArabic ? "مثال: الشقة 12، الطابق 3" : "Example: Apt 12, Floor 3"}
                className={`w-full px-4 py-3 text-sm rounded-xl border-2 ${
                  touched[`${segment.id}-dropoff-details`] && errors[`${segment.id}-dropoff-details`]
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
              />
              {touched[`${segment.id}-dropoff-details`] && errors[`${segment.id}-dropoff-details`] && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`${segment.id}-dropoff-details`]}
                </p>
              )}
            </div>

            {/* Building Photo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "صورة المبنى (اختياري)" : "Building Photo (Optional)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, "dropoff")}
                className="hidden"
                id={`dropoff-photo-${segment.id}`}
              />
              {!segment.dropoffPoint.buildingPhoto ? (
                <label
                  htmlFor={`dropoff-photo-${segment.id}`}
                  className="block w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-500 dark:hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {isArabic ? "انقر لرفع صورة" : "Click to upload photo"}
                    </span>
                  </div>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <Image
                    src={segment.dropoffPoint.buildingPhoto}
                    alt="Dropoff Building"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => updateDropoffField("buildingPhoto", null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "package" && (
          <motion.div
            key="package"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              {isArabic ? "تفاصيل الطرد" : "Package Details"}
            </h3>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  {isArabic ? "وصف الطرد" : "Package Description"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative" ref={(el) => { helpRefs.current["package-description"] = el; }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHelp("package-description");
                    }}
                    className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
                    aria-label={isArabic ? "مساعدة" : "Help"}
                  >
                    <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  </button>
                  <AnimatePresence>
                    {showHelp["package-description"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className={`absolute ${isArabic ? "left-0" : "right-0"} top-6 sm:top-7 z-50 w-40 sm:w-48 md:w-56 p-2 sm:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                          {isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
                        </p>
                        <p>
                          {isArabic
                            ? "أضف وصفاً واضحاً للطرد مثل 'صندوق من الملابس' أو 'جهاز إلكتروني'."
                            : "Add a clear description like 'Box of clothes' or 'Electronic device'."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <input
                type="text"
                value={segment.packageDetails.description}
                onChange={(e) => updatePackageField("description", e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, [`${segment.id}-package-description`]: true }))}
                placeholder={isArabic ? "مثال: إلكترونيات - لابتوب" : "Example: Electronics - Laptop"}
                className={`w-full px-4 py-3 text-sm rounded-xl border-2 ${
                  touched[`${segment.id}-package-description`] && errors[`${segment.id}-package-description`]
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
              />
              {touched[`${segment.id}-package-description`] && errors[`${segment.id}-package-description`] && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`${segment.id}-package-description`]}
                </p>
              )}
            </div>

            {/* Weight & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? "الوزن (كجم)" : "Weight (kg)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={segment.packageDetails.weight}
                  onChange={(e) => updatePackageField("weight", e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, [`${segment.id}-package-weight`]: true }))}
                  placeholder="3"
                  className={`w-full px-4 py-3 text-sm rounded-xl border-2 ${
                    touched[`${segment.id}-package-weight`] && errors[`${segment.id}-package-weight`]
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
                />
                {touched[`${segment.id}-package-weight`] && errors[`${segment.id}-package-weight`] && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[`${segment.id}-package-weight`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? "الأبعاد (الطول×العرض×الارتفاع)" : "Dimensions (L×W×H)"}
                </label>
                <input
                  type="text"
                  value={segment.packageDetails.dimensions}
                  onChange={(e) => updatePackageField("dimensions", e.target.value)}
                  placeholder={isArabic ? "40×30×5 سم" : "40×30×5 cm"}
                  className="w-full px-4 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "تعليمات خاصة" : "Special Instructions"}
              </label>
              <textarea
                value={segment.packageDetails.specialInstructions}
                onChange={(e) => updatePackageField("specialInstructions", e.target.value)}
                rows={3}
                placeholder={isArabic ? "يرجى التعامل بحذر، قابل للكسر" : "Handle with care, fragile"}
                className="w-full px-4 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
              />
            </div>

            {/* Package Images */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? "صور الطرد (حتى 5 صور)" : "Package Photos (up to 5)"}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePackageImageUpload}
                className="hidden"
                id={`package-images-${segment.id}`}
              />
              {segment.packageDetails.images.length < 5 && (
                <label
                  htmlFor={`package-images-${segment.id}`}
                  className="block w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 mb-3"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {isArabic ? "انقر لرفع صور" : "Click to upload photos"}
                    </span>
                  </div>
                </label>
              )}
              {segment.packageDetails.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {segment.packageDetails.images.map((img, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <Image
                        src={img}
                        alt={`Package ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => removePackageImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {isArabic ? "خيارات الطرد" : "Package Options"}
              </h4>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <input
                  type="checkbox"
                  checked={segment.packageDetails.isFragile}
                  onChange={(e) => updatePackageField("isFragile", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {isArabic ? "قابل للكسر" : "Fragile"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isArabic ? "يحتاج معاملة حذرة" : "Requires careful handling"}
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <input
                  type="checkbox"
                  checked={segment.packageDetails.requiresRefrigeration}
                  onChange={(e) => updatePackageField("requiresRefrigeration", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {isArabic ? "يحتاج تبريد" : "Requires Refrigeration"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isArabic ? "يجب الحفاظ على البرودة" : "Must be kept cold"}
                  </p>
                </div>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

