# OrderSummaryPage Component - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Props & Interfaces](#props--interfaces)
4. [State Management](#state-management)
5. [Sub-Components](#sub-components)
6. [Data Flow](#data-flow)
7. [Features & Functionality](#features--functionality)
8. [UI Sections](#ui-sections)
9. [User Interactions](#user-interactions)
10. [Dependencies](#dependencies)

---

## Overview

**OrderSummaryPage** is a comprehensive React component that serves as the final review step before driver selection in the Pick & Order feature. It displays a complete summary of the order details, validates completion status, and provides two driver selection methods (auto-select or manual).

### Key Characteristics
- **Bilingual Support**: Full Arabic (RTL) and English (LTR) support
- **Transport Types**: Supports both Motorbike and Truck orders
- **Order Types**: Handles One-Way and Multi-Direction orders
- **Data Format Compatibility**: Supports both old (LocationPoint[]) and new (RouteSegment[]) data formats
- **Responsive Design**: Mobile-first with desktop optimizations
- **Dark Mode**: Full dark mode support

---

## Component Architecture

### Main Component Structure
```
OrderSummaryPage
├── Loading State
├── Error State (No Data)
├── Main Content
│   ├── Header Section
│   ├── Notification Toast
│   ├── Main Grid Layout
│   │   ├── Left Column (Main Details)
│   │   │   ├── Sender Info Card
│   │   │   ├── Location Points (One-Way)
│   │   │   ├── Route Segments (Multi-Direction)
│   │   │   └── Package Details
│   │   └── Right Column (Sidebar)
│   │       ├── Pricing Summary Card
│   │       └── Vehicle Details Card
│   ├── Action Buttons
│   └── Info Notice
├── Loading Overlay (Auto Select)
└── AutoSelectConfirmModal
```

---

## Props & Interfaces

### Component Props
```typescript
interface OrderSummaryPageProps {
  transportType: string;  // "motorbike" | "truck"
  orderType: string;      // "one-way" | "multi-direction"
}
```

### Internal Interfaces

#### LocationPoint
```typescript
interface LocationPoint {
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
  recipientName: string;
  recipientPhone: string;
}
```

#### OrderData
```typescript
interface OrderData {
  transportType: string;
  orderType: string;
  locationPoints: LocationPoint[];
  packageDescription: string;
  packageWeight: string;
  packageDimensions: string;
  specialInstructions: string;
  packageImages?: string[];
  packageVideo?: string | null;
  // Vehicle-specific fields
  truckType?: string;
  cargoType?: string;
  isFragile?: boolean;
  requiresRefrigeration?: boolean;
  loadingEquipmentNeeded?: boolean;
  packageType?: string;
  isDocuments?: boolean;
  isExpress?: boolean;
}
```

---

## State Management

### React State Variables

1. **orderData** (`OrderData | null`)
   - Stores the complete order information
   - Loaded from sessionStorage via dataConverter utility

2. **routeSegments** (`any[] | null`)
   - Stores route segments for multi-direction orders
   - Only populated when orderType is "multi-direction"

3. **isLoading** (`boolean`)
   - Controls loading state during data fetch
   - Shows spinner while loading

4. **showNotification** (`boolean`)
   - Controls visibility of incomplete order notification toast
   - Auto-dismisses after 5 seconds

5. **showAutoSelectModal** (`boolean`)
   - Controls visibility of auto-select confirmation modal
   - Persisted in sessionStorage for browser navigation

6. **isAutoSelectLoading** (`boolean`)
   - Shows loading overlay during driver selection process
   - Simulates API call delay (500ms)

### Computed Values (useMemo)

1. **currentUser**
   - Mock user data (name, phone)
   - Language-aware display

2. **availableDrivers**
   - Mock driver list with distance calculations
   - Sorted by rating then distance
   - Filtered by vehicle type

3. **selectedDriver**
   - Best driver from availableDrivers array
   - Fallback mock data if no drivers available

4. **completionPercentage**
   - Calculates order completion (0-100%)
   - Validates all required fields

5. **totalDistance**
   - Mock distance calculation
   - Based on number of location points

6. **deliveryFee**
   - Estimated delivery fee
   - Includes base fee + distance + extras

7. **priceBreakdown**
   - Detailed price calculation
   - Base price + distance charge + extra charges

---

## Sub-Components

### 1. AutoSelectConfirmModal

**Location**: `./components/AutoSelectConfirmModal.tsx`

**Purpose**: Displays confirmation dialog when platform auto-selects a driver

**Props**:
```typescript
interface AutoSelectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driver: Driver;
  priceBreakdown: PriceBreakdown;
  isArabic: boolean;
  isMotorbike: boolean;
}
```

**Features**:
- Driver profile display (avatar, rating, completed trips)
- Vehicle information (model, license plate)
- Arrival time and distance
- Price breakdown with detailed charges
- Action buttons: View Details, Chat, Cancel, Confirm
- Trust badge (Verified & Insured Driver)
- Modal state persistence for browser navigation

**UI Sections**:
1. **Header**: Confirmation title with checkmark icon
2. **Driver Card**: 
   - Avatar with rating badge
   - Driver name and stats
   - Phone number (clickable)
   - Vehicle details
   - Arrival time
   - Trust badge
3. **Price Breakdown**: 
   - Base price
   - Distance charge
   - Extra charges (express, refrigeration, loading equipment)
   - Total amount
4. **Action Buttons**: Cancel and Confirm
5. **Footer Note**: Terms of service agreement

---

## Data Flow

### Data Loading Process

1. **Initial Load** (useEffect):
   ```typescript
   // Dynamic import to avoid circular dependencies
   import("./utils/dataConverter").then(({ loadAndConvertOrderData, getRouteSegments, isNewFormat }) => {
     if (isNewFormat()) {
       // New format: Load route segments
       const segments = getRouteSegments();
       setRouteSegments(segments);
       // Also convert for backward compatibility
       const data = loadAndConvertOrderData();
       setOrderData(data);
     } else {
       // Old format: Load and convert
       const data = loadAndConvertOrderData();
       setOrderData(data);
     }
   })
   ```

2. **Data Source**: `sessionStorage.getItem("pickAndOrderDetails")`

3. **Format Detection**: Uses `isNewFormat()` to determine data structure

4. **Conversion**: `dataConverter.ts` handles format conversion

### Data Persistence

- **Order Data**: Stored in `sessionStorage` as `pickAndOrderDetails`
- **Modal State**: Stored in `sessionStorage` as `autoSelectModalOpen` and `autoSelectModalDriverId`
- **URL Parameters**: Uses `fromModal` query parameter for browser navigation

---

## Features & Functionality

### 1. Completion Percentage Calculation

**Logic**:
- Validates location coordinates for each point
- Checks additional details for each location
- Validates recipient info for dropoff points
- Verifies package description and weight
- Checks vehicle-specific requirements (truck type for trucks)

**Visual Feedback**:
- Progress bar with color coding:
  - Green: 100% complete
  - Yellow: 70-99% complete
  - Red: <70% complete
- Percentage badge that moves along progress bar
- Status message (Complete! or X% remaining)

### 2. Driver Selection System

#### Auto-Select (Platform Recommendation)
- Simulates API call to find best driver
- Selection criteria:
  1. Highest rating
  2. Closest distance
  3. Matching vehicle type
- Shows loading overlay during selection
- Displays confirmation modal with driver details

#### Manual Selection
- Navigates to driver selection page
- User can browse and choose from available drivers

### 3. Distance & Time Calculations

**Haversine Formula**:
```typescript
calculateDistance(lat1, lon1, lat2, lon2)
// Returns distance in kilometers
```

**Estimated Time**:
```typescript
calculateEstimatedTime(distance)
// Assumes 40 km/h average speed
// Returns time in minutes
```

### 4. Price Calculation

**Base Price**:
- Motorbike: 15 SAR
- Truck: 30 SAR

**Distance Charge**:
- Motorbike: 2.5 SAR/km
- Truck: 5.0 SAR/km

**Extra Charges**:
- Express Delivery: +20 SAR
- Refrigeration: +15 SAR
- Loading Equipment: +25 SAR

### 5. Browser Navigation Handling

- Listens for `popstate` events
- Restores modal state after browser back/forward
- Cleans up sessionStorage on modal close
- Removes URL parameters after use

---

## UI Sections

### 1. Header Section

**Components**:
- Order type badge (One-Way / Multi-Direction)
- Vehicle type badge (Motorbike / Truck)
- Title: "Order Summary" / "ملخص الطلب"
- Subtitle: Review instruction
- Completion progress bar with percentage

**Styling**:
- Gradient background
- Backdrop blur effect
- Responsive padding and spacing

### 2. Sender Info Card

**Displays**:
- User icon
- Sender name (from profile)
- Phone number (LTR for numbers)

**Layout**:
- Grid layout (1 column mobile, 2 columns desktop)
- Icon + text format

### 3. Location Points Section (One-Way Orders)

**Pickup Points**:
- Green gradient background
- Numbered badges (1, 2, 3...)
- Location label
- Street name and city
- Additional details (if provided)
- Animated ping effect

**Dropoff Points**:
- Orange gradient background
- Sequential numbering
- Location label
- Street name and city
- Recipient information (name, phone)
- Additional details (if provided)
- Animated ping effect

### 4. Route Segments Section (Multi-Direction Orders)

**Segment Card Structure**:
- Segment number badge (top-right)
- Segment title
- Pickup Point:
  - Green theme
  - MapPin icon
  - Full address details
  - Contact information
  - Additional details
- Arrow connector (gradient)
- Dropoff Point:
  - Orange theme
  - Navigation icon
  - Full address details
  - Contact information
  - Additional details
- Package Details:
  - Blue theme
  - Description, weight, dimensions
  - Special flags (fragile, refrigeration)
  - Special instructions
  - Package images (grid layout)
  - Package video (if provided)

**Visual Design**:
- Gradient backgrounds
- Border accents
- Shadow effects
- Hover animations
- Responsive grid layouts

### 5. Package Details Section (Old Format Fallback)

**Displays**:
- Package description
- Weight (kg)
- Dimensions (cm)
- Special instructions
- Package images (grid)
- Package video

**Layout**:
- Grid cards for description and weight
- Full-width cards for dimensions and instructions
- Responsive image grid

### 6. Pricing Summary Card (Sidebar)

**Sections**:
- **Total Distance**: 
  - Large display (km)
  - Navigation icon
- **Estimated Fee**:
  - Green gradient background
  - Large SAR amount
  - Disclaimer note

**Positioning**:
- Sticky on desktop (top-4)
- Scrolls on mobile

### 7. Vehicle Details Card (Sidebar)

**Displays** (when applicable):
- Truck type (with localized names)
- Cargo type
- Package type
- Fragile items badge
- Refrigeration required badge
- Loading equipment badge
- Important documents badge
- Express delivery badge (with pulse animation)

**Styling**:
- Color-coded badges
- Icon + text format
- Conditional rendering

### 8. Action Buttons

**Edit Details Button**:
- Full width
- White/gray background
- Edit icon
- Navigates to order details page

**Driver Selection Buttons** (Side by Side):
- **Auto Select** (Left):
  - Green gradient
  - Sparkles icon
  - Loading spinner when active
  - Disabled during loading
- **I Choose Myself** (Right):
  - Orange background
  - Arrow icon
  - Navigates to driver selection page

### 9. Info Notice

**Content**:
- Checkmark icon
- Message about final price review
- Light background card

### 10. Notification Toast

**Trigger**: When user tries to proceed with incomplete order

**Content**:
- Warning icon
- Completion percentage
- Message to complete required fields
- "Complete Details" button
- Close button (X)

**Behavior**:
- Auto-dismisses after 5 seconds
- Animated entrance/exit
- Positioned top-right (LTR) or top-left (RTL)

### 11. Loading Overlay (Auto Select)

**Display**: When auto-selecting driver

**Content**:
- Backdrop blur
- Centered card
- Spinning loader icon
- "Selecting best driver..." message

**Animation**:
- Fade in/out
- Scale animation

---

## User Interactions

### 1. Edit Details
- **Action**: Click "Edit Details" button
- **Navigation**: `/pickandorder/{transportType}/order/details?type={orderType}`
- **Preserves**: Current order data in sessionStorage

### 2. Auto Select Driver
- **Action**: Click "Auto Select" button
- **Validation**: Checks completion percentage (must be 100%)
- **Process**:
  1. Shows loading overlay
  2. Simulates API call (500ms)
  3. Opens confirmation modal
- **On Incomplete**: Shows notification toast

### 3. Manual Driver Selection
- **Action**: Click "I Choose Myself" button
- **Validation**: Checks completion percentage (must be 100%)
- **Navigation**: `/pickandorder/{transportType}/order/choose-driver?type={orderType}`
- **On Incomplete**: Shows notification toast

### 4. Auto Select Modal Interactions

#### View Driver Details
- **Action**: Click "Show Details" button
- **Navigation**: `/driver/{driverId}?fromModal=true`
- **Persistence**: Stores modal state in sessionStorage

#### Chat with Driver
- **Action**: Click "Chat" button
- **Navigation**: `/driver/{driverId}/chat?fromModal=true`
- **Persistence**: Stores modal state in sessionStorage

#### Confirm Order
- **Action**: Click "Confirm Order" button
- **Navigation**: `/pickandorder/{transportType}/order/payment?type={orderType}&autoSelect=true&driverId={driverId}`
- **Cleanup**: Removes modal state from sessionStorage

#### Cancel
- **Action**: Click "Cancel" or close button (X)
- **Behavior**: Closes modal, cleans up sessionStorage and URL params

### 5. Browser Navigation
- **Back Button**: Restores modal if it was open
- **Forward Button**: Restores modal if it was open
- **State Management**: Uses sessionStorage and URL parameters

---

## Dependencies

### External Libraries

1. **React** (`react`)
   - Core framework
   - Hooks: useState, useEffect, useMemo, useCallback

2. **Next.js** (`next/navigation`)
   - useRouter for navigation
   - Image component for optimized images

3. **Framer Motion** (`framer-motion`)
   - AnimatePresence for exit animations
   - motion components for animations
   - Transition effects

4. **Lucide React** (`lucide-react`)
   - Icon library (30+ icons used)
   - Icons: ArrowRight, Edit2, MapPin, UserCircle, Phone, Truck, Package, Sparkles, Navigation, CheckCircle2, AlertCircle, Bike, Box, AlertTriangle, FileText, Clock, Weight, Ruler, Image, Video, X, Loader2

5. **Context API**
   - LanguageContext for language/direction
   - useLanguage hook

### Internal Dependencies

1. **dataConverter Utility** (`./utils/dataConverter.ts`)
   - `loadAndConvertOrderData()`: Loads and converts order data
   - `getRouteSegments()`: Gets route segments for multi-direction
   - `isNewFormat()`: Detects data format

2. **AutoSelectConfirmModal** (`./components/AutoSelectConfirmModal.tsx`)
   - Confirmation modal component

### SessionStorage Keys

- `pickAndOrderDetails`: Main order data
- `autoSelectModalOpen`: Modal visibility state
- `autoSelectModalDriverId`: Selected driver ID

---

## Technical Details

### Performance Optimizations

1. **Memoization**:
   - `useMemo` for expensive calculations
   - `useCallback` for event handlers
   - Prevents unnecessary re-renders

2. **Dynamic Imports**:
   - dataConverter imported dynamically
   - Avoids circular dependencies

3. **Conditional Rendering**:
   - Only renders sections when data exists
   - Reduces DOM nodes

4. **Image Optimization**:
   - Next.js Image component
   - Lazy loading
   - Responsive sizing

### Accessibility

- Semantic HTML structure
- ARIA labels (implicit via icons)
- Keyboard navigation support
- RTL/LTR support for Arabic
- Color contrast compliance
- Screen reader friendly

### Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: `sm:` (≥ 640px)
- **Desktop**: `lg:` (≥ 1024px)

### Color Scheme

**Primary Colors**:
- Green: `#31A342` (Truck, Success)
- Orange: `#FA9D2B` (Motorbike, Dropoff)
- Blue: Various shades (Package details)

**Status Colors**:
- Success: Green gradients
- Warning: Yellow/Orange
- Error: Red
- Info: Blue

---

## Error Handling

### 1. No Data Found
- Displays error state
- Shows "Complete Details" button
- Redirects to order details page

### 2. Loading Errors
- Catches errors in data loading
- Sets loading to false
- Logs errors to console

### 3. Invalid Data Format
- Falls back to old format
- Handles missing fields gracefully
- Shows default values

---

## Future Enhancements

1. **Real API Integration**:
   - Replace mock drivers with API calls
   - Real-time driver availability
   - Live distance calculations

2. **Enhanced Validation**:
   - Field-level validation messages
   - Inline error indicators
   - Validation hints

3. **Analytics**:
   - Track completion percentage
   - Monitor user drop-off points
   - A/B testing for UI variations

4. **Offline Support**:
   - Service worker integration
   - Offline data caching
   - Sync when online

5. **Accessibility Improvements**:
   - Full keyboard navigation
   - Screen reader announcements
   - Focus management

---

## Summary

The **OrderSummaryPage** component is a comprehensive, feature-rich React component that serves as the critical review step in the Pick & Order flow. It handles multiple order types, transport modes, and data formats while providing a smooth, bilingual user experience with robust validation and error handling.

**Key Strengths**:
- ✅ Complete feature coverage
- ✅ Bilingual support
- ✅ Responsive design
- ✅ Data format compatibility
- ✅ Rich user feedback
- ✅ Smooth animations
- ✅ Error handling

**Component Size**: ~1,672 lines of code
**Sub-Components**: 1 (AutoSelectConfirmModal)
**Dependencies**: 5 external libraries
**State Variables**: 6
**Computed Values**: 7
**User Interactions**: 5 main actions

