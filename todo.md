Sistema de Controle de Estoque Industrial - Frontend
Design Guidelines
Design References
Industrial/Manufacturing dashboards: Clean, data-focused, professional
Style: Modern Industrial Dark Theme
Color Palette
Primary Background: #0F172A (Slate 900)
Secondary Background: #1E293B (Slate 800)
Card Background: #1E293B with border #334155
Accent: #3B82F6 (Blue 500)
Accent Hover: #2563EB (Blue 600)
Success: #22C55E (Green 500)
Warning: #F59E0B (Amber 500)
Danger: #EF4444 (Red 500)
Text Primary: #F8FAFC (Slate 50)
Text Secondary: #94A3B8 (Slate 400)
Typography
Font: Inter (sans-serif)
Headings: font-weight 700
Body: font-weight 400
Key Component Styles
Cards: Dark slate background, subtle border, rounded-lg
Tables: Striped rows, hover highlight
Buttons: Rounded-md, clear color coding (blue=action, red=delete, green=save)
Modals/Dialogs: Centered overlay with dark backdrop
Layout
Sidebar navigation (collapsible on mobile)
Main content area with breadcrumb
Responsive: sidebar collapses to top nav on mobile
Development Tasks
Files to Create/Modify:
src/lib/types.ts - TypeScript interfaces
src/lib/dataService.ts - localStorage data service (simulating API)
src/lib/productionEngine.ts - Production suggestion algorithm
src/components/Layout.tsx - Main layout with sidebar navigation
src/pages/ProductsPage.tsx - Products CRUD + raw material association
src/pages/RawMaterialsPage.tsx - Raw materials CRUD
src/pages/ProductionPage.tsx - Production suggestion display
src/App.tsx - Update routes
index.html - Update title