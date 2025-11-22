"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Check, ChevronDown, Search, X } from "lucide-react";

interface PhoneInputFieldProps {
  label: string;
  value: string;
  onChange: (phone: string) => void;
  isArabic?: boolean;
  required?: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  compact?: boolean;
}

interface Country {
  code: string;
  name: string;
  nameAr: string;
  dialCode: string;
  flag: string;
  maxDigits: number;
  minDigits: number;
}

// Comprehensive country phone configuration
const COUNTRIES: Country[] = [
  { code: "sa", name: "Saudi Arabia", nameAr: "السعودية", dialCode: "+966", flag: "🇸🇦", maxDigits: 12, minDigits: 12 },
  { code: "ae", name: "United Arab Emirates", nameAr: "الإمارات", dialCode: "+971", flag: "🇦🇪", maxDigits: 13, minDigits: 12 },
  { code: "eg", name: "Egypt", nameAr: "مصر", dialCode: "+20", flag: "🇪🇬", maxDigits: 13, minDigits: 12 },
  { code: "jo", name: "Jordan", nameAr: "الأردن", dialCode: "+962", flag: "🇯🇴", maxDigits: 13, minDigits: 12 },
  { code: "kw", name: "Kuwait", nameAr: "الكويت", dialCode: "+965", flag: "🇰🇼", maxDigits: 12, minDigits: 11 },
  { code: "qa", name: "Qatar", nameAr: "قطر", dialCode: "+974", flag: "🇶🇦", maxDigits: 12, minDigits: 11 },
  { code: "bh", name: "Bahrain", nameAr: "البحرين", dialCode: "+973", flag: "🇧🇭", maxDigits: 12, minDigits: 11 },
  { code: "om", name: "Oman", nameAr: "عمان", dialCode: "+968", flag: "🇴🇲", maxDigits: 12, minDigits: 11 },
  { code: "lb", name: "Lebanon", nameAr: "لبنان", dialCode: "+961", flag: "🇱🇧", maxDigits: 12, minDigits: 11 },
  { code: "iq", name: "Iraq", nameAr: "العراق", dialCode: "+964", flag: "🇮🇶", maxDigits: 13, minDigits: 12 },
  { code: "ye", name: "Yemen", nameAr: "اليمن", dialCode: "+967", flag: "🇾🇪", maxDigits: 13, minDigits: 12 },
  { code: "sy", name: "Syria", nameAr: "سوريا", dialCode: "+963", flag: "🇸🇾", maxDigits: 12, minDigits: 12 },
  { code: "ps", name: "Palestine", nameAr: "فلسطين", dialCode: "+970", flag: "🇵🇸", maxDigits: 13, minDigits: 12 },
  { code: "us", name: "United States", nameAr: "الولايات المتحدة", dialCode: "+1", flag: "🇺🇸", maxDigits: 12, minDigits: 11 },
  { code: "ca", name: "Canada", nameAr: "كندا", dialCode: "+1", flag: "🇨🇦", maxDigits: 12, minDigits: 11 },
  { code: "gb", name: "United Kingdom", nameAr: "بريطانيا", dialCode: "+44", flag: "🇬🇧", maxDigits: 13, minDigits: 12 },
  { code: "fr", name: "France", nameAr: "فرنسا", dialCode: "+33", flag: "🇫🇷", maxDigits: 12, minDigits: 11 },
  { code: "de", name: "Germany", nameAr: "ألمانيا", dialCode: "+49", flag: "🇩🇪", maxDigits: 13, minDigits: 12 },
  { code: "in", name: "India", nameAr: "الهند", dialCode: "+91", flag: "🇮🇳", maxDigits: 13, minDigits: 12 },
  { code: "cn", name: "China", nameAr: "الصين", dialCode: "+86", flag: "🇨🇳", maxDigits: 13, minDigits: 12 },
  { code: "jp", name: "Japan", nameAr: "اليابان", dialCode: "+81", flag: "🇯🇵", maxDigits: 13, minDigits: 12 },
  { code: "tr", name: "Turkey", nameAr: "تركيا", dialCode: "+90", flag: "🇹🇷", maxDigits: 13, minDigits: 12 },
  { code: "pk", name: "Pakistan", nameAr: "باكستان", dialCode: "+92", flag: "🇵🇰", maxDigits: 13, minDigits: 12 },
  { code: "bd", name: "Bangladesh", nameAr: "بنغلاديش", dialCode: "+880", flag: "🇧🇩", maxDigits: 14, minDigits: 13 },
];

