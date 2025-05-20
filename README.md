# Product Service - Microservices System with NestJS, Prisma & MySQL

This repository contains the **Product Service**, which is one part of a microservices architecture for managing products and orders. The system is built using **NestJS**, **Prisma ORM**, **MySQL**, and **RabbitMQ** for asynchronous communication between services.

## Overview

The Product Service provides APIs and message handlers to manage product data. It communicates with the **Order Service**, allowing orders to be validated and processed based on product availability and stock levels.

## Related Services

- **Order Service** (separate repository or module):  
  Responsible for managing orders and ensuring product stock is available before processing. It communicates with this Product Service using RabbitMQ message patterns.

## Features

- Full CRUD operations for product data
- Input validation using DTOs and `class-validator`
- Prisma for database access and migrations
- RabbitMQ for inter-service communication
- Swagger-based API documentation
- Prevents deletion of products that are part of existing orders (assume inter-service check)

## Technologies Used

- NestJS
- Prisma ORM
- MySQL
- RabbitMQ
- Swagger
- class-validator



