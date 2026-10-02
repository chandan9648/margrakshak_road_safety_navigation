MARGRAKSHAK — UI / UX refresh

OPEN THE PROTOTYPE
Extract the ZIP, then open code.html in Chrome or Edge.
Keep polish.css, interactions.js and tailwind.js beside code.html.
No npm install, server, API keys or backend setup required.
The app works with bundled styles; the optional Google font requires internet.

WHAT CHANGED
- New home layout, warm neutral palette, deep green primary action and custom map illustration.
- Consistent typography, spacing, cards, focus indicators and mobile navigation.
- Search filtering and a useful no-results state.
- Destination-aware route preview and safe/faster route comparison.
- Saved routes with removal and optional browser-local persistence.
- Map zoom, recentering and visible layer controls.
- More accessible dialogs: keyboard support, Escape, focus return, focus trapping.
- Report selections and clearly labeled local-only confirmation.
- Fixed incorrect Home shortcut, over-limit speed status and hidden feedback.
- Reduced motion support and scrollable content on shorter screens.
- Original five views and hazard simulation retained; no backend added.

DEMO BOUNDARIES
Maps are schematic, not geographic navigation. All routes, metrics, reports,
notifications, distances and alerts are sample content. The driving simulator
uses the NH 48 / Gurugram sample route. Selecting a different route switches
back to that sample when starting the driving demonstration. There is no GPS,
live traffic, actual voice output or hazard submission. Saved routes are stored
only in this browser when storage is available. No account or personal data needed.

FILES
code.html                Main prototype and original UI simulation logic
polish.css               Updated visual design and responsive rules
interactions.js          UI-only interaction improvements
tailwind.js              Bundled Tailwind runtime from the original dependency
screen.png               Updated home screen
route-preview.png        Route preview example
navigation-preview.png   Driving simulation example

VALIDATION
Browser flow checked: destination search, no-results state, destination propagation,
saving a route, report confirmation, driving simulation and trip summary.
Page overflow checked at 360, 390, 768 and 1440 pixel viewport widths.
