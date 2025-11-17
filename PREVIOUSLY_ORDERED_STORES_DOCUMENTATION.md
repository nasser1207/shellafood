# PreviouslyOrderedStores Feature - Complete Documentation

## Overview
The PreviouslyOrderedStores feature allows users to view and filter stores they have previously ordered from. It consists of two main components:
1. **Preview Component** (`index.tsx`) - Shows a preview section on the home page with first 10 stores
2. **Full Page Component** (`PreviouslyOrderedStoresPage.tsx`) - Complete page with filtering, pagination, and category selection

---

## File Structure

```
src/
├── app/
│   └── previously-ordered-stores/
│       ├── page.tsx                    # Route page (renders PreviouslyOrderedStoresPage)
│       ├── layout.tsx                  # Layout wrapper
│       ├── loading.tsx                 # Loading state
│       └── error.tsx                   # Error state
│
└── components/
    └── HomePage/
        └── PreviouslyOrderedStores/
            ├── index.tsx               # Preview component (home page section)
            └── PreviouslyOrderedStoresPage.tsx  # Full page component
```

---

## Component Architecture

### 1. Preview Component (`index.tsx`)
**Location:** `src/components/HomePage/PreviouslyOrderedStores/index.tsx`

**Purpose:** Displays a preview section on the home page showing up to 10 previously ordered stores.

**Key Features:**
- Shows first 10 stores from the provided array
- Displays order count badges
- Shows "Ordered Before" badge
- Clickable cards that navigate to store pages
- "View All" button that routes to `/previously-ordered-stores`
- Responsive grid layout (1-4 columns based on screen size)
- Framer Motion animations

**Props:**
```typescript
interface PreviouslyOrderedStoresProps {
  stores: Store[];
}
```

**Key Logic:**
- Displays first 10 stores: `stores.slice(0, 10)`
- Generates mock order count: `Math.floor(Math.random() * 10) + 1`
- Navigation uses `navigateToStore` utility with category lookup

---

### 2. Full Page Component (`PreviouslyOrderedStoresPage.tsx`)
**Location:** `src/components/HomePage/PreviouslyOrderedStores/PreviouslyOrderedStoresPage.tsx`

**Purpose:** Complete page for browsing and filtering previously ordered stores with advanced filtering, pagination, and category selection.

---

## State Management

### Local State
```typescript
const [showFilters, setShowFilters] = useState(false);           // Toggle sidebar filters (mobile)
const [mobileViewMode, setMobileViewMode] = useState<"single" | "double">("single");  // Mobile grid view
const [currentPage, setCurrentPage] = useState(1);              // Current pagination page
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  // Selected category filters
```

### External Hooks
```typescript
const { language } = useLanguage();                              // Language context (ar/en)
const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();  // Filter state management
const isMobile = useMobile(768);                                  // Responsive breakpoint detection
```

---

## Data Flow

### 1. Data Entry Point
- **Route:** `/previously-ordered-stores`
- **Page Component:** `src/app/previously-ordered-stores/page.tsx`
- **Data Source:** `TEST_STORES` from `@/lib/data/categories/testData`
- **Flow:** `Route → PreviouslyOrderedStoresPage → receives stores prop`

### 2. Order Count Generation
```typescript
// Generates consistent order counts based on store.id hash
const storeOrderCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  stores.forEach((store) => {
    const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    counts[store.id] = (hash % 15) + 1;  // Returns 1-15 orders
  });
  return counts;
}, [stores]);
```

**Note:** This is a mock implementation. In production, this should come from user's actual order history.

---

## Filtering System

### 1. Category Filters
**Categories Available:**
- Restaurant (مطعم) - ID: "1"
- Supermarket (سوبرماركت) - ID: "2"
- Pharmacy (صيدلية) - ID: "3"
- Cafe (مقهى) - ID: "4"
- Hypermarket (هايبرماركت) - ID: "5"
- Pet Store (متجر الحيوانات الأليفة) - ID: "6"

