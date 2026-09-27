# Unit 3 — Questions & Answers (Q13–Q25)

See also: [QUESTIONS_AND_ANSWERS.md](./QUESTIONS_AND_ANSWERS.md) for Q1–Q12.

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

**Output:**

```json
{
  "totalQuantity": 5,
  "productId": { "$oid": "660000000000000000000022" },
  "productName": "Atomic Habits"
}
{
  "totalQuantity": 4,
  "productId": { "$oid": "660000000000000000000016" },
  "productName": "Adidas T-Shirt"
}
{
  "totalQuantity": 3,
  "productId": { "$oid": "660000000000000000000007" },
  "productName": "AirPods Pro 2"
}
{
  "totalQuantity": 3,
  "productId": { "$oid": "660000000000000000000006" },
  "productName": "Sony WH-1000XM5"
}
{
  "totalQuantity": 3,
  "productId": { "$oid": "660000000000000000000030" },
  "productName": "Boat Stone Speaker"
}
```

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

**Output:**

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

**Output (top):**

```json
{ "totalItems": 6, "customerId": { "$oid": "650000000000000000000014" } }
{ "totalItems": 5, "customerId": { "$oid": "650000000000000000000004" } }
{ "totalItems": 5, "customerId": { "$oid": "650000000000000000000012" } }
{ "totalItems": 4, "customerId": { "$oid": "650000000000000000000001" } }
{ "totalItems": 4, "customerId": { "$oid": "650000000000000000000020" } }
```

| totalItems | customerId | Name |
|------------|------------|------|
| 6 | ...014 | Sahil Khan |
| 5 | ...004 | Ankit Patel |
| 5 | ...012 | Karan Shah |
| 4 | ...001 | Rahul Sharma |
| 4 | ...020 | Nitin Jain |

---

## Q16. Orders + customer name, email, city

**Collection:** `orders`

```js
[
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 1,
      orderDate: 1,
      status: 1,
      shippingCity: 1,
      customerName: "$customer.name",
      customerEmail: "$customer.email",
      customerCity: "$customer.city"
    }
  }
]
```

**Output (sample):**

```json
{
  "_id": { "$oid": "670000000000000000000001" },
  "orderDate": { "$date": "2026-08-01T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Raipur",
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@gmail.com",
  "customerCity": "Raipur"
}
{
  "_id": { "$oid": "670000000000000000000002" },
  "orderDate": { "$date": "2026-08-02T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Delhi",
  "customerName": "Aman Verma",
  "customerEmail": "aman@gmail.com",
  "customerCity": "Delhi"
}
{
  "_id": { "$oid": "670000000000000000000003" },
  "orderDate": { "$date": "2026-08-03T00:00:00.000Z" },
  "status": "Shipped",
  "shippingCity": "Mumbai",
  "customerName": "Priya Singh",
  "customerEmail": "priya@gmail.com",
  "customerCity": "Mumbai"
}
```

| status | shippingCity | customerName | customerEmail |
|--------|--------------|--------------|---------------|
| Delivered | Raipur | Rahul Sharma | rahul@gmail.com |
| Delivered | Delhi | Aman Verma | aman@gmail.com |
| Shipped | Mumbai | Priya Singh | priya@gmail.com |
| Delivered | Ahmedabad | Ankit Patel | ankit@gmail.com |
| Pending | Pune | Sneha Joshi | sneha@gmail.com |

---

## Q17. Orders + customer, sort by date desc

**Collection:** `orders`

```js
[
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customerName: "$customer.name",
      orderDate: 1,
      status: 1,
      shippingCity: 1
    }
  },
  { $sort: { orderDate: -1 } }
]
```

**Output (sample):**

```json
{
  "orderDate": { "$date": "2026-08-30T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Chennai",
  "customerName": "Kavya Rao"
}
{
  "orderDate": { "$date": "2026-08-29T00:00:00.000Z" },
  "status": "Pending",
  "shippingCity": "Ahmedabad",
  "customerName": "Ankit Patel"
}
{
  "orderDate": { "$date": "2026-08-28T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Noida",
  "customerName": "Nitin Jain"
}
```

