# Restaurant Store Page - Complete Documentation
## Route: `/categories/restaurants/alsham-restaurant`

---

## 📋 Overview

The restaurant store page displays a complete store interface with products organized by departments, search functionality, filtering, and navigation. It supports both desktop and mobile views with responsive design, bilingual support (Arabic/English), and dark mode.

---

## 🗂️ File Structure

```
src/
├── app/
│   └── categories/
│       └── [category]/
│           └── [store]/
│               ├── page.tsx                    # Route handler (Server Component)
│               ├── layout.tsx                  # Layout wrapper
│               ├── loading.tsx                 # Loading state
│               ├── error.tsx                   # Error state
│               └── departments/
│                   └── page.tsx                # All departments page
│
└── components/
    └── Categories/
        ├── Store/
        │   └── StorePage.tsx                   # Main wrapper (Client Component)
        │
        └── StorePage/
            ├── StoreView.tsx                   # Desktop view
            ├── MobileStoreView.tsx              # Mobile view
            ├── StoreHero.tsx                    # Hero section
            ├── StickyTabs.tsx                   # Tab navigation
            ├── DepartmentsSidebar.tsx          # Sidebar navigation
            └── DepartmentSection.tsx            # Department product sections
```

---

## 🔄 Data Flow

### 1. Route Handler (`page.tsx`)
**Location:** `src/app/categories/[category]/[store]/page.tsx`

**Process:**
1. Extracts `category` and `store` slugs from URL params
2. Finds store by slug using `findStoreBySlug(storeSlug)`
3. Gets all products for store: `getProductsByStore(store.id)`
4. Gets departments: `getDepartmentsByStore(store.id)`
5. Filters recommended products (with badges or discounts)
6. Passes data to `StorePage` component

**Key Functions:**
- `findStoreBySlug()` - Finds store by slug
- `getProductsByStore()` - Gets all products for store
- `getDepartmentsByStore()` - Gets departments with products

**Error Handling:**
- Returns "Store Not Found" UI if store doesn't exist

### 2. StorePage Component
**Location:** `src/components/Categories/Store/StorePage.tsx`

**Responsibilities:**
- Detects mobile vs desktop using `useMobile(768)` hook
- Groups products by department
- Removes duplicate products
- Renders appropriate view (MobileStoreView or StoreView)

**Product Grouping Logic:**
```typescript
// Combines recommendedProducts and popularProducts
// Removes duplicates by product ID
// Groups by department slug/name
// Ensures all departments have entries (even if empty)
```

---

## 🖥️ Desktop View (`StoreView.tsx`)

### Layout Structure