**Filter Logic:**
```typescript
// Matches stores by:
// 1. categoryId (exact match)
// 2. type/typeAr keywords (partial match)
if (selectedCategories.length > 0) {
  result = result.filter((store) => {
    return selectedCategories.some((catId) => {
      const category = storeCategories.find((c) => c.id === catId);
      // Check categoryId match
      if (store.categoryId && category.categoryIds.includes(store.categoryId)) {
        return true;
      }
      // Check type keyword match
      const storeType = (store.type || "").toLowerCase();
      const storeTypeAr = (store.typeAr || "").toLowerCase();
      return category.typeKeywords.some((keyword) => {
        return storeType.includes(keyword.toLowerCase()) || 
               storeTypeAr.includes(keyword.toLowerCase());
      });
    });
  });
}
```

### 2. Advanced Filters (from useFilters hook)
- **Rating Filter:** Filter by minimum rating (e.g., 4.0+, 4.5+)
- **Open Now:** Show only stores currently open
- **Free Delivery:** Show only stores with free delivery
- **Offers:** Show only stores with active offers (mock: ~33% based on hash)
- **Previously Ordered:** Filter stores with orderCount > 0
- **Distance Range:** Filter by distance (mock: based on location hash)

### 3. Sorting
```typescript
// Default: Sort by rating (highest first)
// Note: In production, should sort by last order date
result.sort((a, b) => {
  return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
});
```

---

## Pagination System

### Configuration
```typescript
const itemsPerPage = useMemo(() => {
  if (isMobile) {
    return mobileViewMode === "double" ? 2 : 2;  // Currently 2 for testing
  }
  return 2;  // Desktop - Currently 2 for testing (should be 12 normally)
}, [isMobile, mobileViewMode]);
```

**Note:** Currently set to 2 items per page for testing. Production values should be:
- Mobile single view: 10 items
- Mobile double view: 12 items
- Desktop/Tablet: 12 items

### Pagination Logic
```typescript
// Calculate paginated stores
const paginatedStores = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredAndSortedStores.slice(startIndex, endIndex);
}, [filteredAndSortedStores, currentPage, itemsPerPage]);

// Calculate total pages
const totalPages = useMemo(() => {
  return Math.ceil(filteredAndSortedStores.length / itemsPerPage) || 1;
}, [filteredAndSortedStores.length, itemsPerPage]);
```

### Auto-Reset Behavior
Pagination automatically resets to page 1 when:
- Any filter changes (rating, features, distance, categories)
- View mode changes (single/double)
- Current page becomes invalid (e.g., after filtering reduces total pages)

### Smooth Scroll on Page Change
```typescript
const handlePageChange = useCallback((page: number) => {
  setCurrentPage(page);
  setTimeout(() => {
    const storesElement = document.getElementById("stores-list");
    if (storesElement) {
      const offset = 100;
      const elementPosition = storesElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 100);
}, []);
```

---

## UI Components

### 1. Page Header
- **Icon:** ShoppingBag (amber/orange gradient background)
- **Title:** "Stores You've Ordered From" / "المتاجر التي طلبت منها"
- **Subtitle:** "Reorder easily from stores you've previously ordered from"
- **Description:** Shows count of available stores

### 2. Filter Bar
**Top Row:**
- Filter button (toggles sidebar on mobile)
- Mobile view toggle (single/double grid)
- Results counter

**Category Filters Section:**
- "All" button (clears category filters)
- Category filter chips (6 categories with icons)
- Clear filters button (appears when categories selected)
- Horizontal scroll on mobile

### 3. Filters Sidebar
**Location:** Left side on desktop, toggleable on mobile
**Component:** `FiltersSidebar` from `@/components/Categories/shared/FiltersSidebar`

**Features:**
- Rating filter (checkbox list)
- Features filter (open now, free delivery, offers, etc.)
- Distance range slider
- Clear all button

### 4. Stores Grid
**Layout:**
- Mobile single view: 1 column
- Mobile double view: 2 columns
- Tablet/Desktop: 2 columns

**Component:** `StoreCard` from `@/components/Utils/StoreCard`
**Props Passed:**
- `store`: Store object
- `onClick`: Navigation handler
- `orderCount`: Number of previous orders (from `storeOrderCounts`)

**Animation:**
- Uses Framer Motion `staggerContainer` for staggered entrance
- Page transitions with key: `stores-page-${currentPage}`

### 5. Pagination Component
**Component:** `Pagination` from `@/components/Categories/CategoryPage/Pagination`
**Props:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `onPageChange`: Page change handler
- `totalItems`: Total filtered stores count
- `itemsPerPage`: Items per page
- `maxVisiblePages`: 5 (mobile) or 7 (desktop)

