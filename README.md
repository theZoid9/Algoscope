# LinkLab — Three.js linked list visualizer

A self-contained, desktop-style web app that turns a singly linked list into an interactive 3D scene.

## Run it

Open `index.html` in a current desktop browser with an internet connection. Three.js loads from the jsDelivr CDN; no build step or backend is needed.

## Explore

- Drag the 3D scene to orbit; click any node to select it.
- Use append, prepend, insert after, delete, find, and reverse.
- Enable **Step-by-step mode** to pause on each linked-list or algorithm line, move back and forth, then apply that mutation or comparison.
- Switch between **Singly** and **Doubly** linked lists to reveal backward `prev` arrows, compare code, and see the memory-versus-navigation tradeoff.
- Pick **Stack** for LIFO push/pop at the top, or **Queue** for FIFO enqueue/dequeue from rear to front, using the same node structure.
- Use **2 ptr**, **Window**, **Binary**, or **Recursion** with the reusable **Array / Linked list** selector. The scene and code change together: arrays use direct indexes; linked lists use pointer traversal. Linked-list Two Pointers automatically uses the doubly linked representation because the right pointer needs `prev`.
- **Fibonacci** remains scalar (`n = 4`) and shows `0 → 1 → 1 → 2 → 3` as its fixed resulting sequence.
- Watch nodes move and pointers redraw after each mutation.
- Read the corresponding JavaScript method and execution trace.
