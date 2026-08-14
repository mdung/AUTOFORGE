# REST API Reference Specifications

All endpoints use JSON payloads and are prefixed with `/api/v1`.

---

## Authentication Endpoints

### 1. Register Tenant Organization
- **Endpoint**: `POST /api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "companyName": "AutoCare Hanoi",
    "firstName": "Minh",
    "lastName": "Tran",
    "email": "advisor@autoforge.com",
    "password": "password",
    "branchName": "Hanoi Branch",
    "branchAddress": "123 Le Thanh Nghi, Hanoi"
  }
  ```
- **Response**: JWT Token + user profiles details.

### 2. Login User
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "advisor@autoforge.com",
    "password": "password"
  }
  ```

---

## Customer & Vehicle Endpoints

### 3. Register Customer
- **Endpoint**: `POST /api/v1/customers`
- **Headers**: `Authorization: Bearer <JWT>`
- **Response**: Customer object.

### 4. Register Vehicle
- **Endpoint**: `POST /api/v1/vehicles`
- **Headers**: `Authorization: Bearer <JWT>`

---

## Workshop Operational Endpoints

### 5. Create Check-In
- **Endpoint**: `POST /api/v1/checkins`
- **Request Body**:
  ```json
  {
    "checkIn": {
      "vehicleId": "v-uuid",
      "advisorId": "u-uuid",
      "mileage": 35000,
      "fuelLevel": "50%"
    },
    "damageRecords": [
      {
        "component": "FRONT",
        "xCoord": 45.2,
        "yCoord": 12.8,
        "damageType": "SCRATCH"
      }
    ]
  }
  ```

### 6. Create Job Time Entry
- **Endpoint**: `POST /api/v1/repairorders/jobs/{jobId}/start`
- **Query Params**: `techId={techId}`
- **Throws**: 400 Bad Request if technician has another running clock timer.