**Conditional Rendering:**
- Only shows if `totalPages > 1` and `filteredAndSortedStores.length > 0`

### 6. Empty State
**Component:** `EmptyState` from `@/components/Categories/shared/EmptyState`
**Shown When:** No stores match the current filters
**Content:**
- Icon: 🛍️
- Title: "No stores available" / "لا توجد متاجر متاحة"
- Description: "You haven't ordered from any store yet. Start shopping now!"

---

## Internationalization (i18n)

### Supported Languages
- **English (en)**
- **Arabic (ar)** - RTL support

### Language Context
```typescript
const { language } = useLanguage();
const isArabic = language === "ar";
const direction = isArabic ? "rtl" : "ltr";
```

### Content Object
All text content is defined in a `content` object with `ar` and `en` keys:
```typescript
const content = {
  ar: { /* Arabic translations */ },
  en: { /* English translations */ }
};
const t = content[language];
```

---

## Navigation

### Store Click Handler
```typescript
const handleStoreClick = useCallback((store: Store) => {
  const categorySlug = store.categoryId ? "restaurants" : "general";
  router.push(`/categories/${categorySlug}/${store.slug}`);
}, [router]);
```

**Note:** This is a simplified implementation. The preview component uses a more sophisticated navigation with category lookup.

### Breadcrumbs
```typescript
const breadcrumbItems = [
  { label: "Home" / "الرئيسية", href: "/home" },
  { label: "Stores You've Ordered From" / "المتاجر التي طلبت منها" }
];
```

---

## Responsive Design

### Breakpoints
- **Mobile:** < 768px (detected via `useMobile(768)`)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Features
- Collapsible filter sidebar
- View mode toggle (single/double grid)
- Horizontal scroll for category filters
- Compact spacing and typography

### Desktop Features
- Always-visible filter sidebar
- Fixed 2-column grid layout
- More spacing and larger typography

---

## Key Dependencies

### External Libraries
- **Framer Motion:** Animations and transitions
- **Lucide React:** Icons
- **Next.js:** Routing and navigation

### Internal Dependencies
- `@/contexts/LanguageContext` - Language management
- `@/hooks/useFilters` - Filter state management
- `@/hooks/useMobile` - Responsive breakpoint detection
- `@/components/Utils/StoreCard` - Store card component
- `@/components/Categories/shared/FiltersSidebar` - Filter sidebar
- `@/components/Categories/shared/Breadcrumbs` - Breadcrumb navigation
- `@/components/Categories/shared/EmptyState` - Empty state component
- `@/components/Categories/CategoryPage/Pagination` - Pagination component
- `@/lib/utils/categories/animations` - Animation variants

---

## Store Data Structure

### Store Interface
```typescript
interface Store {
  id: string;
  name: string;
  nameAr?: string;
  slug?: string;
  type: string;
  typeAr?: string;
  categoryId?: string;  // Used for category filtering
  rating?: string;
  reviewsCount?: number;
  image?: string;
  logo?: string | null;
  location?: string;
  deliveryTime?: string;
  deliveryTimeAr?: string;
  minimumOrder?: string;
  minimumOrderAr?: string;
  fee?: string;
  feeAr?: string;
  hasProducts?: boolean;
  hasCategories?: boolean;
  isOpen?: boolean;
}
```

---

## Mock Data & Testing Notes

### Current Testing Configuration
- **Items per page:** Set to 2 (very low for testing)
- **Production values should be:** 10-12 items per page
- **Order counts:** Generated via hash algorithm (mock)
- **Offers detection:** Mock based on store ID hash (~33%)
- **Distance calculation:** Mock based on location hash

### Production Considerations
1. **Order Counts:** Should come from user's actual order history API
2. **Last Order Date:** Should sort by actual last order date, not rating
3. **Offers:** Should check actual store offers data
4. **Distance:** Should use real geolocation and distance calculation
5. **Items Per Page:** Increase to 10-12 for better UX

---

## Event Handlers