/**
 * Expert-Level Phone Input Component
 * 
 * Premium design with mobile-first approach, smooth animations,
 * and comprehensive accessibility support.
 */
export default function PhoneInputField({
  label,
  value,
  onChange,
  isArabic = false,
  required = false,
  name = "phone",
  error,
  disabled = false,
  placeholder,
  className = "",
  showValidation = true,
  onValidationChange,
  compact = false,
}: PhoneInputFieldProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  // Enhanced dropdown positioning with visualViewport support
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const updatePosition = () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Use visualViewport for better mobile keyboard handling
        const viewport = (window as any).visualViewport || window;
        const viewportWidth = viewport.width || window.innerWidth;
        const viewportHeight = viewport.height || window.innerHeight;
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        const isMobile = viewportWidth < 640;
        const dropdownWidth = isMobile 
          ? (compact ? viewportWidth - 16 : viewportWidth - 32)
          : (compact ? 280 : 340);
        const dropdownHeight = (compact ? 200 : 240) + 60;
        
        let left: number | undefined;
        let right: number | undefined;
        
        if (isArabic) {
          // RTL: align to right edge of button
          const rightEdge = viewportWidth - rect.right;
          // Ensure dropdown doesn't go off-screen
          if (rightEdge + dropdownWidth > viewportWidth) {
            // Shift left to fit within viewport
            right = Math.max(8, viewportWidth - dropdownWidth - 8);
          } else if (rightEdge < 8) {
            // If button is too close to left edge, align to left
            right = viewportWidth - dropdownWidth - 8;
          } else {
            right = rightEdge;
          }
        } else {
          // LTR: align to left edge of button
          const leftEdge = rect.left;
          // Ensure dropdown doesn't go off-screen
          if (leftEdge + dropdownWidth > viewportWidth) {
            // Shift right to fit within viewport
            left = Math.max(8, viewportWidth - dropdownWidth - 8);
          } else if (leftEdge < 8) {
            // If button is too close to left edge, align to left
            left = 8;
          } else {
            left = leftEdge;
          }
        }
        
        // Calculate vertical position
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        let top: number;
        
        // Open below if there's enough space, otherwise open above
        if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
          top = rect.bottom + 4;
        } else {
          // Open above the button
          top = rect.top - dropdownHeight - 4;
        }
        
        // Ensure dropdown doesn't go off-screen vertically
        if (top + dropdownHeight > viewportHeight) {
          top = Math.max(8, viewportHeight - dropdownHeight - 8);
        }
        if (top < 8) {
          top = 8;
        }
        
        setDropdownPosition({ top, ...(left !== undefined ? { left } : {}), ...(right !== undefined ? { right } : {}) });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      if ((window as any).visualViewport) {
        (window as any).visualViewport.addEventListener('resize', updatePosition);
      }

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        if ((window as any).visualViewport) {
          (window as any).visualViewport.removeEventListener('resize', updatePosition);
        }
      };
    } else {
      setDropdownPosition(null);
    }
  }, [isDropdownOpen, isArabic, compact]);

  // Handle click outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      const button = (target instanceof Element && target.closest('[data-phone-input-button]'));
      // Don't close if clicking on modal backdrop (let modal handle it)
      const modalBackdrop = (target instanceof Element && target.closest('[data-modal-backdrop]'));
      
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !button && !modalBackdrop) {
        setIsDropdownOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
      searchInputRef.current?.focus();
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [isDropdownOpen]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.nameAr.includes(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Validate phone number
  const isValid = useMemo(() => {
    if (!value) return false;
    const digitsOnly = value.replace(/\D/g, "");
    const isValidLength = digitsOnly.length >= selectedCountry.minDigits && 
                          digitsOnly.length <= selectedCountry.maxDigits;
    const startsWithDialCode = value.startsWith(selectedCountry.dialCode);
    return isValidLength && startsWithDialCode;
  }, [value, selectedCountry]);

  useEffect(() => {
    if (onValidationChange && value) {
      onValidationChange(isValid);
    }
  }, [isValid, value, onValidationChange]);

  // Handle phone change
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let phone = e.target.value;
      phone = phone.replace(/[^\d+]/g, "");
      
      if (!phone.startsWith(selectedCountry.dialCode)) {
        phone = selectedCountry.dialCode + phone.replace(/^\+?\d+/, "");
      }

      const digitsOnly = phone.replace(/\D/g, "");

      if (digitsOnly.length > selectedCountry.maxDigits) {
        const dialCodeDigits = selectedCountry.dialCode.replace(/\D/g, "");
        const maxLocalDigits = selectedCountry.maxDigits - dialCodeDigits.length;
        const localDigits = digitsOnly.slice(dialCodeDigits.length).slice(0, maxLocalDigits);
        phone = selectedCountry.dialCode + localDigits;
      }

      onChange(phone);
    },
    [onChange, selectedCountry]
  );

  // Handle country selection
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    
    const digitsOnly = value.replace(/\D/g, "");
    const currentDialCode = selectedCountry.dialCode.replace(/\D/g, "");
    
    let newDigits = digitsOnly;
    if (digitsOnly.startsWith(currentDialCode)) {
      newDigits = digitsOnly.slice(currentDialCode.length);
    }
    
    const newPhone = country.dialCode + newDigits;
    onChange(newPhone);
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [value, selectedCountry, onChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleCountrySelect(filteredCountries[highlightedIndex]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setHighlightedIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setHighlightedIndex(filteredCountries.length - 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen, filteredCountries, highlightedIndex, handleCountrySelect]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.querySelector(`[data-country-index="${highlightedIndex}"]`);
      item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [highlightedIndex]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setHighlightedIndex(-1);
    searchInputRef.current?.focus();
  }, []);

  const showSuccess = showValidation && isValid && value && !error && !isFocused;
  const showError = error || (showValidation && value && !isValid && !isFocused);
  const errorId = `${name}-error`;

  // Calculate remaining digits
  const digitsOnly = value.replace(/\D/g, "");
  const dialCodeDigits = selectedCountry.dialCode.replace(/\D/g, "");
  const localDigits = digitsOnly.slice(dialCodeDigits.length);
  const maxLocalDigits = selectedCountry.maxDigits - dialCodeDigits.length;
  const remainingDigits = maxLocalDigits - localDigits.length;
  const showDigitCounter = isFocused && value && !showError && remainingDigits >= 0;

  // Design tokens
  const inputHeight = compact ? 'h-11' : 'h-12';
  const inputPadding = compact ? 'px-3' : 'px-4';
  const inputTextSize = compact ? 'text-sm' : 'text-[15px]';
  const selectorWidth = compact ? 'min-w-[56px]' : 'min-w-[72px] sm:min-w-[84px]';
  const selectorPadding = compact ? 'px-2.5' : 'px-3 sm:px-4';

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`} dir={isArabic ? "rtl" : "ltr"}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-slate-700 dark:text-slate-300 ${isArabic ? 'text-right' : 'text-left'} block`}
        >
          {label}
          {required && (
            <span className={`${isArabic ? 'mr-1' : 'ml-1'} text-red-500 dark:text-red-400`} aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div className="relative w-full">
        <div className={`
          flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} 
          ${compact ? 'rounded-lg' : 'rounded-xl'} 
          overflow-hidden border-2 transition-all duration-200 ease-out
          ${error 
            ? 'border-red-300 dark:border-red-800 shadow-sm shadow-red-100 dark:shadow-red-900/20' 
            : isFocused || isDropdownOpen
            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/15 dark:ring-blue-400/20 shadow-lg shadow-blue-100 dark:shadow-blue-900/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
          }
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}>
          {/* Country Selector */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  setIsDropdownOpen(!isDropdownOpen);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                  e.preventDefault();
                  setIsDropdownOpen(!isDropdownOpen);
                }
              }}
              disabled={disabled}
              data-phone-input-button
              className={`
                flex items-center justify-center gap-1.5 sm:gap-2
                ${selectorPadding} ${selectorWidth} ${inputHeight}
                ${isArabic ? (compact ? 'rounded-r-lg' : 'rounded-r-xl') : (compact ? 'rounded-l-lg' : 'rounded-l-xl')}
                ${isArabic ? 'border-l-0' : 'border-r-0'}
                bg-slate-50 dark:bg-slate-900 border-r-2 border-slate-200 dark:border-slate-700
                transition-all duration-200 ease-out
                hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:focus-visible:ring-blue-400/30 focus-visible:ring-offset-2
                touch-manipulation
              `}
              aria-label={isArabic ? `اختر الدولة، المحددة حاليًا ${selectedCountry.nameAr} ${selectedCountry.dialCode}` : `Select country, currently ${selectedCountry.name} ${selectedCountry.dialCode}`}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className={`${compact ? 'text-xl' : 'text-2xl'} leading-none`} role="img" aria-hidden="true">
                {selectedCountry.flag}
              </span>
              {!compact && (
                <span className={`hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300`}>
                  {selectedCountry.dialCode}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ease-out ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && dropdownPosition && typeof window !== 'undefined' ? createPortal(
              <div 
                ref={dropdownRef}
                className={`
                  fixed z-[999999] rounded-xl border-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700
                  shadow-xl dark:shadow-2xl
                  ${compact 
                    ? 'w-[calc(100vw-1rem)] sm:w-[280px]' 
                    : 'w-[calc(100vw-2rem)] sm:w-[340px]'
                  }
                  max-w-[calc(100vw-1rem)]
                  animate-in fade-in slide-in-from-top-1 duration-200
                  backdrop-blur-sm bg-white/95 dark:bg-slate-800/95
                `}
                role="listbox"
                aria-label={isArabic ? "قائمة الدول" : "Country list"}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  top: `${dropdownPosition.top}px`,
                  ...(dropdownPosition.left !== undefined ? { left: `${dropdownPosition.left}px` } : {}),
                  ...(dropdownPosition.right !== undefined ? { right: `${dropdownPosition.right}px` } : {}),
                  maxHeight: `${Math.min((window as any).visualViewport?.height || window.innerHeight, (compact ? 200 : 240) + 60)}px`,
                }}
              >
                {/* Search Box */}
                <div className="p-3 sm:p-4 border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50 sticky top-0 z-10">
                  <div className="relative">
                    <Search className={`absolute ${isArabic ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500 pointer-events-none`} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setHighlightedIndex(-1);
                      }}
                      placeholder={isArabic ? "ابحث عن دولة..." : "Search country..."}
                      className={`
                        w-full h-11 sm:h-12 text-sm sm:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                        ${isArabic ? 'pr-11 sm:pr-12 pl-11 sm:pl-12' : 'pl-11 sm:pl-12 pr-11 sm:pr-12'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400
                        transition-all duration-200
                      `}
                      dir={isArabic ? "rtl" : "ltr"}
                      aria-label={isArabic ? "بحث عن دولة" : "Search country"}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSearch();
                        }}
                        className={`
                          absolute ${isArabic ? 'left-2.5 sm:left-3' : 'right-2.5 sm:right-3'} top-1/2 -translate-y-1/2 
                          p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                          hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200
                          touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center
                        `}
                        aria-label={isArabic ? "مسح البحث" : "Clear search"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Countries List */}
                <div className={`overflow-y-auto ${compact ? 'max-h-[200px]' : 'max-h-[240px]'} custom-scrollbar`}>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, index) => {
                      const isSelected = selectedCountry.code === country.code;
                      const isHighlighted = highlightedIndex === index;
                      
                      return (
                        <button
                          key={country.code}
                          type="button"
                          data-country-index={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCountrySelect(country);
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`
                            w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5
                            transition-all duration-150 ease-out
                            ${compact ? 'min-h-[48px]' : 'min-h-[56px]'}
                            ${isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400'
                              : isHighlighted
                              ? 'bg-slate-50 dark:bg-slate-700/50 border-l-4 border-transparent'
                              : 'bg-transparent border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'
                            }
                            active:bg-slate-100 dark:active:bg-slate-700 active:scale-[0.98]
                            focus:outline-none
                            touch-manipulation
                          `}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span className={`${compact ? 'text-2xl' : 'text-3xl'} flex-shrink-0`} role="img" aria-hidden="true">
                            {country.flag}
                          </span>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm sm:text-base font-medium truncate text-slate-900 dark:text-slate-100">
                              {isArabic ? country.nameAr : country.name}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                              {country.dialCode}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 sm:p-10 text-center">
                      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 opacity-50">🔍</div>
                      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                        {isArabic ? "لا توجد نتائج" : "No results found"}
                      </p>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            ) : null}
          </div>

          {/* Phone Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="tel"
              id={name}
              name={name}
              value={value}
              onChange={handlePhoneChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              required={required}
              autoComplete="tel"
              placeholder={placeholder || (isArabic ? "أدخل رقم الهاتف" : "Enter phone number")}
              className={`
                w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                transition-all duration-200 ease-out
                ${inputHeight} ${inputPadding} ${inputTextSize}
                ${isArabic 
                  ? (compact ? 'rounded-l-lg text-right pr-10 sm:pr-12' : 'rounded-l-xl text-right pr-12 sm:pr-14') 
                  : (compact ? 'rounded-r-lg text-left pl-2 sm:pl-3 pr-10 sm:pr-12' : 'rounded-r-xl text-left pl-3 sm:pl-4 pr-12 sm:pr-14')
                }
                ${isArabic ? 'border-r-0' : 'border-l-0'}
                disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none
                font-medium tracking-[0.5px]
              `}
              aria-invalid={showError ? "true" : "false"}
              aria-describedby={showError ? errorId : undefined}
              aria-required={required}
              dir="ltr"
            />

            {/* Validation Icons */}
            {showSuccess && (
              <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}>
                <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30 shadow-sm ring-2 ring-green-200 dark:ring-green-800 animate-in zoom-in duration-300">
                  <Check className={`${compact ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} text-green-600 dark:text-green-400`} />
                </div>
              </div>
            )}
            {showError && (
              <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}>
                <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/30 shadow-sm ring-2 ring-red-200 dark:ring-red-800 animate-in zoom-in duration-300">
                  <AlertCircle className={`${compact ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} text-red-600 dark:text-red-400`} />
                </div>
              </div>
            )}
            {/* Digit Counter */}
            {showDigitCounter && !showSuccess && !showError && (
              <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}>
                <span className={`
                  text-xs sm:text-sm font-semibold px-1.5 py-0.5 rounded-md
                  ${remainingDigits < 3 && remainingDigits > 0
                    ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20' 
                    : remainingDigits === 0
                    ? 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'
                  }
                `}>
                  {remainingDigits >= 0 ? remainingDigits : 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {showError && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className={`
            flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-red-600 dark:text-red-400
            ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}
            animate-in fade-in slide-in-from-top-1 duration-200
            bg-red-50 dark:bg-red-900/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl
            border border-red-200 dark:border-red-800/50
          `}
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">
            {error || (
              isArabic 
                ? `الرجاء إدخال رقم هاتف صحيح (${selectedCountry.nameAr}: ${selectedCountry.dialCode} + ${selectedCountry.maxDigits - selectedCountry.dialCode.replace(/\D/g, "").length} أرقام)`
                : `Please enter a valid phone number (${selectedCountry.name}: ${selectedCountry.dialCode} + ${selectedCountry.maxDigits - selectedCountry.dialCode.replace(/\D/g, "").length} digits)`
            )}
          </span>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.5)'};
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(100, 116, 139, 0.4)' : 'rgba(148, 163, 184, 0.4)'};
          border-radius: 3px;
          transition: background 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(100, 116, 139, 0.6)' : 'rgba(148, 163, 184, 0.6)'};
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-from-top {
          from { 
            opacity: 0;
            transform: translateY(-4px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoom-in {
          from { 
            opacity: 0;
            transform: scale(0);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation: fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-in-from-top-1 {
          animation: slide-in-from-top 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zoom-in {
          animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Touch-friendly for mobile */
        @media (hover: none) {
          button {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