| orderDate | status | shippingCity | customerName |
|-----------|--------|--------------|--------------|
| 2026-08-30 | Delivered | Chennai | Kavya Rao |
| 2026-08-29 | Pending | Ahmedabad | Ankit Patel |
| 2026-08-28 | Delivered | Noida | Nitin Jain |
| 2026-08-27 | Shipped | Indore | Manish Agarwal |
| 2026-08-26 | Delivered | Bhopal | Sahil Khan |

---

## Q18. Delivered + Gold members

**Collection:** `orders`

```js
[
  { $match: { status: "Delivered" } },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $match: { "customer.membership": "Gold" } },
  {
    $project: {
      _id: 1,
      orderDate: 1,
      status: 1,
      shippingCity: 1,
      customerName: "$customer.name",
      membership: "$customer.membership"
    }
  }
]
```

**Output:**

```json
{
  "_id": { "$oid": "670000000000000000000001" },
  "orderDate": { "$date": "2026-08-01T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Raipur",
  "customerName": "Rahul Sharma",
  "membership": "Gold"
}
{
  "_id": { "$oid": "670000000000000000000006" },
  "orderDate": { "$date": "2026-08-06T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Bangalore",
  "customerName": "Vikram Mehta",
  "membership": "Gold"
}
{
  "_id": { "$oid": "670000000000000000000021" },
  "orderDate": { "$date": "2026-08-21T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Raipur",
  "customerName": "Rahul Sharma",
  "membership": "Gold"
}
{
  "_id": { "$oid": "670000000000000000000023" },
  "orderDate": { "$date": "2026-08-23T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Bangalore",
  "customerName": "Vikram Mehta",
  "membership": "Gold"
}
{
  "_id": { "$oid": "670000000000000000000026" },
  "orderDate": { "$date": "2026-08-26T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Bhopal",
  "customerName": "Sahil Khan",
  "membership": "Gold"
}
{
  "_id": { "$oid": "670000000000000000000030" },
  "orderDate": { "$date": "2026-08-30T00:00:00.000Z" },
  "status": "Delivered",
  "shippingCity": "Chennai",
  "customerName": "Kavya Rao",
  "membership": "Gold"
}
```

| orderDate | city | customerName | membership |
|-----------|------|--------------|------------|
| 2026-08-01 | Raipur | Rahul Sharma | Gold |
| 2026-08-06 | Bangalore | Vikram Mehta | Gold |
| 2026-08-21 | Raipur | Rahul Sharma | Gold |
| 2026-08-23 | Bangalore | Vikram Mehta | Gold |
| 2026-08-26 | Bhopal | Sahil Khan | Gold |
| 2026-08-30 | Chennai | Kavya Rao | Gold |

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

**Output (customers with 2 orders):**

```json
{ "totalOrders": 2, "customerName": "Rohit Kumar", "city": "Hyderabad" }
{ "totalOrders": 2, "customerName": "Vikram Mehta", "city": "Bangalore" }
{ "totalOrders": 2, "customerName": "Rahul Sharma", "city": "Raipur" }
{ "totalOrders": 2, "customerName": "Kavya Rao", "city": "Chennai" }
{ "totalOrders": 2, "customerName": "Karan Shah", "city": "Surat" }
{ "totalOrders": 2, "customerName": "Manish Agarwal", "city": "Indore" }
{ "totalOrders": 2, "customerName": "Ankit Patel", "city": "Ahmedabad" }
{ "totalOrders": 2, "customerName": "Priya Singh", "city": "Mumbai" }
{ "totalOrders": 2, "customerName": "Nitin Jain", "city": "Noida" }
{ "totalOrders": 2, "customerName": "Sahil Khan", "city": "Bhopal" }
```

