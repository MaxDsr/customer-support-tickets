# Drafts file content discussion
_Exported on 2/24/2026 at 15:11:28 GMT+1 from Cursor (2.5.20)_

---

**User**

@drafts.txt (74-75) 

---

**Cursor**


Turning TicketCard into a folder with encapsulated styles. Checking the current structure and component code.



Searching for where those styles are defined:



Reading App.css to extract TicketCard-related styles and skeleton styles.



Creating the TicketCard folder with encapsulated styles scoped under the `.TicketCard` class.



Updating App.tsx SkeletonCard to use `TicketCard` and `TicketCard--skeleton`, and removing moved styles from App.css.



Summary of changes:

**1. TicketCard as a folder**
- **`frontend/src/components/TicketCard/index.tsx`** – Component lives here; root element uses `className="TicketCard"` and imports `./styles.css`.
- **`frontend/src/components/TicketCard/styles.css`** – All styles for the card and its skeleton are defined here.

**2. Encapsulation under `.TicketCard`**
- Every rule in `styles.css` is scoped under `.TicketCard` (e.g. `.TicketCard .ticket-card-body`, `.TicketCard .badge--open`, `.TicketCard .btn--danger`). They only apply inside an element with class `TicketCard`.
- Root card: `.TicketCard` (replacing `.ticket-card`).
- Skeleton: `.TicketCard.TicketCard--skeleton` and `.TicketCard .skeleton`, etc., with a local `TicketCard-shimmer` keyframe to avoid clashes.
- Responsive rules for the card are in the same file and also scoped under `.TicketCard`.

**3. App updates**
- **App.tsx**: `SkeletonCard` now uses `className="TicketCard TicketCard--skeleton"` so it uses the same encapsulated styles (loaded via the existing `TicketCard` import).
- **App.css**: All ticket-card, badge, status-select, and skeleton rules that were only used by the card were removed; layout (e.g. `.tickets-list`) and global pieces (e.g. `.btn--danger` for the Retry button) stay in `App.css`.

**4. Cleanup**
- **`frontend/src/components/TicketCard.tsx`** was removed; the component is now only in `TicketCard/index.tsx`.

Imports like `import TicketCard from './components/TicketCard'` still work because they resolve to `TicketCard/index.tsx`. No new linter issues were reported.

---

**User**

Let's do the same for the SkeletonCard. Move it to components

---

**Cursor**


Moving SkeletonCard into its own component folder with encapsulated styles. Checking its structure in App and which styles it uses.



Creating the SkeletonCard component folder and encapsulated styles.



Summary of changes:

**1. New SkeletonCard component**
- **`frontend/src/components/SkeletonCard/index.tsx`** – Renders the skeleton card with root class `SkeletonCard` and BEM-style inner classes: `SkeletonCard-body`, `SkeletonCard-meta`, `SkeletonCard-customer`, `SkeletonCard-actions`.
- **`frontend/src/components/SkeletonCard/styles.css`** – All styles are scoped under `.SkeletonCard`: card layout, pointer-events, and every `.skeleton` / `.skeleton--*` rule. Uses a local `SkeletonCard-shimmer` keyframe and includes the same 768px responsive behavior.

**2. App.tsx**
- Removed the inline `SkeletonCard` function.
- Added `import SkeletonCard from './components/SkeletonCard'`.
- Normalized TicketCard import to `'./components/TicketCard'` (no `/index.tsx`).
- Existing usage `{Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}` is unchanged.

**3. TicketCard styles**
- Removed all skeleton-related rules from `TicketCard/styles.css` (keyframes, `TicketCard--skeleton`, and every `.skeleton` rule), since skeleton styling now lives in SkeletonCard.

SkeletonCard is now a separate component with its own folder and encapsulated styles under the `.SkeletonCard` class.

