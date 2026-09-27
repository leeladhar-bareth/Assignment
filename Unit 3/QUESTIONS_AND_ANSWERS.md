# Unit 3 — Questions & Answers

MongoDB Aggregation on `ecommerce_practice`.  
Compass **TEXT** mode: paste only the `[ ... ]` array.

---

## Q1. Delivered orders — orderDate, status, shippingCity, customerId (newest first)

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

**Output (sample):**

```json
{
  "customerId": { "$oid": "650000000000000000000009" },
  "orderDate": { "$date": "2026-08-30T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Chennai"
}
{
  "customerId": { "$oid": "650000000000000000000020" },
  "orderDate": { "$date": "2026-08-28T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Noida"
}
{
  "customerId": { "$oid": "650000000000000000000014" },
  "orderDate": { "$date": "2026-08-26T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Bhopal"
}
```

| orderDate | status | shippingCity |
|-----------|--------|--------------|
| 2026-08-30 | Delivered | Chennai |
| 2026-08-28 | Delivered | Noida |
| 2026-08-26 | Delivered | Bhopal |
| 2026-08-25 | Delivered | Surat |
| 2026-08-23 | Delivered | Bangalore |
| 2026-08-21 | Delivered | Raipur |

*(Total: 18 Delivered orders)*

---

## Q2. Electronics, rating ≥ 4.5

**Collection:** `products`

```js
[
  { $match: { category: "Electronics", rating: { $gte: 4.5 } } },
  { $project: { _id: 0, name: 1, brand: 1, price: 1, rating: 1 } }
]
```

**Output:**

```json
{ "name": "iPhone 15", "brand": "Apple", "price": 65000, "rating": 4.7 }
{ "name": "Samsung Galaxy S24", "brand": "Samsung", "price": 72000, "rating": 4.6 }
{ "name": "OnePlus 12", "brand": "OnePlus", "price": 58000, "rating": 4.5 }
{ "name": "MacBook Air M3", "brand": "Apple", "price": 115000, "rating": 4.8 }
{ "name": "Sony Bravia 55 TV", "brand": "Sony", "price": 78000, "rating": 4.5 }
```

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

**Output:**

```json
{ "name": "MacBook Air M3", "category": "Electronics", "brand": "Apple", "price": 115000 }
{ "name": "Sony Bravia 55 TV", "category": "Electronics", "brand": "Sony", "price": 78000 }
{ "name": "Samsung Galaxy S24", "category": "Electronics", "brand": "Samsung", "price": 72000 }
{ "name": "iPhone 15", "category": "Electronics", "brand": "Apple", "price": 65000 }
{ "name": "Dell Inspiron 15", "category": "Electronics", "brand": "Dell", "price": 62000 }
```

| name | category | brand | price |
|------|----------|-------|-------|
| MacBook Air M3 | Electronics | Apple | 115000 |
| Sony Bravia 55 TV | Electronics | Sony | 78000 |
| Samsung Galaxy S24 | Electronics | Samsung | 72000 |
| iPhone 15 | Electronics | Apple | 65000 |
| Dell Inspiron 15 | Electronics | Dell | 62000 |

---

## Q4. 3 lowest stock

**Collection:** `products`

```js
[
  { $project: { _id: 0, name: 1, category: 1, stock: 1, price: 1 } },
  { $sort: { stock: 1 } },
  { $limit: 3 }
]
```

**Output:**

```json
{ "name": "Sony Bravia 55 TV", "category": "Electronics", "stock": 10, "price": 78000 }
{ "name": "MacBook Air M3", "category": "Electronics", "stock": 12, "price": 115000 }
{ "name": "Fossil Gen 6", "category": "Watches", "stock": 14, "price": 22000 }
```

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

**Output:**

