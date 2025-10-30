import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

import { products, findProductById } from '../data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

app.use((req, _res, next) => {
  req.requestId = nanoid(8);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/products', (_req, res) => {
  res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      error: 'ProductNotFound',
      message: `No product found for id ${req.params.id}`,
      requestId: req.requestId
    });
  }

  return res.json({ product });
});

app.post('/api/checkout', (req, res) => {
  const { items, customer } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'InvalidCart',
      message: 'Your cart is empty. Please add products before checking out.',
      requestId: req.requestId
    });
  }

  const invalidItem = items.find((item) => {
    const product = findProductById(item.id);
    return !product || typeof item.quantity !== 'number' || item.quantity < 1;
  });

  if (invalidItem) {
    return res.status(400).json({
      error: 'InvalidCartItem',
      message: 'One or more cart items are invalid.',
      requestId: req.requestId
    });
  }

  if (!customer || !customer.email || !customer.name) {
    return res.status(400).json({
      error: 'InvalidCustomer',
      message: 'Customer name and email are required to complete checkout.',
      requestId: req.requestId
    });
  }

  const orderId = `IV-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

  const summary = items.map((item) => {
    const product = findProductById(item.id);
    const amount = product.price * item.quantity;
    return {
      id: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      currency: product.currency,
      lineTotal: amount
    };
  });

  const grandTotal = summary.reduce((total, line) => total + line.lineTotal, 0);

  return res.status(201).json({
    orderId,
    requestId: req.requestId,
    summary,
    totals: {
      currency: 'INR',
      items: summary.length,
      grandTotal
    },
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? null,
      address: customer.address ?? null
    },
    message: 'Thank you for choosing The IIT Varanasi Store. A concierge will reach out shortly to confirm your order.'
  });
});

const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

app.use((req, res) => {
  if (req.accepts('html')) {
    return res.status(404).sendFile(path.join(publicDir, '404.html'));
  }

  return res.status(404).json({
    error: 'NotFound',
    message: 'We could not find the resource you requested.',
    requestId: req.requestId
  });
});

app.listen(port, () => {
  console.log(`The IIT Varanasi Store server listening on http://localhost:${port}`);
});
