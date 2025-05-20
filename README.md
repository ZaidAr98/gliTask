# Product & Order Microservices System

This repository contains two independent but interconnected microservices:

- Product Service
- Order Service

They are built using **NestJS**, **Prisma ORM**, **MySQL**, and **RabbitMQ** for asynchronous communication. This system demonstrates a modular, scalable backend architecture using event-driven microservices.

---

## Overview

- **Product Service**: Manages products, including CRUD operations and stock management.
- **Order Service**: Handles order creation, validates product availability, and deducts stock.

The two services communicate via **RabbitMQ** message queues using NestJS microservice patterns.

---

## Microservices Structure

### Product Service

- Full CRUD for products
- Stock update and validation
- Prevent deletion of products with active orders
- Exposes HTTP endpoints and handles RabbitMQ messages

### Order Service

- Creates orders after validating product existence and stock
- Reduces product stock after successful order
- Queries order by product ID
- Communicates with Product Service via RabbitMQ

---

## Inter-Service Communication

| From          | To            | Pattern               | Purpose                           |
|---------------|---------------|-----------------------|-----------------------------------|
| Order Service | Product Service | `check-product`       | Validate product before ordering  |
| Order Service | Product Service | `reduce-stock`        | Reduce stock after order          |
| Product Service | Order Service | `check-product-orders` | Check if product has orders before deletion |




