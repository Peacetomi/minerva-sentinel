# Minerva task-potential review

This bank records difficult, fair future behavior tasks supported by the existing architecture. The baseline is intended to be healthy; these are extension/edge-case candidates, not planted defects.

| # | Observable behavior | Interacting systems | Tempting wrong fixes | Likely existing patch surface | Behavioral test |
|---|---|---|---|---|---|
| 1 | Hidden selected cases survive filters; deleted cases are pruned after refresh | selection, filters, refresh, identity | clear on result change; intersect visible page; preserve forever | `SelectionContext`, `CasesPage`, `useCases` | select across pages, filter, delete fixture, refresh |
| 2 | Older command-search results never replace a newer query | debounce, request ownership, modal lifecycle | debounce only; compare lengths; clear on any response | `useCommandSearch`, `caseService` | controlled A/B resolution order |
| 3 | Two optimistic edits can overlap and only a failed edit rolls back | optimistic overlays, request ordering, server snapshot | restore full snapshot; clear all pending patches | `useCases`, `caseService` | resolve success/failure out of order |
| 4 | Bulk partial failure leaves only failed IDs selected for retry | bulk async, selection, announcements | clear selection; retry all; fail whole batch | `BulkToolbar`, `selectionReducer` | fail one deterministic ID |
| 5 | Background refresh updates remote fields without erasing dirty title/summary edits | form draft, refreshed record, versioning | reset whole form; ignore refresh entirely | `CaseEditForm`, `CaseDrawer` | edit title, refresh status, assert both |
| 6 | Drawer remains open for an existing refreshed record and closes sanely if removed | stable identity, refresh, focus | key by object; always close; render stale object | `CasesPage`, `CaseDrawer`, `useFocusReturn` | refresh same ID then delete ID |
| 7 | Closing drawer restores opener when present, fallback when row disappeared | focus, pagination/filter, drawer lifecycle | always focus stale node; focus body | `useFocusReturn`, `CasesPage` | open, filter opener away, close |
| 8 | Global shortcuts are suppressed only when keystrokes belong to editable controls | keyboard, contenteditable, modal | block all shortcuts in modal; tag-name-only check | `useGlobalShortcut`, `editableTarget` | input/textarea/contenteditable/body matrix |
| 9 | Applying a saved view resets incompatible page but preserves compatible sort/page-size | URL state, saved views, pagination | reset everything; preserve invalid page | `SavedViewsMenu`, `useUrlFilters`, `CasesPage` | save on page N then apply after count change |
| 10 | Browser back/forward restores filters without duplicated local state | router URL state, controls, async list | mirror params in effect state | `useUrlFilters`, `CaseFiltersBar` | navigate filter history and popstate |
| 11 | Equal sort keys remain stable across refreshes | sort, identity, refresh | array index; current order tie-break | `caseQuery` | identical keys with reordered fixture |
| 12 | Selection survives page-size changes by ID | selection, pagination, URL state | selected row positions | `selectionReducer`, `Pagination`, `CasesPage` | select then 12→24→12 |
| 13 | Live region announces one result per completed action, not rerenders | async completion, Strict Mode, announcements | announce in effect from data changes | `LiveRegion`, `CasesPage`, `BulkToolbar` | rerender during pending action |
| 14 | Background refresh preserves pending optimistic values while taking unrelated server fields | refresh, optimistic overlay, reconciliation | server wins all; client wins all | `useCases` | pending priority + remote assignee change |
| 15 | Deleting the active record removes only its selection and restores focus | drawer, delete, selection, focus | clear all selection; leave stale drawer | `CasesPage`, `SelectionContext`, `CaseDrawer` | active + another selected, delete active |
| 16 | Command result activation opens the exact stable record even if list refreshes | search result identity, drawer, list state | use visible index/object reference | `CommandPalette`, `CasesPage` | refresh between result and click |
| 17 | Preference hydration must not overwrite a change made during startup | persistence, effects, current UI | late hydration always wins | `usePersistedState`, `PreferencesContext` | delayed storage fixture + immediate user change |
| 18 | Storage events synchronize other tabs without echo writes | persistence, event lifecycle | write on every storage event; duplicate listeners | `usePersistedState` | dispatch storage event and spy writes |
| 19 | Strict Mode mounts exactly one effective global listener | effects, cleanup, keyboard | missing cleanup; unstable callback recreation | `useGlobalShortcut` | listener spy under StrictMode |
| 20 | Escape closes the topmost command palette before underlying drawer | capture/bubble, modal, drawer | every listener closes at once | `CommandPalette`, `CaseDrawer` | drawer open → palette open → Escape twice |
| 21 | Removed server records are pruned from selection regardless of current filters | refresh, all-ID membership, selection | reconcile against visible page | `useCases`, `SelectionContext` | hidden selected ID removed remotely |
| 22 | Active drawer record follows refreshed data by stable ID, not object reference | drawer, list snapshot, identity | store record object as source of truth | `CasesPage` | refresh changes active status |
| 23 | Optimistic status changes immediately affect visible filter counts without page flicker | optimistic state, derived filters, pagination | mutate service eagerly; duplicate count state | `useCases`, `caseQuery`, `CasesPage` | update under status filter |
| 24 | Retry after partial bulk failure targets only failed records and preserves successes | bulk result map, selection, retry | rerun original IDs; rollback successes | `BulkToolbar`, `caseService` | first partial fail, second retry |

## Strongest ten

The strongest candidates are 1–7, 9, 14 and 20. They each combine at least two independently reasonable state owners, admit multiple plausible incorrect solutions, can be specified as one observable requirement, and should fit in 1–5 existing files without manifest/tooling changes or new files. Their tests can be deterministic through the local service controller and semantic RTL/Playwright queries.