| totalOrders | customerName | city |
|-------------|--------------|------|
| 2 | Rohit Kumar | Hyderabad |
| 2 | Vikram Mehta | Bangalore |
| 2 | Rahul Sharma | Raipur |
| 2 | Kavya Rao | Chennai |
| 2 | Karan Shah | Surat |
| 2 | Manish Agarwal | Indore |
| 2 | Ankit Patel | Ahmedabad |
| 2 | Priya Singh | Mumbai |
| 2 | Nitin Jain | Noida |
| 2 | Sahil Khan | Bhopal |

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

**Output:** Same 10 customers as Q19, each with `numberOfOrders: 2`.

| name | membership | city | numberOfOrders |
|------|------------|------|----------------|
| Rohit Kumar | Platinum | Hyderabad | 2 |
| Vikram Mehta | Gold | Bangalore | 2 |
| Rahul Sharma | Gold | Raipur | 2 |
| Kavya Rao | Gold | Chennai | 2 |
| Karan Shah | Platinum | Surat | 2 |
| Manish Agarwal | Platinum | Indore | 2 |
| Ankit Patel | Platinum | Ahmedabad | 2 |
| Priya Singh | Gold | Mumbai | 2 |
| Nitin Jain | Silver | Noida | 2 |
| Sahil Khan | Gold | Bhopal | 2 |

---

## Q21. Qty sold + product details

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

**Output (top):**

```json
{ "totalQuantitySold": 5, "productName": "Atomic Habits", "category": "Books", "brand": "Penguin" }
{ "totalQuantitySold": 4, "productName": "Adidas T-Shirt", "category": "Clothing", "brand": "Adidas" }
{ "totalQuantitySold": 3, "productName": "Levi's 511 Jeans", "category": "Clothing", "brand": "Levi's" }
{ "totalQuantitySold": 3, "productName": "Boat Stone Speaker", "category": "Audio", "brand": "Boat" }
{ "totalQuantitySold": 3, "productName": "AirPods Pro 2", "category": "Audio", "brand": "Apple" }
{ "totalQuantitySold": 3, "productName": "Sony WH-1000XM5", "category": "Audio", "brand": "Sony" }
```

| totalQuantitySold | productName | category | brand |
|-------------------|-------------|----------|-------|
| 5 | Atomic Habits | Books | Penguin |
| 4 | Adidas T-Shirt | Clothing | Adidas |
| 3 | Levi's 511 Jeans | Clothing | Levi's |
| 3 | Boat Stone Speaker | Audio | Boat |
| 3 | AirPods Pro 2 | Audio | Apple |
| 3 | Sony WH-1000XM5 | Audio | Sony |

---

## Q22. Top 5 Electronics by qty sold

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

**Output:**

```json
{ "totalQuantitySold": 2, "productName": "OnePlus 12", "brand": "OnePlus", "price": 58000 }
{ "totalQuantitySold": 2, "productName": "Sony Bravia 55 TV", "brand": "Sony", "price": 78000 }
{ "totalQuantitySold": 2, "productName": "Samsung Galaxy S24", "brand": "Samsung", "price": 72000 }
{ "totalQuantitySold": 2, "productName": "MacBook Air M3", "brand": "Apple", "price": 115000 }
{ "totalQuantitySold": 2, "productName": "Dell Inspiron 15", "brand": "Dell", "price": 62000 }
```

| totalQuantitySold | productName | brand | price |
|-------------------|-------------|-------|-------|
| 2 | OnePlus 12 | OnePlus | 58000 |
| 2 | Sony Bravia 55 TV | Sony | 78000 |
| 2 | Samsung Galaxy S24 | Samsung | 72000 |
| 2 | MacBook Air M3 | Apple | 115000 |
| 2 | Dell Inspiron 15 | Dell | 62000 |

---

## Q23. Items ordered per city

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

**Output (top):**

```json
{ "totalQuantity": 6, "city": "Bhopal" }
{ "totalQuantity": 5, "city": "Surat" }
{ "totalQuantity": 5, "city": "Ahmedabad" }
{ "totalQuantity": 4, "city": "Bangalore" }
{ "totalQuantity": 4, "city": "Bhubaneswar" }
{ "totalQuantity": 4, "city": "Chennai" }
{ "totalQuantity": 4, "city": "Noida" }
{ "totalQuantity": 4, "city": "Raipur" }
```