```
┌─────────────────────────────────────────┐
│  Breadcrumbs                            │
├─────────────────────────────────────────┤
│  StoreHero (Hero Image + Info)         │
├─────────────────────────────────────────┤
│  StickyTabs (Menu/Reviews/Info/Offers) │
├─────────────────────────────────────────┤
│  ┌──────────┬─────────────────────────┐ │
│  │ Sidebar  │ Main Content            │ │
│  │ (Depts)  │ - Search Bar             │ │
│  │          │ - Department Sections   │ │
│  │          │ - Products Grid         │ │
│  └──────────┴─────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Components

#### 1. **StoreHero**
- Large hero image (h-48 sm:h-64 md:h-80)
- Store logo overlay
- Favorite button (top-left/right based on RTL)
- Location button (opens Google Maps)
- Store name, type, rating
- View Location button

#### 2. **StickyTabs**
- Tabs: Menu, Reviews, Info, Offers
- Sticky positioning when scrolling
- Active tab highlighting
- Bilingual labels

#### 3. **DepartmentsSidebar**
- Vertical list of departments
- Active department highlighting
- Scroll to department on click
- "Show All" link to departments page
- Sticky positioning

#### 4. **Search & Filter Bar**
- Search input with icon
- Real-time product filtering
- Searches product names (English/Arabic)

#### 5. **DepartmentSection**
- Department header (sticky on scroll)
- Product grid (responsive columns)
- "View All" link to department page
- Product cards with:
  - Image, name, price
  - Rating, stock status
  - Add to cart button
  - Quick view option

### State Management

```typescript
const [activeTab, setActiveTab] = useState("menu");
const [activeDepartment, setActiveDepartment] = useState<string | undefined>();
const [searchTerm, setSearchTerm] = useState("");
```

### Filtering Logic

```typescript
// Filters products by search term
// Searches in both English and Arabic names
// Filters by department
// Updates in real-time as user types
```

---

## 📱 Mobile View (`MobileStoreView.tsx`)

### Layout Structure

```
┌─────────────────────────────────────────┐
│  Hero Image (Full Width)                │
│  - Favorite Button                      │
│  - Location Button                      │
├─────────────────────────────────────────┤
│  Store Info Card                        │
│  - Logo, Name, Type, Rating             │
│  - Delivery Time, Minimum Order         │
│  - View Location Button                 │
├─────────────────────────────────────────┤
│  Sticky Search Bar                      │
├─────────────────────────────────────────┤
│  Horizontal Department Tabs (Scrollable)│
│  - All Departments                      │
│  - "Show All" Tab                       │
├─────────────────────────────────────────┤
│  Department Sections                    │
│  - Sticky Headers                       │
│  - Product Grid (2 columns)             │
├─────────────────────────────────────────┤
│  Floating Cart Button (Bottom)          │
│  Floating Scroll-to-Top Button          │
└─────────────────────────────────────────┘
```

### Key Features

#### 1. **Sticky Search Bar**
- Position: `sticky top-0 z-40`
- Opens search modal on click
- Shows placeholder text

#### 2. **Horizontal Department Tabs**
- Scrollable horizontal list
- Active department highlighting
- Product count badges
- "Show All" tab with icon
- Smooth scrolling to department

#### 3. **Sticky Department Headers**
- Sticky positioning below search bar
- Dynamic top offset based on search bar height
- Uses `ResizeObserver` for accurate positioning
- Responsive padding and text sizes

#### 4. **Product Grid**
- 2 columns on mobile
- Product cards with images
- Quick add to cart
- Tap to view product details

#### 5. **Floating Buttons**
- **Cart Button**: Bottom-left (Arabic) / Bottom-right (English)
  - Shows cart item count badge
  - Navigates to `/cart`
  - Green gradient background
  
- **Scroll-to-Top Button**: Bottom-right (Arabic) / Bottom-left (English)
  - Appears after scrolling 400px
  - Square design with gradient
  - Smooth scroll animation

### State Management

```typescript
const [activeDepartment, setActiveDepartment] = useState<string | undefined>();
const [searchTerm, setSearchTerm] = useState("");
const [showSearchModal, setShowSearchModal] = useState(false);
const [showFilters, setShowFilters] = useState(false);
const [showScrollToTop, setShowScrollToTop] = useState(false);
const [cartItems, setCartItems] = useState(getCartItems());
```

### Cart Integration

- Real-time cart updates
- Listens to storage events
- Periodic cart checks (1 second interval)
- Displays cart count badge
- Handles cart from different stores

---

## 🎨 UI Components

### Store Information Display

#### Store Hero Section
- **Image**: Full-width hero image with gradient overlay
- **Logo**: Overlaid on hero or in info card
- **Name**: Large, bold typography
- **Type**: Subtitle text
- **Rating**: Star icon + rating number + review count
- **Location**: Button to open Google Maps

#### Store Info Card
- Positioned below hero with negative margin (`-mt-8`)
- Rounded top corners (`rounded-t-2xl`)
- White/dark background
- Shadow for elevation
- Responsive padding

### Product Display

#### Product Cards
- Image with fallback
- Product name (truncated)
- Price (with original price if discounted)
- Rating (optional)
- Stock status (optional)
- Add to cart button
- Click to view product details

#### Product Grid
- **Desktop**: 2-6 columns (responsive)
- **Mobile**: 2 columns
- Gap spacing: `gap-4`
- Responsive breakpoints

### Department Navigation

#### Desktop Sidebar
- Vertical list
- Active state highlighting
- Scroll to section on click
- "Show All" link at bottom

#### Mobile Tabs
- Horizontal scrollable
- Pill-shaped buttons
- Active state with green background
- Product count badges
- Smooth scroll to section

---

## 🔍 Search Functionality

### Search Implementation

**Location**: Both desktop and mobile views

**Features:**
- Real-time filtering as user types
- Searches product names (English and Arabic)
- Filters by department
- Case-insensitive matching
- Updates product grid instantly

**Search Logic:**
```typescript
const filteredProducts = useMemo(() => {
  if (!searchTerm) return productsByDepartment;
  
  const filtered: Record<string, Product[]> = {};
  Object.entries(productsByDepartment).forEach(([deptId, products]) => {
    const matching = products.filter((p) => {
      const name = isArabic && p.nameAr ? p.nameAr : p.name;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (matching.length > 0) {
      filtered[deptId] = matching;
    }
  });
  return filtered;
}, [productsByDepartment, searchTerm, isArabic]);
```

### Search UI

**Desktop:**
- Inline search bar with icon
- Full-width input
- Focus ring styling

**Mobile:**
- Button that opens search modal
- Placeholder text
- Bottom sheet modal (if implemented)

---

## 🎯 Navigation

### Breadcrumbs
- Home → Categories → Category → Store Name
- Clickable navigation
- Bilingual labels
- Responsive display

### Department Navigation
- Click department → Scrolls to section
- Active department highlighting
- Smooth scroll behavior
- URL updates (if implemented)

### Product Navigation
- Click product card → Navigate to product page
- Route: `/categories/{category}/{store}/{department}/{product}`
- Uses `navigateToProductFromContext()` utility

### External Navigation
- **Location**: Opens Google Maps in new tab
- **Share**: Share store URL (if implemented)

---

## 🌐 Internationalization (i18n)

### Supported Languages
- **English (en)**: LTR layout
- **Arabic (ar)**: RTL layout

### Language Context
```typescript
const { language } = useLanguage();
const isArabic = language === "ar";
const direction = isArabic ? "rtl" : "ltr";
```

### Bilingual Content
- Store names: `store.name` / `store.nameAr`
- Store types: `store.type` / `store.typeAr`
- Department names: `dept.name` / `dept.nameAr`
- Product names: `product.name` / `product.nameAr`
- UI labels: Hardcoded bilingual objects

### RTL Considerations
- Text alignment: Right-aligned in Arabic
- Icon positions: Mirrored (left ↔ right)
- Flex directions: `flex-row-reverse` for Arabic
- Scroll directions: Natural RTL scrolling
- Button positions: Swapped for cart/scroll buttons

---

## 🎨 Styling & Design

### Color Scheme
- **Primary**: Green (`green-600`, `emerald-600`)
- **Background**: White / Dark gray (`gray-900`)
- **Text**: Gray scale (`gray-900`, `gray-600`, `gray-400`)
- **Accents**: Yellow (ratings), Blue (location), Red (badges)

### Dark Mode
- Full dark mode support
- Uses Tailwind `dark:` prefix
- Consistent color scheme
- Proper contrast ratios

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Animations
- Framer Motion for transitions
- Smooth scroll behavior
- Hover effects on cards
- Button press feedback
- Modal animations

---

## 🔧 Key Features

### 1. **Favorites**
- Heart icon button
- Saves to localStorage
- Toggle favorite state
- Visual feedback

### 2. **Cart Integration**
- Add to cart from product cards
- Cart count badge
- Floating cart button (mobile)
- Cart validation (same store only)

### 3. **Scroll-to-Top**
- Appears after 400px scroll
- Smooth scroll animation
- Positioned based on language
- Square design with gradient

### 4. **Sticky Elements**
- Search bar (mobile)
- Department headers (mobile)
- Tabs (desktop)
- Sidebar (desktop)

### 5. **Product Filtering**
- Search by name
- Filter by department
- Real-time updates
- Empty state handling

### 6. **Department Sections**
- Grouped products
- Sticky headers
- "View All" links
- Product count display

---

## 📊 Data Structures

### Store Interface
```typescript
interface Store {
  id: string;
  name: string;
  nameAr?: string;
  slug?: string;
  type: string;
  typeAr?: string;
  categoryId?: string;
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

### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  nameAr?: string;
  slug?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  badgeAr?: string;
  unit?: string;
  unitAr?: string;
  description?: string;
  descriptionAr?: string;
  storeId?: string;
  category?: string;
  department?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  deliveryTime?: string;
  deliveryTimeAr?: string;
  brand?: string;
}
```

### Department Interface
```typescript
interface Department {
  id?: string;
  name: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  productCount?: number;
}
```

---

## 🔄 State Management

### Local State
- `activeTab`: Current tab (menu/reviews/info/offers)
- `activeDepartment`: Selected department slug
- `searchTerm`: Search input value
- `showSearchModal`: Mobile search modal visibility
- `showFilters`: Filter modal visibility
- `showScrollToTop`: Scroll-to-top button visibility
- `cartItems`: Cart items array

### External Hooks
- `useLanguage()`: Language context
- `useMobile(768)`: Responsive breakpoint detection
- `useStoreFavorites()`: Favorite state management
- `useCart()`: Cart operations
- `useRouter()`: Next.js navigation

### Memoization
- `filteredProducts`: Memoized based on search term and products
- `breadcrumbItems`: Memoized based on route and language
- `tabs`: Static memoized array
- `cartCount`: Memoized from cart items

---

## 🚀 Performance Optimizations

### Code Splitting
- Separate mobile/desktop components
- Lazy loading for modals
- Dynamic imports (if used)

### Memoization
- `useMemo` for expensive computations
- `useCallback` for event handlers
- `memo` for component optimization

### Image Optimization
- Next.js Image component
- Lazy loading
- Proper sizing
- Blur placeholders

### Rendering Optimization
- Conditional rendering
- Virtual scrolling (if needed)
- Debounced search (if implemented)

---

## ♿ Accessibility

### ARIA Labels
- Button labels
- Search input labels
- Navigation landmarks
- Modal labels

### Keyboard Navigation
- Tab order
- Enter/Space activation
- Escape to close modals
- Arrow key navigation (if implemented)

### Screen Reader Support
- Semantic HTML
- Proper heading hierarchy
- Alt text for images
- Descriptive button text

### Focus Management
- Visible focus indicators
- Focus trap in modals
- Focus return on close

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Sticky search bar
- Horizontal department tabs
- 2-column product grid
- Floating action buttons
- Bottom sheet modals

### Tablet (768px - 1024px)
- 2-column sidebar + main
- 3-4 column product grid
- Medium-sized typography
- Adjusted spacing

### Desktop (> 1024px)
- Sidebar + main content
- 4-6 column product grid
- Larger typography
- More spacing
- Hover effects

---

## 🔗 Related Routes

### Sub-routes
- `/categories/restaurants/alsham-restaurant/departments` - All departments page
- `/categories/restaurants/alsham-restaurant/{department}` - Department products
- `/categories/restaurants/alsham-restaurant/{department}/{product}` - Product details

### Navigation
- Back to category: `/categories/restaurants`
- Home: `/`
- Cart: `/cart`

---

## 🎯 User Experience Flow

### Typical User Journey

1. **Landing on Store Page**
   - Sees hero image
   - Views store info (name, rating, type)
   - Sees department navigation

2. **Browsing Products**
   - Clicks department → Scrolls to section
   - Views products in grid
   - Clicks product → Views details

3. **Searching**
   - Types in search bar
   - Sees filtered results instantly
   - Products update in real-time

4. **Adding to Cart**
   - Clicks "Add to Cart" on product
   - Cart count updates
   - Can view cart via floating button

5. **Navigation**
   - Uses breadcrumbs to go back
   - Clicks "View All" to see all departments
   - Uses scroll-to-top for quick navigation

---

## 🛠️ Technical Implementation Details

### Server-Side Rendering
- Route handler is async Server Component
- Data fetching happens server-side
- SEO-friendly metadata generation
- Error handling for missing stores

### Client-Side Interactivity
- Search filtering
- Tab switching
- Department navigation
- Cart operations
- Favorite toggling

### URL Structure
```
/categories/{category}/{store}
```
- Dynamic route segments
- Slug-based routing
- SEO-friendly URLs

### Data Fetching
- Server-side data fetching
- No client-side API calls (uses mock data)
- Product grouping and filtering
- Department organization

---

## 🎨 Design Patterns

### Component Composition
- Small, reusable components
- Props-based configuration
- Composition over inheritance

### State Management
- Local state for UI
- Context for global state (language)
- localStorage for persistence (favorites, cart)

### Error Handling
- Store not found state
- Empty product states
- Image error handling
- Graceful degradation

---

## 📝 Key Functions

### Navigation Functions
- `navigateToProductFromContext()`: Navigate to product page
- `handleDepartmentClick()`: Scroll to department
- `handleProductClick()`: Navigate to product
- `handleLocationClick()`: Open Google Maps

### Filter Functions
- `filteredProducts`: Memoized filter logic
- Real-time search filtering
- Department-based filtering

### Cart Functions
- `addToCart()`: Add product to cart
- `getCartItems()`: Get current cart
- Cart validation (same store)

---

## 🔐 Security Considerations

### Input Validation
- Search term sanitization
- URL parameter validation
- Slug validation

### Data Sanitization
- Store data validation
- Product data validation
- XSS prevention

---

## 📈 Future Enhancements

### Potential Features
1. **Advanced Filters**
   - Price range
   - Rating filter
   - Dietary restrictions
   - Allergen filters

2. **Sorting Options**
   - Price (low to high, high to low)
   - Rating
   - Popularity
   - Newest

3. **Product Quick View**
   - Modal with product details
   - Add to cart from modal
   - Image gallery

4. **Reviews Integration**
   - Display reviews
   - Add review form
   - Review filtering

5. **Offers Section**
   - Active offers display
   - Offer countdown
   - Offer filtering

6. **Store Hours**
   - Opening hours display
   - Closed status
   - Next opening time

7. **Delivery Options**
   - Delivery vs pickup
   - Delivery time estimation
   - Delivery fee calculator

---

## 🧪 Testing Considerations

### Unit Tests
- Component rendering
- State management
- Filter logic
- Navigation functions

### Integration Tests
- Route handling
- Data fetching
- Component interactions
- Cart operations

### E2E Tests
- User journey
- Search functionality
- Cart flow
- Navigation flow

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Focus management
- ARIA labels

---

## 📚 Dependencies

### Core Libraries
- **Next.js**: Framework and routing
- **React**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations

### Internal Dependencies
- `@/contexts/LanguageContext`: Language management
- `@/hooks/useMobile`: Responsive detection
- `@/hooks/useCart`: Cart operations
- `@/hooks/useFavorites`: Favorite management
- `@/lib/data/categories/testData`: Mock data
- `@/lib/utils/categories/navigation`: Navigation utilities

---

## 🎯 Summary

The restaurant store page (`/categories/restaurants/alsham-restaurant`) is a comprehensive, feature-rich interface that provides:

✅ **Complete Store Information**: Hero image, logo, name, rating, location
✅ **Department Organization**: Products grouped by departments
✅ **Search Functionality**: Real-time product search
✅ **Responsive Design**: Mobile and desktop views
✅ **Bilingual Support**: English and Arabic with RTL
✅ **Dark Mode**: Full theme support
✅ **Cart Integration**: Add to cart, cart count, cart button
✅ **Favorites**: Save favorite stores
✅ **Navigation**: Breadcrumbs, department navigation, product navigation
✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
✅ **Performance**: Optimized rendering, memoization, image optimization
✅ **User Experience**: Smooth animations, sticky elements, scroll-to-top

The page follows modern React patterns, uses Next.js App Router, implements proper state management, and provides an excellent user experience across all devices and languages.

