# AlgoScope architecture

## Module ownership

| Module | Responsibility |
| --- | --- |
| `src/engine/index.ts` | Typed inputs, ten-value limit, lesson code and deterministic walkthrough snapshots |
| `src/engine/engine.test.ts` | Node tests for outcomes, edge cases, snapshot isolation and executable code examples |
| `src/App.tsx` | React controls, selection, theme, playback cursor, code highlighting, trace and commit/cancel |
| `src/components/Scene2D.tsx` | DOM boxes, directional arrows, array indexes and active-step styling |
| `src/components/Scene3D.tsx` | Lazy R3F canvas, rounded meshes, arrows, labels, camera fit and zoom |
| `src/main.tsx` | React mount and stylesheet loading |
| `src/app.css` | New renderer styles layered over the preserved shared CSS |
| `legacy/` | Pre-migration reference; not part of the new bundle |

## Walkthrough contract

`buildWalkthrough(input)` returns `{title, code, steps}` without DOM or Three.js access. A step contains independent `values`, `active` indexes, a zero-based `line`, an `explanation`, a copied recursion `stack`, and an optional numeric `result`. Never mutate a snapshot to move backward; select an earlier cursor instead. Snapshots are copied, not runtime-frozen objects, so consumers must treat them as read-only.

`Input` selects the lesson, array/list representation, list/stack/queue collection, value parameter, selected node index and doubly-linked mode. The generator validates finite values, collection size, required nonempty collections and window bounds. The UI additionally constrains entered values to integers 0–999. The engine deliberately accepts any finite numbers for reusable tests and future inputs.

## Interaction flow

1. Preview generates lesson code without mutating the collection.
2. Run captures a walkthrough. Next/Back/Play move one shared cursor.
3. Code, trace, call stack and either renderer consume that same step.
4. Apply change commits the last structural snapshot to the collection. Closing cancels it.
5. Algorithm Finish closes the lesson without replacing the user's collection with sorted/fixed example values.

Switching 2D/3D preserves the cursor. Changing lessons, representations, parameters or collection modes cancels the current run to prevent mismatched code and state. Reset restores `[15,28,46,63]`. Theme persists with the existing `linklab-theme` key. Playback timers clean up on state changes and unmount.

## Representation choices

Stack inserts/removes at the head (LIFO); Queue inserts at the tail and removes at the head (FIFO). Both are singly linked. Linked-list Two Pointers forces doubly mode to permit backwards traversal. Binary search sorts a copied sequence; its list example walks slow/fast pointers to a lower midpoint, while array code indexes directly. Recursive sum uses `[4,7,2,6]`; Fibonacci demonstrates scalar `fib(4)` with `[0,1,1,2,3]` reference values and a full call trace.

The scene uses logical ordered values rather than allocating live linked-node objects. Pointer rewiring is explained and highlighted stepwise, but intermediate reverse-link topology is not represented in snapshots. This limitation is explicit; adding an `edges` field is the natural next extension. Node identity is currently index-based, so reordering is not a complete identity-preserving movement animation.

## Adding a lesson

Extend `Lesson`, implement a pure branch in the engine and register the control in `App.tsx`. Supply real JS code lines and zero-based highlights that match each explanation. Copy state through the existing `add` helper. Add result, not-found/empty, invalid-input, and line-range tests; test both representations where applicable. Neither renderer should need algorithm-specific decisions.

## Rendering and performance

2D is the default and works without WebGL. 3D is loaded only on selection. R3F owns scene lifecycle; Drei supplies rounded geometry, labels and orbit controls. Labels face the screen for readability, including after orbiting backwards. Camera fit uses node count and viewport aspect; zoom is bounded. 3D motion and 2D CSS entry effects respect reduced-motion preferences. Renderer errors offer a 2D fallback.

The lazy 3D bundle remains large (approximately 910 kB minified in the verified build); optimize imports and loading next if mobile performance becomes a priority. No authentication, database or server was introduced.