```json
{ "name": "Ankit Patel", "city": "Ahmedabad", "age": 31, "membership": "Platinum" }
{ "name": "Vikram Mehta", "city": "Bangalore", "age": 29, "membership": "Gold" }
{ "name": "Rohit Kumar", "city": "Hyderabad", "age": 33, "membership": "Platinum" }
{ "name": "Pooja Mishra", "city": "Lucknow", "age": 28, "membership": "Gold" }
{ "name": "Karan Shah", "city": "Surat", "age": 35, "membership": "Platinum" }
{ "name": "Sahil Khan", "city": "Bhopal", "age": 27, "membership": "Gold" }
{ "name": "Dev Yadav", "city": "Nagpur", "age": 32, "membership": "Gold" }
{ "name": "Manish Agarwal", "city": "Indore", "age": 36, "membership": "Platinum" }
{ "name": "Simran Kaur", "city": "Amritsar", "age": 26, "membership": "Gold" }
```

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

**Output:**

```json
{ "count": 8, "membership": "Gold" }
{ "count": 8, "membership": "Silver" }
{ "count": 4, "membership": "Platinum" }
```

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

**Output:**

```json
{ "category": "Electronics", "averagePrice": 61000 }
{ "category": "Watches", "averagePrice": 24500 }
{ "category": "Appliances", "averagePrice": 18333.33 }
{ "category": "Audio", "averagePrice": 17100 }
{ "category": "Footwear", "averagePrice": 12000 }
{ "category": "Accessories", "averagePrice": 9000 }
{ "category": "Clothing", "averagePrice": 7050 }
{ "category": "Books", "averagePrice": 5483.33 }
```

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

**Output:**

```json
{ "totalStock": 200, "category": "Clothing" }
{ "totalStock": 200, "category": "Books" }
{ "totalStock": 190, "category": "Audio" }
{ "totalStock": 153, "category": "Electronics" }
{ "totalStock": 115, "category": "Footwear" }
{ "totalStock": 78, "category": "Appliances" }
{ "totalStock": 58, "category": "Watches" }
{ "totalStock": 50, "category": "Accessories" }
```

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

## Q9. Brands avg rating > 4.4

**Collection:** `products`

```js
[
  { $group: { _id: "$brand", avgRating: { $avg: "$rating" } } },
  { $match: { avgRating: { $gt: 4.4 } } },
  { $project: { _id: 0, brand: "$_id", avgRating: { $round: ["$avgRating", 2] } } },
  { $sort: { avgRating: -1 } }
]
```

**Output:**

```json
{ "brand": "Penguin", "avgRating": 4.8 }
{ "brand": "Apple", "avgRating": 4.72 }
{ "brand": "Prentice Hall", "avgRating": 4.7 }
{ "brand": "North Face", "avgRating": 4.7 }
{ "brand": "Sony", "avgRating": 4.65 }
{ "brand": "Amazon", "avgRating": 4.6 }
{ "brand": "Logitech", "avgRating": 4.6 }
{ "brand": "Casio", "avgRating": 4.6 }
{ "brand": "Philips", "avgRating": 4.5 }
{ "brand": "Nike", "avgRating": 4.5 }
```

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

**Output:**

```json
{ "count": 18, "status": "Delivered" }
{ "count": 5, "status": "Shipped" }
{ "count": 5, "status": "Pending" }
{ "count": 2, "status": "Cancelled" }
```

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

**Output:**

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

**Output (top):**

```json
{ "totalQuantity": 5, "productId": { "$oid": "660000000000000000000022" } }
{ "totalQuantity": 4, "productId": { "$oid": "660000000000000000000016" } }
{ "totalQuantity": 3, "productId": { "$oid": "660000000000000000000030" } }
{ "totalQuantity": 3, "productId": { "$oid": "660000000000000000000014" } }
{ "totalQuantity": 3, "productId": { "$oid": "660000000000000000000006" } }
{ "totalQuantity": 3, "productId": { "$oid": "660000000000000000000007" } }
```

| totalQuantity | productId | Product |
|---------------|-----------|---------|
| 5 | ...022 | Atomic Habits |
| 4 | ...016 | Adidas T-Shirt |
| 3 | ...030 | Boat Stone Speaker |
| 3 | ...014 | Levi's 511 Jeans |
| 3 | ...006 | Sony WH-1000XM5 |
| 3 | ...007 | AirPods Pro 2 |

---

*Continue in same file for Q13–Q25 below…*
