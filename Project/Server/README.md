# 🌾 GrainZillow - IoT Grain Storage Management System

A comprehensive backend system for managing IoT-enabled grain storage facilities. Built with **Node.js**, **Express.js**, and **MongoDB**, featuring real-time sensor monitoring, automated controls, and multi-role user management.

---

## 🚀 Features

* **IoT Integration** — Real-time sensor data collection from ESP32 devices
* **Multi-role Access** — Admin, Manager, and User roles with granular permissions
* **Storage Management** — Complete grain storage request and approval workflow
* **Real-time Controls** — Remote control of pumps, fans, and buzzers
* **Alert System** — Automated notifications for critical conditions
* **Analytics Dashboard** — Comprehensive data visualization and reporting
* **RESTful API** — Well-documented endpoints for frontend integration

---

## 🏗️ System Architecture

```
GrainZillow Backend
├── 📱 ESP32 Devices (Sensors)
├── 🔄 Express.js API Server
├── 🗄️ MongoDB Database
├── 🔐 JWT Authentication
├── 👥 Role-based Access Control
└── 📊 Real-time Data Processing
```

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JWT with bcrypt
* **Validation:** express-validator
* **Security:** Helmet, CORS, Rate Limiting
* **Logging:** Winston
* **Testing:** Jest *(Planned)*

---

## 📋 Prerequisites

* Node.js **v16+**
* MongoDB **v5+**
* npm or yarn

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/grainzillow-backend.git
cd grainzillow-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
```

Then edit `.env` with your configuration.

### 4. Seed the Database *(optional)*

```bash
npm run seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at:
**[http://localhost:5000](http://localhost:5000)**

---

## 🔧 Configuration — Environment Variables

Create a `.env` file in the root directory:

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/grainzillow

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

---

## 🗄️ Database Setup

1. Install **MongoDB**
2. Create a database named **grainzillow**
3. Run the seed script for sample data:

   ```bash
   npm run seed
   ```

---

## 🎯 API Usage

### Authentication

All protected endpoints require a JWT token in the header:

```http
Authorization: Bearer <your-jwt-token>
```

### Sample Requests

**User Registration**

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "Secure123!",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9876543210"
  }
}
```

**Sensor Data Submission (ESP32)**

```http
POST /api/data/sensor-data
Content-Type: application/json
```

```json
{
  "deviceId": "ZILLOW_MGR1001",
  "temperature": { "value": 25.5, "unit": "C" },
  "humidity": { "value": 60.2, "unit": "%" },
  "gasLevel": { "value": 450, "unit": "ppm" }
}
```

---

## 👥 User Roles

### 🛡️ Admin

* Full system access
* User management & approval
* Manager creation
* System monitoring

### 👨‍🏭 Manager

* Godown management
* Approve storage requests
* Control and monitor devices
* Manage notifications

### 👤 User

* Submit storage requests
* Track request status
* Receive alerts & notifications
* Manage profile

---

## 📡 IoT Integration

**Device Registration**
ESP32 devices auto-register when sending their first data packet. Each manager is assigned a unique “Zillow” device.

**Supported Sensors**

* Temperature (°C)
* Humidity (%)
* Gas Levels (ppm)
* *(Optional)* GPS Coordinates

**Auto-Control Features**

* Fan control based on temperature
* Pump control based on humidity
* Buzzer alerts for gas leaks

---

## 🔒 Security Features

* JWT-based Authentication
* Role-based Access Control
* Input Validation & Sanitization
* Rate Limiting
* CORS Protection
* Helmet Security Headers
* Password Hashing (bcrypt)

---

## 📊 Monitoring & Logging

* Comprehensive request logging
* Error tracking and reporting
* Performance monitoring
* Security event logs

---

## 🚢 Deployment

**Production Build**


```bash

npm run build
npm start
```

**Docker (Coming Soon)**

```bash
docker-compose up -d
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.

---

## 🆘 Support

📧 **Email:** [support@grainzillow.com](mailto:support@grainzillow.com)
🐛 **Issues:** [GitHub Issues](https://github.com/your-org/grainzillow-backend/issues)
📚 **Documentation:** [API Docs](./API.md)

---

## 🙏 Acknowledgments

* ESP32 community for IoT device support
* MongoDB for robust data storage
* Express.js team for the excellent framework
