# The IIT Varanasi Store

A luxury ecommerce experience for IIT Varanasi alumni and patrons. The application pairs a golden autumn visual identity with a dynamic cart and concierge checkout workflow served by an Express backend.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm 9 or newer

## Getting started

```bash
npm install
npm run dev
```

This launches the Express server on [http://localhost:3000](http://localhost:3000) with hot reloading via `nodemon`. The server serves the luxury storefront UI and exposes JSON APIs for products, health checks, and checkout.

### Available scripts

- `npm run dev` – Start the development server with automatic restarts.
- `npm start` – Run the production server.
- `npm test` – Placeholder script (no automated tests yet).

## API reference

### `GET /api/products`
Returns the full product catalogue grouped into collections such as `signature`, `atelier`, and `souvenirs`.

### `POST /api/checkout`
Accepts `customer` details and cart `items`, validates availability, and returns an order confirmation payload for the concierge team. The cart overlay in the UI uses this endpoint to generate a confirmation ID.

## Project structure

```
.
├── data
│   └── products.js        # Luxury catalogue data
├── public
│   ├── index.html         # Autumn-inspired storefront experience
│   ├── script.js          # Dynamic cart, checkout, and toast interactions
│   ├── styles.css         # Visual identity and layout system
│   └── 404.html           # Soft-touch not found page
├── src
│   └── server.js          # Express server with product + checkout APIs
└── package.json
```

## Concierge checkout flow

1. Select curated pieces from any collection.
2. View the floating cart drawer to adjust quantities or remove items.
3. Launch the checkout overlay to share contact and delivery preferences.
4. Receive an order confirmation ID and concierge follow-up for payment completion.

## Accessibility & enhancements

- Cart updates announce counts via ARIA live regions.
- Keyboard support for overlays, escape-to-close, and focusable controls.
- Reduced-motion preferences respected throughout transitions.

Feel free to tailor the product data or integrate with a real payment provider. The current setup keeps everything in memory for quick iteration.