### Filter Management
```typescript
// Handle filter changes (from sidebar)
const handleFilterChange = useCallback((filterType: string, value: any) => {
  setCurrentPage(1);  // Reset to page 1
  updateFilter(filterType, value);
}, [updateFilter]);

// Clear all filters
const handleClearFilters = useCallback(() => {
  setCurrentPage(1);
  setSelectedCategories([]);  // Clear category filters
  clearFilters();  // Clear advanced filters
}, [clearFilters]);

// Toggle category filter
const handleCategoryToggle = useCallback((categoryId: string) => {
  setSelectedCategories((prev) =>
    prev.includes(categoryId)
      ? prev.filter((id) => id !== categoryId)  // Remove if selected
      : [...prev, categoryId]  // Add if not selected
  );
  setCurrentPage(1);  // Reset to page 1
}, []);
```

---

## Performance Optimizations

### Memoization
- `storeOrderCounts` - Memoized based on `stores` array
- `filteredAndSortedStores` - Memoized based on stores, filters, and categories
- `paginatedStores` - Memoized based on filtered stores, current page, items per page
- `totalPages` - Memoized based on filtered stores length and items per page
- `breadcrumbItems` - Memoized based on language
- `storeCategories` - Memoized (static array)

### Callbacks
- All event handlers use `useCallback` to prevent unnecessary re-renders
- Navigation handlers are memoized

---

## Accessibility Features

- **ARIA Labels:** View mode toggle buttons have aria-labels
- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Reader Support:** Semantic HTML and proper labeling
- **Focus Management:** Proper focus handling on filter changes

---

## Dark Mode Support

All components support dark mode via Tailwind's `dark:` prefix:
- Background colors: `bg-gray-50 dark:bg-gray-900`
- Text colors: `text-gray-900 dark:text-white`
- Border colors: `border-gray-200 dark:border-gray-700`
- Interactive states: `hover:bg-gray-200 dark:hover:bg-gray-600`

---

## Integration Points

### Home Page Integration
The preview component (`index.tsx`) is used in:
- `src/components/HomePage/HomePage.tsx`
- Displays first 10 previously ordered stores
- "View All" button routes to `/previously-ordered-stores`

### Route Integration
- **Path:** `/previously-ordered-stores`
- **Page:** `src/app/previously-ordered-stores/page.tsx`
- **Data:** Fetches from `TEST_STORES` (in production, should fetch user's order history)

---

## Similar Components

This component shares architecture with:
- `NearbyStoresPage` - Similar filtering and pagination
- `PopularStoresPage` - Similar filtering and pagination
- `CategoryView` - Similar store grid and filtering

All three use the same:
- Filter system (`useFilters` hook)
- Pagination component
- Store card component
- Filter sidebar component
- Category filter system

---

## Future Enhancements

1. **Real Order History Integration:** Connect to actual user order history API
2. **Last Order Date Sorting:** Sort by actual last order date instead of rating
3. **Order Count from API:** Get real order counts from backend
4. **Favorites Integration:** Allow users to favorite stores from this page
5. **Quick Reorder:** Add "Quick Reorder" button for each store
6. **Order History Link:** Link to detailed order history for each store
7. **Search Functionality:** Add search bar to filter stores by name
8. **Sort Options:** Add dropdown for sorting (rating, last ordered, order count, etc.)

---

## Code Quality Notes

- **TypeScript:** Fully typed with interfaces
- **Error Handling:** Empty states for no results
- **Loading States:** Handled by route-level loading.tsx
- **Error States:** Handled by route-level error.tsx
- **Code Organization:** Well-structured with clear separation of concerns
- **Reusability:** Uses shared components for consistency

---

## Testing Recommendations

1. **Filter Testing:** Test all filter combinations
2. **Pagination Testing:** Test with different items per page values
3. **Category Filter Testing:** Test single and multiple category selection
4. **Responsive Testing:** Test on mobile, tablet, and desktop
5. **Language Testing:** Test RTL (Arabic) and LTR (English) layouts
6. **Dark Mode Testing:** Test all UI states in dark mode
7. **Empty State Testing:** Test with no stores, no filtered results
8. **Navigation Testing:** Test store click navigation
9. **Performance Testing:** Test with large datasets (100+ stores)

---

## Summary

The PreviouslyOrderedStores feature is a comprehensive store browsing system that allows users to:
- View stores they've previously ordered from
- Filter by category (Restaurant, Supermarket, Pharmacy, etc.)
- Apply advanced filters (rating, features, distance)
- Browse with pagination
- Switch between mobile view modes
- Navigate to individual store pages

The component is fully responsive, supports bilingual content (Arabic/English), includes dark mode, and uses modern React patterns with proper state management and performance optimizations.

