# 🌾 GrainZillow API Documentation

Comprehensive REST API documentation for the **GrainZillow** backend system.

---

## 📋 Table of Contents

* [Base URL](#-base-url)
* [Authentication](#-authentication)
* [Users](#-users)
* [Managers](#-managers)
* [Devices](#-devices)
* [Data](#-data)
* [Storage](#-storage)
* [IoT Controls](#-iot-controls)
* [Notifications](#-notifications)
* [Error Handling](#️-error-handling)
* [Pagination](#-pagination)
* [Real-time Features](#-real-time-features)
* [Rate Limiting](#-rate-limiting)

---

## 🌐 Base URL

Development:

```
http://localhost:5000/api
```

Production:

```
https://api.grainzillow.com/api
```

---

## 🔐 Authentication

### Register User

**Endpoint:** `POST /auth/register`
**Description:** Register a new user account (requires manager approval)

**Request Body:**

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

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully. Waiting for manager approval.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "newuser",
      "email": "user@example.com",
      "role": "user",
      "isApproved": false,
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "9876543210"
      }
    }
  }
}
```

---

### Login

**Endpoint:** `POST /auth/login`
**Description:** Authenticate user and receive JWT token

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Secure123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "newuser",
      "email": "user@example.com",
      "role": "user",
      "isApproved": true
    }
  }
}
```

---

### Get Current User

**Endpoint:** `GET /auth/me`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get the currently authenticated user’s profile.

---

## 👥 Users

### Get All Users

**Endpoint:** `GET /users`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

* `page` (default: 1)
* `limit` (default: 10)
* `role` (admin/manager/user)
* `search` (search in username, email, or name)
  **Permissions:** Admin, Manager

---

### Get Pending Approvals

**Endpoint:** `GET /users/pending-approvals`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get users waiting for approval
**Permissions:** Admin, Manager

---

### Approve User

**Endpoint:** `PUT /users/:userId/approve`
**Headers:** `Authorization: Bearer <token>`
**Description:** Approve a user registration
**Permissions:** Admin, Manager

---

### Update User Role

**Endpoint:** `PUT /users/:userId/role`
**Headers:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "role": "manager"
}
```

**Permissions:** Admin only

---

## 🏢 Managers

### Create Manager

**Endpoint:** `POST /managers`
**Headers:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "godown": {
    "name": "Central Godown",
    "location": {
      "address": "123 Grain Street, Industrial Area",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "totalCapacity": 10000
  },
  "contact": {
    "phone": "9876543210"
  }
}
```

**Permissions:** Admin only

---

### Get All Managers

**Endpoint:** `GET /managers`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** `page`, `limit`, `active`
**Permissions:** Admin

---

### Get Manager Zillow Status

**Endpoint:** `GET /managers/:managerId/zillow-status`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get Zillow device status and latest data for a manager
**Permissions:** Admin, Manager

---

## 📱 Devices

### Register Device

**Endpoint:** `POST /devices/register`
**Headers:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "deviceId": "ZILLOW_MGR1001",
  "name": "Central Godown Device",
  "managerId": "MGR1001",
  "location": "Central Godown, Mumbai",
  "configuration": {
    "temperatureThreshold": { "min": 15, "max": 35 },
    "autoControl": { "fan": true, "pump": false }
  }
}
```

**Permissions:** Manager

---

### Get All Devices

**Endpoint:** `GET /devices`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** `status`, `managerId`, `page`, `limit`
**Permissions:** Admin, Manager, User

---

### Get Device Details

**Endpoint:** `GET /devices/:deviceId`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get device details with latest sensor data.

---

## 📊 Data

### Submit Sensor Data

**Endpoint:** `POST /data/sensor-data`
**Description:** ESP32 devices submit sensor readings (no auth required)

**Request Body:**

```json
{
  "deviceId": "ZILLOW_MGR1001",
  "temperature": { "value": 25.5, "unit": "C" },
  "humidity": { "value": 60.2, "unit": "%" },
  "gasLevel": { "value": 450, "unit": "ppm" },
  "coordinates": { "latitude": 19.0760, "longitude": 72.8777 }
}
```

---

### Get Sensor Data

**Endpoint:** `GET /data/sensor-data`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** `deviceId`, `startDate`, `endDate`, `limit`
**Permissions:** Admin, Manager

---

### Get Latest Data

**Endpoint:** `GET /data/latest-data`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get latest sensor data from all accessible devices.

---

### Get Analytics

**Endpoint:** `GET /data/analytics`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** `deviceId`, `days` (default: 7)

---

## 🏗️ Storage

### Request Storage

**Endpoint:** `POST /storage/request`
**Headers:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "managerId": "MGR1001",
  "grainType": "wheat",
  "quantity": 5000,
  "capacity": 5000,
  "duration": { "plannedDuration": 180 },
  "notes": "High quality wheat for export"
}
```

**Permissions:** User

---

### Get User Storage

**Endpoint:** `GET /storage/my-storage`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** `status`, `page`, `limit`
**Permissions:** User

---

### Get Pending Requests

**Endpoint:** `GET /storage/pending-requests`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get pending storage requests for manager’s godown
**Permissions:** Manager

---

### Approve Storage

**Endpoint:** `PUT /storage/:storageId/approve`
**Headers:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "notes": "Approved for 6 months storage"
}
```

**Permissions:** Manager

---

## 🎮 IoT Controls

### Control Device

**Endpoint:** `POST /iot/control`
**Headers:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "deviceId": "ZILLOW_MGR1001",
  "command": "fan_on",
  "metadata": { "duration": 3600 },
  "priority": "high"
}
```

**Available Commands:**

```
pump_on, pump_off
fan_on, fan_off
buzzer_on, buzzer_off
```

**Permissions:** Admin, Manager

---

### Get Device Status

**Endpoint:** `GET /iot/status/:deviceId`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get real-time device status and pending commands.

---

### Get Pending Commands

**Endpoint:** `GET /iot/commands/pending`
**Headers:** `Authorization: Bearer <token>`
**Description:** Get pending commands for devices
**Permissions:** Admin, Manager

---

### Emergency Controls

**Endpoint:** `POST /iot/emergency/all-fans-on`
**Headers:** `Authorization: Bearer <token>`
**Description:** Turn on all fans for ventilation (emergency)
**Permissions:** Admin, Manager

---

## 🔔 Notifications

### Get User Notifications

**Endpoint:** `GET /notifications`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** `page`, `limit`, `unreadOnly`
**Permissions:** Authenticated users

---

### Mark as Read

**Endpoint:** `PUT /notifications/:notificationId/read`
**Headers:** `Authorization: Bearer <token>`

---

### Mark All as Read

**Endpoint:** `PUT /notifications/mark-all-read`
**Headers:** `Authorization: Bearer <token>`

---

### Get Unread Count

**Endpoint:** `GET /notifications/unread-count`
**Headers:** `Authorization: Bearer <token>`

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Email is required", "value": null }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK – Successful request                 |
| 201  | Created – Resource created successfully |
| 400  | Bad Request – Validation error          |
| 401  | Unauthorized – Authentication required  |
| 403  | Forbidden – Insufficient permissions    |
| 404  | Not Found – Resource not found          |
| 409  | Conflict – Resource already exists      |
| 429  | Too Many Requests – Rate limit exceeded |
| 500  | Internal Server Error – Server error    |

---

### Validation Errors

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 6 characters long",
      "value": "123"
    }
  ]
}
```

---

## 🔄 Pagination

All list endpoints support pagination.

**Response Structure:**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15,
      "hasNext": true,
      "hasPrev": false,
      "nextPage": 2,
      "prevPage": null
    }
  }
}
```

---

## 📡 Real-time Features

**WebSocket Events (Planned):**

* Device status updates
* Real-time sensor data
* Command execution status
* Notification delivery

**Polling Recommendations:**

* Device status: every **30s**
* Sensor data: every **1–5m**
* Notifications: every **1m**

---

## 🔐 Rate Limiting

| Category               | Limit                         |
| ---------------------- | ----------------------------- |
| General Endpoints      | 100 requests / 15 min         |
| Authentication         | 5 requests / 15 min           |
| Sensor Data Submission | 60 requests / minute / device |

---
