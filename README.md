# AlgoScope — Visual data structures and algorithms

An interactive learning app for arrays, linked lists, stacks, queues, and algorithms. Switch between animated 2D nodes and Three.js boxes while following the code and execution trace. Guided recursion and Fibonacci lessons walk through every call and return.

## Run it

Use Node.js 24 LTS and npm. From this directory:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. The migrated app requires HTTP; do not open the root `index.html` as a file. Dependencies are package-managed, not loaded from a Three.js CDN. Fonts remain an optional Google Fonts request.

For a production preview:

```sh
npm test
npm run build
npm run preview
```

Preview normally runs at `http://127.0.0.1:4173/`. Deploy the contents of `dist/` to a static host. No backend is required. The native Vite config loader uses Node's TypeScript support. In the restricted Windows Codex environment, the development dependency prebundler can fail with an ancestor-directory access error; the production build and preview are verified alternatives.

## Migration documentation

See [migration journal](docs/MIGRATION.md) for stages, decisions, verification and limitations, and [architecture guide](docs/ARCHITECTURE.md) for the state contract and extension workflow. The previous static app is preserved under `legacy/`; its original entry can still be opened directly with internet access for its CDN dependencies. Root `app.js` is retained for comparison but is no longer the active entry.

## Explore

- **2D boxes** opens by default with animated nodes, step highlights, code, and execution trace together. **3D boxes** shows the original Three.js boxes and orbit controls in the same compact panel layout. The layout wraps longer sequences and respects reduced-motion preferences.

- Drag the 3D scene to orbit; click any node to select it.
- Use append, prepend, insert after, delete, find, and reverse.
- Enable **Step-by-step mode** to pause on each linked-list or algorithm line, move back and forth, then apply that mutation or comparison.
- Switch between **Singly** and **Doubly** linked lists to reveal backward `prev` arrows, compare code, and see the memory-versus-navigation tradeoff.
- Pick **Stack** for LIFO push/pop at the top, or **Queue** for FIFO enqueue/dequeue from rear to front, using the same node structure.
- Use **2 ptr**, **Window**, **Binary**, or **Recursion** with the reusable **Array / Linked list** selector. The scene and code change together: arrays use direct indexes; linked lists use pointer traversal. Linked-list Two Pointers automatically uses the doubly linked representation because the right pointer needs `prev`.
- **Fibonacci** remains scalar (`n = 4`) and shows `0 → 1 → 1 → 2 → 3` as its fixed resulting sequence.
- Watch nodes move and pointers redraw after each mutation.
- Read the corresponding JavaScript method and execution trace.
- All collections support up to 10 nodes. Stack and Queue use singly linked nodes. Switch between light and dark themes with the bulb button.
