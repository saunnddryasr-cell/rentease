# RentEase Frontend Architecture

This folder represents the modular React 19 Frontend layer for RentEase:

- **Entry Point**: `src/main.tsx` mounted via `index.html`
- **Application Shell**: `src/App.tsx`
- **Component Modules**: `src/components/`
  - `Navbar.tsx`: 3-Zone navigation header with real-time REST API sync indicator
  - `Hero.tsx`: Showcase campaign banner with interactive tenure savings calculator
  - `ProductCard.tsx`: High-fidelity card with zero-pill metadata and dynamic 3M, 6M, 12M pricing
  - `ProductDetailModal.tsx`: Contiguous purchase module (PDP) with PIN check and specifications
  - `CartDrawer.tsx`: Bag checkout with delivery date/slot scheduler and instant KYC simulation
  - `UserRentalsPortal.tsx`: Self-service portal for active subscriptions, extensions, relocations, and maintenance tickets
  - `AdminConsole.tsx`: Operations console with live KPIs and MongoDB Atlas synchronization panel
  - `PRDDocModal.tsx`: Built-in PRD case study (Unified Mentor & Rent Mojo)
  - `HowItWorks.tsx`: 4-step rental lifecycle and buying-vs-renting comparison
  - `Footer.tsx`: Service guarantees and regional hub coverage
- **API Services Layer**: `src/services/api.ts` (and `frontend/services/api.ts`)
  - Communicates directly with backend routes (`/api/products`, `/api/orders`, `/api/tickets`, `/api/claims`, `/api/cities`, `/api/analytics/kpis`, `/api/health`)
- **Types**: `src/types/index.ts` (and `frontend/types/index.ts`)
