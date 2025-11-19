# Design Guidelines: SaaS Rental Management Platform

## Design Approach

**Design System: Material Design 3** - Selected for its excellence with data-rich enterprise applications, comprehensive form components, and professional trustworthy aesthetic essential for financial/legal workflows.

**Core Principles:**
- Clarity over decoration - users manage important financial and legal matters
- Consistent patterns - reduce cognitive load across complex workflows
- Progressive disclosure - reveal complexity as needed
- Trust through professionalism - clean, organized, business-focused aesthetic

---

## Typography

**Primary Font:** Inter (via Google Fonts)
- Headings: 600 weight
- Body: 400 weight  
- Labels/UI: 500 weight

**Scale:**
- H1: text-3xl (dashboard titles)
- H2: text-2xl (section headers)
- H3: text-xl (card headers, form sections)
- Body: text-base
- Small/Meta: text-sm
- Labels: text-sm font-medium

---

## Layout System

**Spacing Units:** Tailwind scale of 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 or p-8
- Section spacing: space-y-6 or space-y-8
- Card gaps: gap-6
- Form field spacing: space-y-4

**Grid System:**
- Dashboard: 12-column grid with sidebar
- Forms: Single column max-w-2xl for readability
- Property cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Data tables: Full width within container

**Containers:**
- Main content: max-w-7xl mx-auto
- Forms: max-w-2xl mx-auto
- Modals: max-w-3xl

---

## Component Library

### Navigation
- **Persistent Sidebar:** Fixed left sidebar (w-64) with role-based menu items
  - Logo at top
  - Navigation sections grouped by function
  - User profile/settings at bottom
  - Active state with subtle background fill
- **Top Bar:** Page title, breadcrumbs, role indicator, notifications bell

### Dashboards
- **Card-Based Layouts:** Elevated cards (shadow-md) for metrics, recent activity, quick actions
- **Stats Cards:** Grid of 3-4 metric cards showing key numbers (properties, active contracts, pending payments)
- **Activity Feed:** Timeline-style list of recent events
- **Quick Actions:** Prominent CTAs for primary workflows

### Forms (Critical Component)
- **Section Organization:** Large forms broken into logical sections with clear headers
- **Field Layout:** Vertical stacking, full-width inputs with top-aligned labels
- **Input Fields:** Consistent height (h-12), border (border-gray-300), rounded (rounded-lg)
- **File Upload:** Drag-drop zone with clear file type/size requirements, thumbnail previews
- **Multi-step Forms:** Progress indicator at top, "Back/Continue" navigation
- **Validation:** Inline error messages below fields, error state borders

### Data Tables
- **Structure:** Striped rows, sortable headers, pagination controls
- **Actions:** Row-level action buttons (view, download, edit)
- **Status Indicators:** Badge components for payment status, contract status
- **Responsive:** Stack to cards on mobile

### Document Viewing
- **PDF Viewer:** Embedded viewer with download/print controls
- **Signature Flow:** Clear visual indicators for signature required/completed
- **Version History:** List of uploaded documents with timestamps

### Payment Interface
- **Schedule Table:** Clear display of payment due dates, amounts, status
- **Payment CTA:** Prominent "Pay Now" button for pending charges
- **Receipt Display:** Clean layout for payment confirmations

### Property Listing
- **Image Gallery:** Primary image large, thumbnails below, lightbox on click
- **Details Grid:** Key information in organized grid layout
- **Action Panel:** Sticky panel with primary CTAs

### Inspection Checklist
- **Item List:** Checkbox items with expandable photo upload per item
- **Photo Grid:** Thumbnail grid showing all uploaded inspection photos
- **Status Summary:** Visual indicator of completion percentage

### Modals & Overlays
- **Modal Dialogs:** Centered, max-w-2xl, with clear header/footer separation
- **Confirmation Dialogs:** Simple, focused, with clear Yes/No actions
- **Side Panels:** Slide-in from right for detail views (w-96 or w-1/3)

### Notifications
- **Toast Notifications:** Top-right position for success/error messages
- **In-app Alerts:** Dismissible banners for important system messages

### Badges & Status
- **Payment Status:** Green (paid), Yellow (pending), Red (overdue), Gray (canceled)
- **Contract Status:** Blue (active), Gray (draft), Green (signed), Orange (renewal pending)

---

## Images

No large hero images - this is a utility application focused on efficiency.

**Image Usage:**
- Property photos in gallery layouts (aspect-ratio-4/3)
- User avatars in profiles/navigation (rounded-full)
- Inspection photos in grid layouts
- Document thumbnails for uploaded files
- Empty states with simple illustrations (undraw.co style)

---

## Animations

Minimal, functional animations only:
- Page transitions: Fade (150ms)
- Modal entry: Scale + fade (200ms)
- Dropdown menus: Slide down (150ms)
- Loading states: Spinner on primary actions
- No scroll-triggered or decorative animations

---

## Key User Flows Layout

**Landlord Dashboard:** Sidebar + top bar + 3-column metrics cards + property grid + recent contracts table

**Tenant Dashboard:** Sidebar + top bar + active contract card (prominent) + upcoming payments timeline + document upload section

**Property Creation:** Multi-step form with image upload, details entry, pricing configuration

**Contract Generation:** Review data form + AI generation loading state + PDF preview + download/sign actions

**Payment Schedule:** Table view with filters + status badges + "Generate Payment Link" action per row

**Onboarding Flow:** Progress stepper + single-section-per-step + document upload zones + guarantee selection cards