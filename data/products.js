export const products = [
  {
    id: 'heritage-tee',
    name: 'Banaras Heritage Tee',
    price: 2499,
    currency: 'INR',
    category: 'apparel',
    collection: 'signature',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Sandalwood Taupe', 'Moonlit Noir'],
    description: 'Ultra-soft pima cotton with handwoven silk neckline detailing.',
    badges: ['New Arrival', 'Limited 200'],
    mediaClass: 'gradient-tshirt'
  },
  {
    id: 'golden-crest-cap',
    name: 'Golden Crest Cap',
    price: 1899,
    currency: 'INR',
    category: 'accessories',
    collection: 'signature',
    colors: ['Antique Noir', 'Autumn Sand'],
    description: 'Structured silhouette with gold-thread IIT Varanasi insignia.',
    badges: ['Bestseller'],
    mediaClass: 'gradient-cap'
  },
  {
    id: 'legacy-souvenir-set',
    name: 'Legacy Souvenir Set',
    price: 3499,
    currency: 'INR',
    category: 'souvenir',
    collection: 'signature',
    description: 'Brass bookmark, silk pocket square, and engraved journal.',
    badges: ['Collector'],
    mediaClass: 'gradient-souvenir'
  },
  {
    id: 'riverfront-candle',
    name: 'Riverfront Candle',
    price: 1299,
    currency: 'INR',
    category: 'souvenir',
    collection: 'souvenirs',
    description: 'Hand-poured soy candle inspired by twilight over the Ganga.',
    badges: ['Artisan Crafted'],
    mediaClass: 'souvenir-candle'
  },
  {
    id: 'deans-desk-pen',
    name: "Dean's Desk Pen",
    price: 1999,
    currency: 'INR',
    category: 'souvenir',
    collection: 'souvenirs',
    description: 'Weighted brass pen with precision nib and engraved initials.',
    badges: ['Engravable'],
    mediaClass: 'souvenir-pen'
  },
  {
    id: 'founders-journal',
    name: "Founder's Chronicle Journal",
    price: 2299,
    currency: 'INR',
    category: 'souvenir',
    collection: 'souvenirs',
    description: 'Hand-bound leather journal with gilt-edged archival pages.',
    badges: ['Complimentary Monogram'],
    mediaClass: 'souvenir-journal'
  },
  {
    id: 'velvet-varsity-jacket',
    name: 'Velvet Varsity Jacket',
    price: 5799,
    currency: 'INR',
    category: 'apparel',
    collection: 'atelier',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Burnished velvet with zari crest, satin lining, and brass buttons.',
    badges: ['Made to Order'],
    mediaClass: 'atelier-jacket'
  },
  {
    id: 'autumn-stole',
    name: 'Autumn Silk Stole',
    price: 2699,
    currency: 'INR',
    category: 'accessories',
    collection: 'atelier',
    colors: ['Champagne Gold'],
    description: 'Handwoven Banarasi silk with hand-tied tassels and zari border.',
    badges: ['Heritage Loom'],
    mediaClass: 'atelier-stole'
  },
  {
    id: 'heritage-hamper',
    name: 'Heritage High Tea Hamper',
    price: 3199,
    currency: 'INR',
    category: 'souvenir',
    collection: 'atelier',
    description: 'Curated tea blend, brass coasters, and artisanal mithai pairing.',
    badges: ['Limited Release'],
    mediaClass: 'atelier-hamper'
  }
];

export function findProductById(id) {
  return products.find((product) => product.id === id);
}
