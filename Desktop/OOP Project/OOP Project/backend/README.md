# Food Delivery Website Backend

This folder contains the Java backend for the semester project.

## Stack

- Java Spring Boot
- MongoDB
- Session-based authentication

## Run Backend

1. Start MongoDB on `mongodb://localhost:27017`
2. Open this folder in a terminal
3. Run `mvn spring-boot:run`
4. Backend API runs on `http://localhost:8080`

## Demo Accounts

- Admin: `admin@foodhub.com` / `Admin@12345`
- User: `user@foodhub.com` / `User@12345`

## Main API Groups

- `/api/auth` for login and registration
- `/api/foods` for public menu access
- `/api/user` for customer dashboard actions
- `/api/admin` for admin management

