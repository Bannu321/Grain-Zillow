# 🚀 GrainZillow Setup Guide

A complete step-by-step installation and deployment guide for the **GrainZillow Backend System**.

---

## 📋 Prerequisites

### System Requirements

* **Node.js:** ≥ 16.x
* **MongoDB:** ≥ 5.x
* **npm:** ≥ 8.x (or use **yarn**)
* **OS:** Windows, macOS, or Linux

### Recommended Hardware

* **CPU:** 2+ cores
* **RAM:** 4GB+
* **Storage:** 10GB+ free
* **Network:** Stable internet connection

---

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/grainzillow-backend.git
cd grainzillow-backend
```

### 2. Install Dependencies

Using **npm**:

```bash
npm install
```

Using **yarn**:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# =================================
# SERVER CONFIGURATION
# =================================
NODE_ENV=development
PORT=5000

# =================================
# DATABASE CONFIGURATION
# =================================
MONGODB_URI=mongodb://localhost:27017/grainzillow

# =================================
# JWT CONFIGURATION
# =================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# =================================
# FRONTEND CONFIGURATION
# =================================
FRONTEND_URL=http://localhost:3000

# =================================
# LOGGING CONFIGURATION
# =================================
LOG_LEVEL=info

# =================================
# RATE LIMITING
# =================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

### 4. Database Setup

#### Option A: Local MongoDB

Install MongoDB Community Edition and start the service:

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
net start MongoDB
```

Verify installation:

```bash
mongosh --eval "db.adminCommand('ismaster')"
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account and cluster.
2. Update `.env` with your connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grainzillow
```

---

### 5. Initialize Database (Optional)

Seed the database:

```bash
npm run seed
```

Creates:

* Admin user → `admin@grainzillow.com / Admin123!`
* Manager accounts
* Sample storage requests
* Test devices and historical data

---

### 6. Start the Application

**Development Mode**

```bash
npm run dev
```

**Production Mode**

```bash
npm start
```

**Build for Production**

```bash
npm run build
```

---

### 7. Verify Installation

Check server status:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "GrainZillow Backend is running",
  "environment": "development",
  "database": "connected"
}
```

---

## 🔧 Configuration Details

| Variable       | Description               | Default                                        | Required |
| -------------- | ------------------------- | ---------------------------------------------- | -------- |
| NODE_ENV       | Application environment   | development                                    | No       |
| PORT           | Server port               | 5000                                           | No       |
| MONGODB_URI    | MongoDB connection string | —                                              | Yes      |
| JWT_SECRET     | Secret for JWT tokens     | —                                              | Yes      |
| JWT_EXPIRES_IN | Token lifetime            | 7d                                             | No       |
| FRONTEND_URL   | Allowed frontend origin   | [http://localhost:3000](http://localhost:3000) | No       |
| LOG_LEVEL      | Logging level             | info                                           | No       |

---

### Database Configuration

**Indexes Created Automatically:**

* Users: `email`, `username`, `role+isApproved`
* Managers: `managerId`, `zillowDevice.deviceId`
* Devices: `deviceId`, `managerId`, `status`
* SensorData: `deviceId+timestamp`, `timestamp` (timeseries)
* Storage: `userId+status`, `managerId+status`, `storageId`

**Estimated Storage:**

* Initial: ~100MB
* Growth: ~1GB/year (sensor data)
* Backups: Regular backups recommended

---

## 🎯 Development Setup

### 1. Editor Setup (VS Code Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "mongodb.mongodb-vscode",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 2. Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "env": { "NODE_ENV": "development" }
    }
  ]
}
```

### 3. API Testing

Using **curl**:

```bash
# Get all devices
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/devices
```

Using **Postman**:

* Import `docs/postman-collection.json`
* Set environment variables:

  * `baseUrl`: `http://localhost:5000/api`
  * `token`: `<your-JWT-token>`

---

## 🐳 Docker Setup (Optional)

### Using Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/grainzillow
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Run:

```bash
docker-compose up -d
```

---

## 🔌 IoT Device Integration

**ESP32 Configuration**

Devices auto-register when they send data to:

```
POST /api/data/sensor-data
```

Sample payload:

```json
{
  "deviceId": "ZILLOW_MGR1001",
  "temperature": { "value": 25.5, "unit": "C" },
  "humidity": { "value": 60.2, "unit": "%" },
  "gasLevel": { "value": 450, "unit": "ppm" }
}
```

**Command Fetching:**

```
GET /api/iot/commands/pending?deviceId=ZILLOW_MGR1001
```

---

## 🚀 Production Deployment

### Environment Setup

```bash
export NODE_ENV=production
export JWT_SECRET=$(openssl rand -base64 64)
export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/grainzillow
```

### Process Management with PM2

```bash
npm install -g pm2
pm2 start server.js --name "grainzillow-backend"
pm2 save
pm2 startup
```

### Systemd Alternative

`/etc/systemd/system/grainzillow.service`

```ini
[Unit]
Description=GrainZillow Backend API
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/grainzillow-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.grainzillow.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Setup (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.grainzillow.com
```

---

## 🧪 Testing

**Run Tests**

```bash
npm test
npm run test:integration
npm run test:coverage
```

**Checklist**

* ✅ Server runs and connects to DB
* ✅ JWT auth works
* ✅ Role-based access verified
* ✅ Sensor data accepted
* ✅ Commands delivered

---

## 🔍 Troubleshooting

| Issue              | Error                          | Solution                    |
| ------------------ | ------------------------------ | --------------------------- |
| MongoDB Connection | `Could not connect to MongoDB` | Check MongoDB service & URI |
| JWT Missing        | `JWT secret is required`       | Set `JWT_SECRET` in `.env`  |
| CORS Blocked       | `Blocked by CORS policy`       | Set `FRONTEND_URL`          |
| Too Many Requests  | `Rate limit exceeded`          | Adjust rate limiter         |

Logs:

* Dev: Console
* Prod: `logs/error.log`, `logs/combined.log`
* PM2: `pm2 logs grainzillow-backend`

---

## 📞 Support

* 📚 **Docs:** `docs/API.md`
* 🐛 **Issues:** GitHub Issues
* 📧 **Email:** [support@grainzillow.com](mailto:support@grainzillow.com)
* 💬 **Slack:** `#grainzillow-support`

---

### ✅ Next Steps

* Finish setup
* Connect frontend
* Configure IoT devices
* Set up monitoring and alerts

**Happy coding! 🎉**
