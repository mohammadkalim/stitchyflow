# UI/UX Design Document

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Introduction

### 1.1 Purpose
This document defines the UI/UX design principles, guidelines, and specifications for StitchyFlow, ensuring a consistent, modern, and user-friendly experience across all platforms.

### 1.2 Design Philosophy
- **Modern & Corporate:** Professional appearance suitable for business use
- **User-Centric:** Intuitive navigation and clear information hierarchy
- **Responsive:** Seamless experience across all devices
- **Accessible:** WCAG 2.1 AA compliance considerations
- **Performance-Focused:** Fast loading and smooth interactions

---

## 2. Design Principles

### 2.1 Core Principles

#### 2.1.1 Simplicity
- Clean, uncluttered interfaces
- Clear visual hierarchy
- Minimal cognitive load
- Progressive disclosure of information

#### 2.1.2 Consistency
- Uniform design patterns across all pages
- Consistent terminology and labeling
- Standardized component behavior
- Predictable navigation structure

#### 2.1.3 Feedback
- Immediate response to user actions
- Clear loading states
- Informative error messages
- Success confirmations

#### 2.1.4 Efficiency
- Minimal clicks to complete tasks
- Smart defaults and auto-fill
- Keyboard shortcuts for power users
- Quick access to frequent actions

---

## 3. Visual Design System

### 3.1 Color Palette

#### Primary Colors
```
Primary Blue: #1976D2
- Used for: Primary actions, links, active states
- RGB: 25, 118, 210
- Usage: Buttons, navigation highlights, important CTAs

Primary Dark: #115293
- Used for: Hover states, emphasis
- RGB: 17, 82, 147

Primary Light: #4791DB
- Used for: Backgrounds, subtle highlights
- RGB: 71, 145, 219
```

#### Secondary Colors
```
Secondary Teal: #00897B
- Used for: Secondary actions, accents
- RGB: 0, 137, 123

Secondary Orange: #FF6F00
- Used for: Warnings, important notifications
- RGB: 255, 111, 0
```

#### Neutral Colors
```
Dark Gray: #212121 (Text primary)
Medium Gray: #757575 (Text secondary)
Light Gray: #BDBDBD (Borders, dividers)
Background Gray: #F5F5F5 (Page backgrounds)
White: #FFFFFF (Cards, containers)
```

#### Status Colors
```
Success Green: #4CAF50
Error Red: #F44336
Warning Orange: #FF9800
Info Blue: #2196F3
```

### 3.2 Typography

#### Font Family
```
Primary Font: 'Roboto', sans-serif
Secondary Font: 'Open Sans', sans-serif
Monospace: 'Roboto Mono', monospace (for code/numbers)
```

#### Font Sizes
```
H1: 32px / 2rem (Page titles)
H2: 28px / 1.75rem (Section headers)
H3: 24px / 1.5rem (Subsection headers)
H4: 20px / 1.25rem (Card titles)
H5: 18px / 1.125rem (Small headers)
H6: 16px / 1rem (Labels)
Body: 16px / 1rem (Regular text)
Small: 14px / 0.875rem (Helper text)
Caption: 12px / 0.75rem (Captions, footnotes)
```

#### Font Weights
```
Light: 300 (Subtle text)
Regular: 400 (Body text)
Medium: 500 (Emphasis)
Bold: 700 (Headers, important text)
```

### 3.3 Spacing System

#### Base Unit: 8px

```
xs: 4px (0.5 unit)
sm: 8px (1 unit)
md: 16px (2 units)
lg: 24px (3 units)
xl: 32px (4 units)
xxl: 48px (6 units)
```

### 3.4 Border Radius
```
Small: 4px (Buttons, inputs)
Medium: 8px (Cards, containers)
Large: 12px (Modals, large cards)
Round: 50% (Avatars, icon buttons)
```

### 3.5 Shadows
```
Level 1: 0 1px 3px rgba(0,0,0,0.12)
Level 2: 0 2px 6px rgba(0,0,0,0.16)
Level 3: 0 4px 12px rgba(0,0,0,0.20)
Level 4: 0 8px 24px rgba(0,0,0,0.24)
```

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button
```
Background: Primary Blue (#1976D2)
Text: White
Padding: 12px 24px
Border Radius: 4px
Font Weight: 500
Hover: Primary Dark (#115293)
Active: Darker shade with shadow
Disabled: Gray with 50% opacity
```

