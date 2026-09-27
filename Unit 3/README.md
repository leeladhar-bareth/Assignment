# Unit 3 — MongoDB Aggregation Pipeline (E-Commerce)

**MCA Assignment – Unit 3**

**Database:** `ecommerce_practice`  
**Collections:** `customers` (20), `products` (30), `orders` (30), `payments` (20)

---

## How to Run (MongoDB Compass)

1. Select database `ecommerce_practice`.
2. Open the correct **collection**.
3. **Aggregations** tab → **TEXT** mode.
4. Paste **only** the array `[ ... ]` (not `db.collection.aggregate`).
5. Click **Run**.

---

## Operators

| Operator | Questions |
|----------|-----------|
| `$match` | 1–5, 18, 22 |
| `$project` | 1–5, 16–18 |
| `$sort` | 1–4, 6–10, 12–13, 17, 19–22 |
| `$limit` | 3, 4, 13, 22 |
| `$group` | 6–15, 19–23 |
| `$unwind` | 11–15, 21–23 |
| `$lookup` | 13, 16–23 |
| `$facet` | 24–25 |

---

## Q1. Delivered orders — project fields, sort newest first

**Collection:** `orders`

```js
[
  { $match: { status: "Delivered" } },
  {
    $project: {
      _id: 0,
      orderDate: 1,
      status: 1,
      shippingCity: 1,
      customerId: 1
    }
  },
  { $sort: { orderDate: -1 } }
]
```

**Answer (18 Delivered — sample):**

| orderDate | status | shippingCity |
|-----------|--------|--------------|
| 2026-08-30 | Delivered | Chennai |
| 2026-08-28 | Delivered | Noida |
| 2026-08-26 | Delivered | Bhopal |
| 2026-08-25 | Delivered | Surat |
| 2026-08-23 | Delivered | Bangalore |
| 2026-08-21 | Delivered | Raipur |

---

## Q2. Electronics with rating ≥ 4.5

**Collection:** `products`

```js
[
  { $match: { category: "Electronics", rating: { $gte: 4.5 } } },
  { $project: { _id: 0, name: 1, brand: 1, price: 1, rating: 1 } }
]
```

**Answer:**

| name | brand | price | rating |
|------|-------|-------|--------|
| iPhone 15 | Apple | 65000 | 4.7 |
| Samsung Galaxy S24 | Samsung | 72000 | 4.6 |
| OnePlus 12 | OnePlus | 58000 | 4.5 |
| MacBook Air M3 | Apple | 115000 | 4.8 |
| Sony Bravia 55 TV | Sony | 78000 | 4.5 |

---

## Q3. 5 most expensive products

**Collection:** `products`

```js
[
  { $project: { _id: 0, name: 1, category: 1, brand: 1, price: 1 } },
  { $sort: { price: -1 } },
  { $limit: 5 }
]
```

**Answer:**

| name | category | brand | price |
|------|----------|-------|-------|
| MacBook Air M3 | Electronics | Apple | 115000 |
| Sony Bravia 55 TV | Electronics | Sony | 78000 |
| Samsung Galaxy S24 | Electronics | Samsung | 72000 |
| iPhone 15 | Electronics | Apple | 65000 |
| Dell Inspiron 15 | Electronics | Dell | 62000 |

---

## Q4. 3 lowest stock products

**Collection:** `products`

```js
[
  { $project: { _id: 0, name: 1, category: 1, stock: 1, price: 1 } },
  { $sort: { stock: 1 } },
  { $limit: 3 }
]
```

**Answer:**

| name | category | stock | price |
|------|----------|-------|-------|
| Sony Bravia 55 TV | Electronics | 10 | 78000 |
| MacBook Air M3 | Electronics | 12 | 115000 |
| Fossil Gen 6 | Watches | 14 | 22000 |

---

## Q5. Gold or Platinum, age > 25

**Collection:** `customers`

```js
[
  { $match: { membership: { $in: ["Gold", "Platinum"] }, age: { $gt: 25 } } },
  { $project: { _id: 0, name: 1, city: 1, age: 1, membership: 1 } }
]
```

**Answer:**