| totalQuantity | city |
|---------------|------|
| 6 | Bhopal |
| 5 | Surat |
| 5 | Ahmedabad |
| 4 | Bangalore |
| 4 | Bhubaneswar |
| 4 | Chennai |
| 4 | Noida |
| 4 | Raipur |

---

## Q24. $facet — Product / Category / Rating

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

**Output:**

```json
{
  "productStatistics": [
    { "totalProducts": 30, "averagePrice": 26118.33 }
  ],
  "categoryStatistics": [
    { "productCount": 8, "category": "Electronics", "averagePrice": 61000 },
    { "productCount": 4, "category": "Audio", "averagePrice": 17100 },
    { "productCount": 4, "category": "Clothing", "averagePrice": 7050 },
    { "productCount": 3, "category": "Appliances", "averagePrice": 18333.33 },
    { "productCount": 3, "category": "Footwear", "averagePrice": 12000 },
    { "productCount": 3, "category": "Books", "averagePrice": 5483.33 },
    { "productCount": 3, "category": "Watches", "averagePrice": 24500 },
    { "productCount": 2, "category": "Accessories", "averagePrice": 9000 }
  ],
  "ratingStatistics": [
    { "ratingGte45": 19, "ratingLt45": 11 }
  ]
}
```

| category | productCount | averagePrice |
|----------|--------------|--------------|
| Electronics | 8 | 61000 |
| Audio | 4 | 17100 |
| Clothing | 4 | 7050 |
| Appliances | 3 | 18333.33 |
| Footwear | 3 | 12000 |
| Books | 3 | 5483.33 |
| Watches | 3 | 24500 |
| Accessories | 2 | 9000 |

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

**Output:**

```json
{
  "orderSummary": [
    {
      "total": 30,
      "delivered": 18,
      "pending": 5,
      "cancelled": 2,
      "shipped": 5
    }
  ],
  "customerSummary": [
    { "orderCount": 2, "name": "Ankit Patel", "city": "Ahmedabad", "membership": "Platinum" },
    { "orderCount": 2, "name": "Vikram Mehta", "city": "Bangalore", "membership": "Gold" },
    { "orderCount": 2, "name": "Karan Shah", "city": "Surat", "membership": "Platinum" },
    { "orderCount": 2, "name": "Kavya Rao", "city": "Chennai", "membership": "Gold" },
    { "orderCount": 2, "name": "Nitin Jain", "city": "Noida", "membership": "Silver" }
  ],
  "productSummary": [
    { "totalQuantitySold": 5, "productName": "Atomic Habits", "category": "Books", "brand": "Penguin" },
    { "totalQuantitySold": 4, "productName": "Adidas T-Shirt", "category": "Clothing", "brand": "Adidas" },
    { "totalQuantitySold": 3, "productName": "AirPods Pro 2", "category": "Audio", "brand": "Apple" },
    { "totalQuantitySold": 3, "productName": "Boat Stone Speaker", "category": "Audio", "brand": "Boat" },
    { "totalQuantitySold": 3, "productName": "Sony WH-1000XM5", "category": "Audio", "brand": "Sony" }
  ]
}
```

**Category Summary** (on `products`):

```json
{ "productCount": 8, "category": "Electronics", "averagePrice": 61000 }
{ "productCount": 4, "category": "Clothing", "averagePrice": 7050 }
{ "productCount": 4, "category": "Audio", "averagePrice": 17100 }
{ "productCount": 3, "category": "Watches", "averagePrice": 24500 }
{ "productCount": 3, "category": "Books", "averagePrice": 5483.33 }
{ "productCount": 3, "category": "Footwear", "averagePrice": 12000 }
{ "productCount": 3, "category": "Appliances", "averagePrice": 18333.33 }
{ "productCount": 2, "category": "Accessories", "averagePrice": 9000 }
```

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
