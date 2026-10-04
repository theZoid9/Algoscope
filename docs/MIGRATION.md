# AlgoScope migration journal

## Scope and preservation

The migration proceeds in order: a pure walkthrough engine, React interface, then React Three Fiber scene. The existing static app is preserved under `legacy/` so its appearance and behavior remain available for comparison. No repository history is reset and publishing is a separate operation.

## Stage 1 — walkthrough engine

Each lesson produces immutable snapshots containing values, active indexes, source line, explanation, and call stack. Rendering has no responsibility for algorithm decisions. Back/Next reads snapshots rather than reversing mutations. Structural changes obey a shared ten-node ceiling. Linked-list and array code are separate lesson definitions.

## Stage 2 — interface

React owns selection, lesson, theme, and playback position. The code panel, trace, 2D scene and step controls read the same snapshot. Switching renderers does not restart a lesson. Step controls stay beneath code. Stack and Queue disable Doubly mode. Theme preference is stored locally.

## Stage 3 — scene

React Three Fiber owns Three.js resources and scene lifecycle. Rounded boxes preserve the original visual form, with lights, labels, arrows and orbit controls. A bounds-aware camera provides zoom and fit controls. The 3D scene is lazy loaded so the 2D view does not initialize WebGL. Both renderers use one snapshot and selection model.

## Verification plan

Run TypeScript checking and a production build. Engine tests cover recursive results, Fibonacci calls/returns, both search outcomes, window sums, structural operations, and limits. Record actual results below; a passing build does not establish browser visual quality.

## Development change

The new app uses Vite and package-managed dependencies. Use Node 24 LTS, `npm ci`, then `npm run dev`; production uses `npm run build` and `npm run preview`. The legacy app can still be opened as a static page. The new development entry requires HTTP rather than opening a file URL.

## Migration record — 2026-10-04

1. Preserved the original static source in `legacy/` before replacing the root HTML entry. Original root scripts/styles remain for comparison; React still imports shared CSS to keep the compact layout familiar.
2. Extracted every structural and algorithm lesson into a typed pure engine. Added full recursion/Fibonacci call-and-return snapshots, array/list code variants, and a shared ten-value ceiling. Backtracking now selects copied states instead of attempting to undo mutations.
3. Rebuilt the interface in React. Kept the side controls, shared code/trace layout, theme bulb, stack/queue restrictions, active source line, and step controls under the code. Added timer cleanup and explicit structural Apply versus algorithm Finish.
4. Recreated the original rounded-box scene in React Three Fiber. Added lazy loading, directional arrows, active colors, camera fit, zoom controls, readable screen-facing overlays, and an error fallback. Browser smoke testing revealed the first node's value overlay disappearing. Consolidating tags alone did not fix it; the final correction supplies a stable sibling portal outside the Canvas-owned DOM, with one value/tag overlay per node.
5. Replaced CDN library imports with a lockfile-managed dependency graph. Added TypeScript checking, engine tests, relative deployment asset paths and a native Vite config loader.

## Actual verification

- `npm test`: 9/9 passing after the final engine changes. Covers sum 19, fib(4)=3, search outcomes, window sum 109, LIFO/FIFO, insertion limits, invalid/empty inputs, independent snapshots and valid highlighted lines. Executes the displayed binary/window examples for arrays and linked lists.
- `npm run build`: TypeScript and Vite production bundling pass. Vite warns that the lazy 3D chunk exceeds 500 kB; this is recorded, not suppressed.
- `npm run preview`: starts at `http://127.0.0.1:4173/`.
- Browser smoke checks: app renders, recursion starts with 18 steps, Next advances the explanation and source line, switching to 3D preserves Step 2, rounded boxes render, and zoom responds. Further post-fix checks are recorded below.
- Post-fix browser verification: all four 3D values including the head label render with the stable external portal. Screenshots confirm the rounded boxes and directional arrows. Added zero minimum widths to nested grid panels to avoid intrinsic-content overflow in the compact layout.
- Completed the entire recursion lesson in the browser: Step 18/18 shows result 19, highlights return line 4, clears the call stack, and retains the active head value overlay. This is a smoke check, not exhaustive responsive/accessibility coverage.
- `npm run dev`: Vite starts, but its esbuild dependency prebundler fails in this restricted Windows environment while resolving ancestor directories. Native config loading fixes config bundling, not dependency scanning. Production build/preview works. This is not evidence that normal unsandboxed development will fail, and hot reload is not verified here.

## Deliberate changes and remaining limits

This is a staged architectural migration, not a pixel-identical rewrite. The former full/compact layout variants are consolidated into the familiar compact layout. Labels now billboard rather than placing mirrored text on mesh faces. The 2D renderer uses CSS entry/highlight effects; structural identity-preserving movement and intermediate reversed-edge topology are future enhancements. See `ARCHITECTURE.md` for details. The old entry remains a rollback/reference, not deleted source. No GitHub push or repository history rewrite is part of this migration.