| name | city | age | membership |
|------|------|-----|------------|
| Ankit Patel | Ahmedabad | 31 | Platinum |
| Vikram Mehta | Bangalore | 29 | Gold |
| Rohit Kumar | Hyderabad | 33 | Platinum |
| Pooja Mishra | Lucknow | 28 | Gold |
| Karan Shah | Surat | 35 | Platinum |
| Sahil Khan | Bhopal | 27 | Gold |
| Dev Yadav | Nagpur | 32 | Gold |
| Manish Agarwal | Indore | 36 | Platinum |
| Simran Kaur | Amritsar | 26 | Gold |

---

## Q6. Customers per membership

**Collection:** `customers`

```js
[
  { $group: { _id: "$membership", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $project: { _id: 0, membership: "$_id", count: 1 } }
]
```

**Answer:**

| membership | count |
|------------|-------|
| Gold | 8 |
| Silver | 8 |
| Platinum | 4 |

---

## Q7. Average price per category

**Collection:** `products`

```js
[
  { $group: { _id: "$category", averagePrice: { $avg: "$price" } } },
  { $sort: { averagePrice: -1 } },
  { $project: { _id: 0, category: "$_id", averagePrice: { $round: ["$averagePrice", 2] } } }
]
```

**Answer:**

| category | averagePrice |
|----------|--------------|
| Electronics | 61000 |
| Watches | 24500 |
| Appliances | 18333.33 |
| Audio | 17100 |
| Footwear | 12000 |
| Accessories | 9000 |
| Clothing | 7050 |
| Books | 5483.33 |

---

## Q8. Total stock per category

**Collection:** `products`

```js
[
  { $group: { _id: "$category", totalStock: { $sum: "$stock" } } },
  { $sort: { totalStock: -1 } },
  { $project: { _id: 0, category: "$_id", totalStock: 1 } }
]
```

**Answer:**

| category | totalStock |
|----------|------------|
| Clothing | 200 |
| Books | 200 |
| Audio | 190 |
| Electronics | 153 |
| Footwear | 115 |
| Appliances | 78 |
| Watches | 58 |
| Accessories | 50 |

---

## Q9. Brands with avg rating > 4.4

**Collection:** `products`

```js
[
  { $group: { _id: "$brand", avgRating: { $avg: "$rating" } } },
  { $match: { avgRating: { $gt: 4.4 } } },
  { $project: { _id: 0, brand: "$_id", avgRating: { $round: ["$avgRating", 2] } } },
  { $sort: { avgRating: -1 } }
]
```

**Answer:**

| brand | avgRating |
|-------|-----------|
| Penguin | 4.8 |
| Apple | 4.72 |
| Prentice Hall | 4.7 |
| North Face | 4.7 |
| Sony | 4.65 |
| Amazon | 4.6 |
| Logitech | 4.6 |
| Casio | 4.6 |
| Philips | 4.5 |
| Nike | 4.5 |

---

## Q10. Orders per status

**Collection:** `orders`

```js
[
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $project: { _id: 0, status: "$_id", count: 1 } }
]
```

**Answer:**

| status | count |
|--------|-------|
| Delivered | 18 |
| Shipped | 5 |
| Pending | 5 |
| Cancelled | 2 |

---

## Q11. Total quantity ordered

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: null, totalQuantity: { $sum: "$items.quantity" } } },
  { $project: { _id: 0, totalQuantity: 1 } }
]
```

**Answer:**

```json
{ "totalQuantity": 61 }
```

---

## Q12. Quantity sold per product

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalQuantity: { $sum: "$items.quantity" } } },
  { $sort: { totalQuantity: -1 } },
  { $project: { _id: 0, productId: "$_id", totalQuantity: 1 } }
]
```

**Answer (top):** Atomic Habits **5**, Adidas T-Shirt **4**, Boat / Levi's / Sony WH / AirPods **3**, …

---

## Q13. Top 5 products with name ($lookup)

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalQuantity: { $sum: "$items.quantity" } } },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 },
  { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $project: { _id: 0, productId: "$_id", productName: "$product.name", totalQuantity: 1 } }
]
```

**Answer:**

| totalQuantity | productName |
|---------------|-------------|
| 5 | Atomic Habits |
| 4 | Adidas T-Shirt |
| 3 | AirPods Pro 2 |
| 3 | Sony WH-1000XM5 |
| 3 | Boat Stone Speaker |

---

## Q14. Unique products in orders

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: "$items.productId" } },
  { $count: "uniqueProducts" }
]
```

**Answer:**

```json
{ "uniqueProducts": 30 }
```

---

