# DRIVANA – Multi-Role Logistics & Delivery Platform

A fully responsive, real-time logistics platform built with Django and React. DRIVANA allows authenticated users to book vehicles, send parcels, and order food. It features dedicated dashboards for restaurant partners, delivery agents, and drivers, each with specialized capabilities and real-time functionality.

## 🔑 Key Features

- **Multi-Role Authentication** – Roles: User, Driver, Restaurant Partner, Delivery Partner  
- **User Services** – Book vehicles, place parcel orders, order food online  
- **Driver Dashboard** – Go online/offline, receive user requests (exclusive acceptance logic)  
- **Real-Time Map Tracking** – Live location updates using Leaflet.js  
- **One-Time Request Assignment** – Requests disappear once accepted by a driver  
- **Responsive UI** – Optimized for both desktop and mobile

## 🧰 Tech Stack

- **Frontend:** React, JavaScript, Axios  
- **Backend:** Django, Django REST Framework  
- **Maps & Geo:** Leaflet.js  
- **Authentication:** Token-based (JWT / DRF Auth)  
- **Database:** PostgreSQL / SQLite (for development)  
- **Others:** CORS, .env Configuration, Modular Routing

## ⚙️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/drivana.git
   cd drivana
   ```
 2.**Backend Setup (Django)**
   ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
   ```
 3.**Frontend Setup (React)**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