#### Secondary Button
```
Background: Transparent
Border: 1px solid Primary Blue
Text: Primary Blue
Padding: 12px 24px
Hover: Light blue background
```

#### Text Button
```
Background: Transparent
Text: Primary Blue
Padding: 8px 16px
Hover: Light background
```

### 4.2 Input Fields

#### Text Input
```
Height: 48px
Padding: 12px 16px
Border: 1px solid Light Gray
Border Radius: 4px
Focus: Primary Blue border, shadow
Error: Red border
Label: Above input, 14px
Helper Text: Below input, 12px, gray
```

#### Select Dropdown
```
Same as text input
Dropdown icon on right
Max height: 300px with scroll
Option hover: Light blue background
```

#### Checkbox & Radio
```
Size: 20px
Border: 2px solid Medium Gray
Checked: Primary Blue background
Label: 16px, right aligned
```

### 4.3 Cards

#### Standard Card
```
Background: White
Border Radius: 8px
Shadow: Level 2
Padding: 24px
Margin: 16px
Hover: Level 3 shadow (if clickable)
```

#### Dashboard Card
```
Background: White
Border Radius: 8px
Shadow: Level 1
Padding: 20px
Header: Bold, 18px
Content: 16px
Icon: Top right, 24px
```

### 4.4 Navigation

#### Top Navigation Bar
```
Height: 64px
Background: White
Shadow: Level 1
Logo: Left, 40px height
Menu Items: Center/Right
User Avatar: Right, 36px
```

#### Sidebar Navigation
```
Width: 260px (expanded), 64px (collapsed)
Background: Dark Gray (#212121)
Text: White
Active Item: Primary Blue background
Hover: Lighter background
Icons: 24px
```

### 4.5 Tables

#### Data Table
```
Header: Bold, Light gray background
Row Height: 56px
Border: Bottom border only
Hover: Light background
Pagination: Bottom, centered
Actions: Right column, icon buttons
```

### 4.6 Modals

#### Dialog Modal
```
Max Width: 600px
Background: White
Border Radius: 12px
Shadow: Level 4
Padding: 32px
Header: 24px, bold
Actions: Bottom right
Overlay: Black, 50% opacity
```

---

## 5. Layout Specifications

### 5.1 Grid System

#### Desktop (1200px+)
```
Columns: 12
Gutter: 24px
Margin: 48px
Container Max Width: 1440px
```

#### Tablet (768px - 1199px)
```
Columns: 8
Gutter: 16px
Margin: 32px
```

#### Mobile (< 768px)
```
Columns: 4
Gutter: 16px
Margin: 16px
```

### 5.2 Breakpoints
```
xs: 0px - 599px (Mobile)
sm: 600px - 959px (Tablet)
md: 960px - 1279px (Desktop)
lg: 1280px - 1919px (Large Desktop)
xl: 1920px+ (Extra Large)
```

---

## 6. Page Layouts

### 6.1 Homepage Layout
```
┌─────────────────────────────────────┐
│         Navigation Bar              │
├─────────────────────────────────────┤
│         Hero Section                │
│    (Full width, image/gradient)     │
├─────────────────────────────────────┤
│      Features Section               │
│    (3 columns on desktop)           │
├─────────────────────────────────────┤
│    How It Works Section             │
│    (Step-by-step guide)             │
├─────────────────────────────────────┤
│    Testimonials Section             │
│    (Carousel/Grid)                  │
├─────────────────────────────────────┤
│         Footer                      │
└─────────────────────────────────────┘
```

### 6.2 Dashboard Layout
```
┌─────────────────────────────────────┐
│         Top Navigation              │
├────┬────────────────────────────────┤
│    │    Dashboard Header            │
│ S  │    (Title, breadcrumbs)        │
│ i  ├────────────────────────────────┤
│ d  │  ┌──────┐  ┌──────┐  ┌──────┐│
│ e  │  │ Card │  │ Card │  │ Card ││
│ b  │  └──────┘  └──────┘  └──────┘│
│ a  ├────────────────────────────────┤
│ r  │    Main Content Area           │
│    │    (Tables, charts, forms)     │
│    │                                │
└────┴────────────────────────────────┘
```

### 6.3 Form Layout
```
┌─────────────────────────────────────┐
│         Form Title                  │
├─────────────────────────────────────┤
│  Label                              │
│  [Input Field                    ]  │
│  Helper text                        │
├─────────────────────────────────────┤
│  Label                              │
│  [Input Field                    ]  │
├─────────────────────────────────────┤
│  [Cancel]          [Submit Button]  │
└─────────────────────────────────────┘
```