## Q15. Total items per customer

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: "$customerId", totalItems: { $sum: "$items.quantity" } } },
  { $sort: { totalItems: -1 } },
  { $project: { _id: 0, customerId: "$_id", totalItems: 1 } }
]
```

**Answer (top):** Sahil Khan **6**, Ankit Patel / Karan Shah **5**, Rahul / Nitin / Riya / Kavya / Vikram **4**, …

---

## Q16. Orders + customer name, email, city

**Collection:** `orders`

```js
[
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 1, orderDate: 1, status: 1, shippingCity: 1,
      customerName: "$customer.name",
      customerEmail: "$customer.email",
      customerCity: "$customer.city"
    }
  }
]
```

**Answer (sample):** Rahul Sharma (Raipur), Aman Verma (Delhi), Priya Singh (Mumbai), Ankit Patel (Ahmedabad), …

---

## Q17. Same + sort by orderDate desc

**Collection:** `orders`

```js
[
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customerName: "$customer.name",
      orderDate: 1, status: 1, shippingCity: 1
    }
  },
  { $sort: { orderDate: -1 } }
]
```

**Answer (sample):** Kavya Rao 30 Aug → Ankit Patel 29 → Nitin Jain 28 → Manish Agarwal 27 → Sahil Khan 26 → …

---

## Q18. Delivered orders by Gold members

**Collection:** `orders`

```js
[
  { $match: { status: "Delivered" } },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $match: { "customer.membership": "Gold" } },
  {
    $project: {
      _id: 1, orderDate: 1, status: 1, shippingCity: 1,
      customerName: "$customer.name",
      membership: "$customer.membership"
    }
  }
]
```

**Answer:**

| orderDate | city | customerName |
|-----------|------|--------------|
| 2026-08-01 | Raipur | Rahul Sharma |
| 2026-08-06 | Bangalore | Vikram Mehta |
| 2026-08-21 | Raipur | Rahul Sharma |
| 2026-08-23 | Bangalore | Vikram Mehta |
| 2026-08-26 | Bhopal | Sahil Khan |
| 2026-08-30 | Chennai | Kavya Rao |

---

## Q19. Total orders per customer

**Collection:** `orders`

```js
[
  { $group: { _id: "$customerId", totalOrders: { $sum: 1 } } },
  { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $project: { _id: 0, customerName: "$customer.name", city: "$customer.city", totalOrders: 1 } },
  { $sort: { totalOrders: -1 } }
]
```

**Answer:** 10 customers with `totalOrders: 2` (Rohit, Vikram, Rahul, Kavya, Karan, Manish, Ankit, Priya, Nitin, Sahil); rest have 1.

---

## Q20. Customers with more than one order

**Collection:** `orders`

```js
[
  { $group: { _id: "$customerId", numberOfOrders: { $sum: 1 } } },
  { $match: { numberOfOrders: { $gt: 1 } } },
  { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      name: "$customer.name",
      membership: "$customer.membership",
      city: "$customer.city",
      numberOfOrders: 1
    }
  },
  { $sort: { numberOfOrders: -1 } }
]
```

**Answer:** Same 10 customers as Q19, each with `numberOfOrders: 2`.

---

## Q21. Qty sold + productName, category, brand

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalQuantitySold: { $sum: "$items.quantity" } } },
  { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  {
    $project: {
      _id: 0,
      productName: "$product.name",
      category: "$product.category",
      brand: "$product.brand",
      totalQuantitySold: 1
    }
  },
  { $sort: { totalQuantitySold: -1 } }
]
```

**Answer (top):** Atomic Habits 5, Adidas T-Shirt 4, Levi's / Boat / AirPods / Sony WH 3, …

---

