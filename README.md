# 📚 BookStore Backend API

An enterprise-level backend for a BookStore application developed with **ASP.NET Core Web API**, **EF Core**, and **SignalR**. This backend powers a fully functional e-commerce-like frontend built in **React**.

---





## 🚀 Tech Stack

- **Backend Framework:** ASP.NET Core Web API (.NET 8)
- **Frontend:** React (Vite)
- **Database:** SQL Server (EF Core Code First)
- **Authentication:** JWT Bearer Token
- **Real-Time Communication:** SignalR
- **Email:** SMTP Email Service

---

## 👥 Project Contributors & Roles

- **Aron**  
  Developed the initial version of the frontend using **React**, handling layout, UI, and components.

- **Me (Project Lead)**  
  - Developed the **entire backend** using **ASP.NET Core** with **Entity Framework Core**.  
  - Integrated key features such as:  
    🔥 Global Exception Handling  
    📧 Email Service  
    ⚡ SignalR for real-time notifications  
  - Improved and refactored the frontend for better performance and user experience.

## 📦 Key Features

### 🔧 Core Functionality
- 🛍️ Book listing, filtering, and CRUD
- 🛒 Cart and Wishlist management
- 🧾 Order processing and checkout flow
- 📢 Announcements and Reviews
- 👥 User and Staff roles with proper authorization
- 🧩 Clean architecture with separation of concerns (Controller → Service → EF Layer)

### 🛠️ Backend Enhancements
- ✅ **Global Exception Handling Middleware**
- ✅ **Email Service Integration** (`IEmailService`)
- ✅ **SignalR** notifications hub for real-time updates
- ✅ **Rate Limiting** on sensitive routes like login and checkout
- ✅ **Structured DTOs and Extension Methods** for mapping logic
- ✅ **Custom Middleware** for exception formatting and standard response


---