---

## 7. User Flows

### 7.1 Customer Order Flow
```
1. Browse Tailors
   ↓
2. View Tailor Profile
   ↓
3. Click "Place Order"
   ↓
4. Fill Order Form
   - Garment type
   - Measurements
   - Special instructions
   - Upload images
   ↓
5. Review Order Summary
   ↓
6. Confirm Order
   ↓
7. Payment
   ↓
8. Order Confirmation
   ↓
9. Track Order Status
```

### 7.2 Tailor Order Management Flow
```
1. Receive Order Notification
   ↓
2. View Order Details
   ↓
3. Accept/Reject Order
   ↓
4. Update Order Status
   - In Progress
   - Upload progress photos
   - Add notes
   ↓
5. Mark as Completed
   ↓
6. Customer Review
```

---

## 8. Responsive Design

### 8.1 Mobile Adaptations

#### Navigation
- Hamburger menu for mobile
- Bottom navigation for key actions
- Collapsible sidebar

#### Cards
- Stack vertically on mobile
- Full width on small screens
- Reduced padding

#### Tables
- Horizontal scroll
- Card view alternative
- Priority columns only

#### Forms
- Full width inputs
- Larger touch targets (48px min)
- Simplified multi-step forms

---

## 9. Animations & Transitions

### 9.1 Timing Functions
```
Fast: 150ms (Hover effects)
Normal: 300ms (Standard transitions)
Slow: 500ms (Page transitions)
Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
```

### 9.2 Animation Types

#### Fade In
```
opacity: 0 → 1
duration: 300ms
```

#### Slide In
```
transform: translateY(20px) → translateY(0)
opacity: 0 → 1
duration: 400ms
```

#### Scale
```
transform: scale(0.95) → scale(1)
duration: 200ms
```

---

## 10. Accessibility Guidelines

### 10.1 Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### 10.2 Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip navigation links

### 10.3 Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Form labels properly associated

### 10.4 Touch Targets
- Minimum size: 48x48px
- Adequate spacing between targets
- Clear active states

---

## 11. Icon System

### 11.1 Icon Library
**Material Icons** (Material-UI default)

### 11.2 Icon Sizes
```
Small: 16px
Medium: 24px (default)
Large: 32px
Extra Large: 48px
```

### 11.3 Common Icons
```
- Home: home
- Dashboard: dashboard
- Orders: shopping_bag
- Profile: person
- Settings: settings
- Notifications: notifications
- Search: search
- Menu: menu
- Close: close
- Edit: edit
- Delete: delete
- Add: add
- Check: check
- Arrow: arrow_forward
```

---

## 12. Loading States

### 12.1 Page Loading
- Full page spinner (centered)
- Skeleton screens for content
- Progress bar for multi-step processes

### 12.2 Component Loading
- Inline spinners for buttons
- Shimmer effect for cards
- Disabled state during loading

### 12.3 Data Loading
- Table skeleton rows
- Card placeholders
- "Loading..." text with animation

---

## 13. Error States

### 13.1 Form Errors
- Red border on invalid fields
- Error icon next to field
- Error message below field
- Scroll to first error on submit

### 13.2 Page Errors
- 404: Friendly "Page not found" message
- 500: "Something went wrong" with retry
- Network error: "Connection lost" banner

### 13.3 Empty States
- Friendly illustration
- Descriptive message
- Call-to-action button
- Helpful suggestions

---

## 14. Notification System

### 14.1 Toast Notifications
```
Position: Top right
Duration: 4 seconds (auto-dismiss)
Types: Success, Error, Warning, Info
Max visible: 3 at a time
Animation: Slide in from right
```

### 14.2 In-App Notifications
```
Badge on notification icon
Dropdown panel
Unread indicator
Mark as read action
Clear all option
```

---

## 15. Design Deliverables

### 15.1 Wireframes
- Low-fidelity sketches
- User flow diagrams
- Information architecture

### 15.2 Mockups
- High-fidelity designs
- All key pages and states
- Mobile and desktop versions

### 15.3 Prototypes
- Interactive clickable prototypes
- User testing versions
- Animation demonstrations

### 15.4 Style Guide
- Component library
- Design tokens
- Usage guidelines

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