## Q22. Top 5 Electronics by quantity sold

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalQuantitySold: { $sum: "$items.quantity" } } },
  { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $match: { "product.category": "Electronics" } },
  { $sort: { totalQuantitySold: -1 } },
  { $limit: 5 },
  {
    $project: {
      _id: 0,
      productName: "$product.name",
      brand: "$product.brand",
      price: "$product.price",
      totalQuantitySold: 1
    }
  }
]
```

**Answer:**

| qty | productName | brand | price |
|-----|-------------|-------|-------|
| 2 | OnePlus 12 | OnePlus | 58000 |
| 2 | Sony Bravia 55 TV | Sony | 78000 |
| 2 | Samsung Galaxy S24 | Samsung | 72000 |
| 2 | MacBook Air M3 | Apple | 115000 |
| 2 | Dell Inspiron 15 | Dell | 62000 |

---

## Q23. Total items ordered per city

**Collection:** `orders`

```js
[
  { $unwind: "$items" },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $group: { _id: "$customer.city", totalQuantity: { $sum: "$items.quantity" } } },
  { $project: { _id: 0, city: "$_id", totalQuantity: 1 } },
  { $sort: { totalQuantity: -1 } }
]
```

**Answer (top):** Bhopal **6**, Surat/Ahmedabad **5**, Bangalore/Bhubaneswar/Chennai/Noida/Raipur **4**, …

---

## Q24. $facet — Product / Category / Rating stats

**Collection:** `products`

```js
[
  {
    $facet: {
      productStatistics: [
        { $group: { _id: null, totalProducts: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
        { $project: { _id: 0, totalProducts: 1, averagePrice: { $round: ["$averagePrice", 2] } } }
      ],
      categoryStatistics: [
        { $group: { _id: "$category", productCount: { $sum: 1 }, averagePrice: { $avg: "$price" } } },
        { $project: { _id: 0, category: "$_id", productCount: 1, averagePrice: { $round: ["$averagePrice", 2] } } },
        { $sort: { productCount: -1 } }
      ],
      ratingStatistics: [
        {
          $group: {
            _id: null,
            ratingGte45: { $sum: { $cond: [{ $gte: ["$rating", 4.5] }, 1, 0] } },
            ratingLt45: { $sum: { $cond: [{ $lt: ["$rating", 4.5] }, 1, 0] } }
          }
        },
        { $project: { _id: 0, ratingGte45: 1, ratingLt45: 1 } }
      ]
    }
  }
]
```

**Answer:**

- **productStatistics:** totalProducts **30**, averagePrice **26118.33**
- **categoryStatistics:** Electronics 8 (61000), Audio 4 (17100), Clothing 4 (7050), Appliances 3, Footwear 3, Books 3, Watches 3, Accessories 2
- **ratingStatistics:** ratingGte45 **19**, ratingLt45 **11**

---

## Q25. Sales Dashboard ($facet)

**Collection:** `orders`

```js
[
  {
    $facet: {
      orderSummary: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            delivered: { $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } },
            shipped: { $sum: { $cond: [{ $eq: ["$status", "Shipped"] }, 1, 0] } }
          }
        },
        { $project: { _id: 0, total: 1, delivered: 1, pending: 1, cancelled: 1, shipped: 1 } }
      ],
      customerSummary: [
        { $group: { _id: "$customerId", orderCount: { $sum: 1 } } },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "customer" } },
        { $unwind: "$customer" },
        {
          $project: {
            _id: 0,
            name: "$customer.name",
            city: "$customer.city",
            membership: "$customer.membership",
            orderCount: 1
          }
        }
      ],
      productSummary: [
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", totalQuantitySold: { $sum: "$items.quantity" } } },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 5 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            productName: "$product.name",
            category: "$product.category",
            brand: "$product.brand",
            totalQuantitySold: 1
          }
        }
      ]
    }
  }
]
```

**Answer — orderSummary:** total **30** | delivered **18** | pending **5** | cancelled **2** | shipped **5**

**Answer — customerSummary (top 5):** Ankit Patel, Vikram Mehta, Karan Shah, Kavya Rao, Nitin Jain (each orderCount **2**)

**Answer — productSummary:** Atomic Habits **5**, Adidas T-Shirt **4**, AirPods Pro 2 / Boat / Sony WH **3**

**Category Summary** (on `products`):

| productCount | category | averagePrice |
|--------------|----------|--------------|
| 8 | Electronics | 61000 |
| 4 | Clothing | 7050 |
| 4 | Audio | 17100 |
| 3 | Watches | 24500 |
| 3 | Books | 5483.33 |
| 3 | Footwear | 12000 |
| 3 | Appliances | 18333.33 |
| 2 | Accessories | 9000 |

**Payment Summary** (on `payments`):

```js
[
  { $match: { status: "Paid" } },
  { $group: { _id: "$method", totalAmount: { $sum: "$amount" } } },
  { $project: { _id: 0, method: "$_id", totalAmount: 1 } },
  { $sort: { totalAmount: -1 } }
]
```

---

## Notes

- Compass TEXT mode: paste only `[ ... ]`.
- Q24 must run on **`products`** collection.
- All answers verified against the seed dataset used in class.
