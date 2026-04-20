# Smart E-Pump API Documentation

## Introduction

The Smart E-Pump API is a RESTful backend service for monitoring and controlling water pumps in real time. It provides endpoints for user authentication, device management (claim, list, and administer pumps), real-time telemetry data retrieval, remote pump control via MQTT, and administrative operations covering users, devices, activity logs, and dashboard statistics. All protected endpoints require a valid JSON Web Token (JWT) obtained through the login flow.

---

## Base URL

```
https://your-server-domain.com
```

> Replace `your-server-domain.com` with the actual host where the API is deployed.

---

## Authentication

The API uses **Bearer JWT** authentication. To access protected endpoints, include the token in the `Authorization` header of every request:

```
Authorization: Bearer <your_jwt_token>
```

Obtain a token by calling `POST /auth/login` with valid credentials. Tokens are signed and time-limited. Admin-only endpoints additionally require the authenticated user to have an admin or superuser role.

---

## Endpoints

### Authentication

---

#### `POST /auth/register`

Register a new user account with a name, email address, and password.

- **Auth required:** No

**Request Body**

| Field    | Type   | Required | Description           |
|----------|--------|----------|-----------------------|
| nama     | string | Yes      | Full name of the user |
| email    | string | Yes      | Valid email address   |
| password | string | Yes      | Account password      |

**Request Example**

```json
{
  "nama": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "password": "S3cur3P@ssword!"
}
```

**Response `201 Created`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "nama": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "role": "user",
  "created_at": "2026-04-18T08:00:00Z"
}
```

---

#### `POST /auth/login`

Authenticate with an email and password. Returns a JWT access token to be used in subsequent requests.

- **Auth required:** No

**Request Body**

| Field    | Type   | Required | Description         |
|----------|--------|----------|---------------------|
| email    | string | Yes      | Registered email    |
| password | string | Yes      | Account password    |

**Request Example**

```json
{
  "email": "budi.santoso@example.com",
  "password": "S3cur3P@ssword!"
}
```

**Response `200 OK`**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

#### `GET /auth/me`

Retrieve the full profile of the currently authenticated user.

- **Auth required:** Yes

**Response `200 OK`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "nama": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "role": "user",
  "created_at": "2026-04-18T08:00:00Z"
}
```

---

### Devices (User)

---

#### `POST /devices/claim`

Claim a device by its ID (Scan-to-Claim). Maps the given `device_id` to the currently authenticated user. Returns an error if the device has already been claimed by another user.

- **Auth required:** Yes

**Request Body**

| Field     | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| device_id | string | Yes      | Unique device identifier  |

**Request Example**

```json
{
  "device_id": "EPUMP-001"
}
```

**Response `200 OK`**

```json
{
  "device_id": "EPUMP-001",
  "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "status_pompa": false,
  "last_seen": null
}
```

---

#### `GET /devices/`

List all devices owned by the currently authenticated user. Supports pagination.

- **Auth required:** Yes

**Query Parameters**

| Name      | Type    | Required | Description                        |
|-----------|---------|----------|------------------------------------|
| page      | integer | No       | Page number (default: 1, min: 1)   |
| page_size | integer | No       | Items per page (default: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "device_id": "EPUMP-001",
      "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
      "status_pompa": false,
      "last_seen": "2026-04-18T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

---

### Telemetry

---

#### `GET /telemetry/latest/{device_id}`

Retrieve the most recent telemetry reading from the specified device. The authenticated user must be the owner of the device.

- **Auth required:** Yes

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Response `200 OK`**

```json
{
  "id": "t1a2b3c4-44e5-7f6d-a1b2-cdef23456789",
  "device_id": "EPUMP-001",
  "data": {
    "flow_rate": 12.5,
    "pressure": 3.2,
    "temperature": 28.7,
    "water_level": 85.0
  },
  "created_at": "2026-04-18T10:00:00Z"
}
```

---

#### `GET /telemetry/history/{device_id}`

Retrieve a paginated list of historical telemetry readings from the specified device. The authenticated user must be the owner of the device, unless they have admin privileges.

- **Auth required:** Yes

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Query Parameters**

| Name      | Type    | Required | Description                         |
|-----------|---------|----------|-------------------------------------|
| page      | integer | No       | Page number (default: 1, min: 1)    |
| page_size | integer | No       | Items per page (default: 20, max: 200) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "t1a2b3c4-44e5-7f6d-a1b2-cdef23456789",
      "device_id": "EPUMP-001",
      "data": {
        "flow_rate": 12.5,
        "pressure": 3.2,
        "temperature": 28.7,
        "water_level": 85.0
      },
      "created_at": "2026-04-18T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

---

### Control

---

#### `POST /control/{device_id}`

Send a control command (`on` or `off`) to a pump via MQTT. The authenticated user must be the owner of the device. Ownership is verified before the command is dispatched.

- **Auth required:** Yes

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Request Body**

| Field  | Type   | Required | Description                          |
|--------|--------|----------|--------------------------------------|
| action | string | Yes      | Pump command: `"on"` or `"off"`      |

**Request Example**

```json
{
  "action": "on"
}
```

**Response `200 OK`**

```json
{
  "device_id": "EPUMP-001",
  "action": "on",
  "message": "Command sent successfully"
}
```

---

### Devices (Admin)

> All endpoints in this group require Admin or Superuser privileges.

---

#### `GET /admin/devices/`

Retrieve a paginated list of all devices registered in the system.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name      | Type    | Required | Description                        |
|-----------|---------|----------|------------------------------------|
| page      | integer | No       | Page number (default: 1, min: 1)   |
| page_size | integer | No       | Items per page (default: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "device_id": "EPUMP-001",
      "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
      "status_pompa": false,
      "last_seen": "2026-04-18T09:15:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

---

#### `POST /admin/devices/`

Manually add a new device to the system.

- **Auth required:** Yes (Admin)

**Request Body**

| Field        | Type    | Required | Description                          |
|--------------|---------|----------|--------------------------------------|
| device_id    | string  | Yes      | Unique identifier for the device     |
| owner_id     | string  | No       | UUID of the owner user (optional)    |
| status_pompa | boolean | No       | Initial pump status (default: false) |

**Request Example**

```json
{
  "device_id": "EPUMP-003"
}
```

**Response `201 Created`**

```json
{
  "device_id": "EPUMP-003",
  "owner_id": null,
  "status_pompa": false,
  "last_seen": null
}
```

---

#### `GET /admin/devices/{device_id}`

Retrieve the details of a specific device by its `device_id`.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Response `200 OK`**

```json
{
  "device_id": "EPUMP-001",
  "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "status_pompa": true,
  "last_seen": "2026-04-18T10:00:00Z"
}
```

---

#### `PUT /admin/devices/{device_id}`

Update the data of an existing device, such as its owner or pump status.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Request Body**

| Field        | Type    | Required | Description                  |
|--------------|---------|----------|------------------------------|
| owner_id     | string  | No       | UUID of the new owner user   |
| status_pompa | boolean | No       | Pump status override         |

**Request Example**

```json
{
  "owner_id": "b4e2d3f5-33c4-6g5d-a2b3-def123456789",
  "status_pompa": false
}
```

**Response `200 OK`**

```json
{
  "device_id": "EPUMP-001",
  "owner_id": "b4e2d3f5-33c4-6g5d-a2b3-def123456789",
  "status_pompa": false,
  "last_seen": "2026-04-18T10:00:00Z"
}
```

---

#### `DELETE /admin/devices/{device_id}`

Permanently remove a device from the system.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Response `204 No Content`**

No response body is returned on success.

---

#### `GET /admin/devices/{device_id}/qr`

Generate and return a QR code image containing the `device_id`. This QR code can be printed and attached to physical devices to enable the Scan-to-Claim flow.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Response `200 OK`**

Returns the QR code image. The response content type may be `image/png` or a JSON object wrapping a base64-encoded image, depending on the server implementation.

---

### Users (Admin)

> All endpoints in this group require Admin or Superuser privileges.

---

#### `GET /admin/users/`

Retrieve a paginated list of all registered users in the system.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name      | Type    | Required | Description                        |
|-----------|---------|----------|------------------------------------|
| page      | integer | No       | Page number (default: 1, min: 1)   |
| page_size | integer | No       | Items per page (default: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
      "nama": "Budi Santoso",
      "email": "budi.santoso@example.com",
      "role": "user",
      "created_at": "2026-04-18T08:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

---

#### `POST /admin/users/`

Manually create a new user account.

- **Auth required:** Yes (Admin)

**Request Body**

| Field    | Type   | Required | Description                           |
|----------|--------|----------|---------------------------------------|
| nama     | string | Yes      | Full name of the user                 |
| email    | string | Yes      | Unique email address                  |
| password | string | Yes      | Initial password                      |
| role     | string | No       | User role (default: `"user"`)         |

**Request Example**

```json
{
  "nama": "Agus Wijaya",
  "email": "agus.wijaya@example.com",
  "password": "Adm1nP@ss!"
}
```

**Response `201 Created`**

```json
{
  "id": "c5f3e4g6-33d4-6e5c-9f0e-345678901cde",
  "nama": "Agus Wijaya",
  "email": "agus.wijaya@example.com",
  "role": "user",
  "created_at": "2026-04-18T11:00:00Z"
}
```

---

#### `GET /admin/users/{user_id}`

Retrieve the details of a specific user by their UUID.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name    | Location | Type          | Required | Description       |
|---------|----------|---------------|----------|-------------------|
| user_id | path     | string (uuid) | Yes      | Target user UUID  |

**Response `200 OK`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "nama": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "role": "user",
  "created_at": "2026-04-18T08:00:00Z"
}
```

---

#### `PUT /admin/users/{user_id}`

Update the data of a specific user.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name    | Location | Type          | Required | Description      |
|---------|----------|---------------|----------|------------------|
| user_id | path     | string (uuid) | Yes      | Target user UUID |

**Request Body**

| Field    | Type   | Required | Description              |
|----------|--------|----------|--------------------------|
| nama     | string | No       | Updated full name        |
| email    | string | No       | Updated email address    |
| password | string | No       | New password             |
| role     | string | No       | Updated role             |

**Request Example**

```json
{
  "nama": "Budi Santoso Updated",
  "role": "admin"
}
```

**Response `200 OK`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "nama": "Budi Santoso Updated",
  "email": "budi.santoso@example.com",
  "role": "admin",
  "created_at": "2026-04-18T08:00:00Z"
}
```

---

#### `DELETE /admin/users/{user_id}`

Permanently delete a user from the system.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name    | Location | Type          | Required | Description      |
|---------|----------|---------------|----------|------------------|
| user_id | path     | string (uuid) | Yes      | Target user UUID |

**Response `204 No Content`**

No response body is returned on success.

---

### Activity Logs (Admin)

> All endpoints in this group require Admin or Superuser privileges.

---

#### `GET /admin/activity-logs/`

Retrieve a paginated list of all activity logs. Supports optional filtering by category and user.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name      | Type    | Required | Description                                              |
|-----------|---------|----------|----------------------------------------------------------|
| category  | string  | No       | Filter by log category (`device`, `control`, `administrative`) |
| user_id   | string  | No       | Filter by a specific user's ID                           |
| page      | integer | No       | Page number (default: 1, min: 1)                         |
| page_size | integer | No       | Items per page (default: 20, max: 200)                   |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "log1a2b3-55f6-8c7e-b3c4-ef0156789012",
      "user_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
      "category": "control",
      "data": {
        "device_id": "EPUMP-001",
        "action": "on"
      },
      "created_at": "2026-04-18T10:05:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

---

#### `GET /admin/activity-logs/count`

Return the total count of activity logs, with optional filtering by category and user.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name     | Type   | Required | Description                      |
|----------|--------|----------|----------------------------------|
| category | string | No       | Filter by log category           |
| user_id  | string | No       | Filter by a specific user's ID   |

**Response `200 OK`**

```json
{
  "count": 142
}
```

---

### Dashboard (Admin)

> All endpoints in this group require Admin or Superuser privileges.

---

#### `GET /admin/dashboard/users/count`

Return the total number of registered users. Superuser accounts are never included in the count.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name   | Type   | Required | Description                                                    |
|--------|--------|----------|----------------------------------------------------------------|
| filter | string | No       | Filter user type: `"include_admin"` (default) or `"user_only"` |

**Response `200 OK`**

```json
{
  "count": 58
}
```

---

#### `GET /admin/dashboard/devices/count`

Return the total number of devices registered in the system.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name   | Type   | Required | Description                                                              |
|--------|--------|----------|--------------------------------------------------------------------------|
| filter | string | No       | Filter device status: `"all"` (default), `"registered"`, or `"unregistered"` |

**Response `200 OK`**

```json
{
  "count": 24
}
```

---

### Health

---

#### `GET /`

Health check endpoint. Returns a simple status message to confirm the API is running.

- **Auth required:** No

**Response `200 OK`**

```json
{
  "status": "ok",
  "message": "Smart E-Pump API is running"
}
```

---

## Schemas

The following models define the structure of request bodies and responses used throughout the API.

---

### UserRegister

Used when registering a new user via `POST /auth/register`.

| Field    | Type   | Required | Description       |
|----------|--------|----------|-------------------|
| nama     | string | Yes      | Full name         |
| email    | string | Yes      | Email address     |
| password | string | Yes      | Account password  |

---

### UserLogin

Used when authenticating via `POST /auth/login`.

| Field    | Type   | Required | Description      |
|----------|--------|----------|------------------|
| email    | string | Yes      | Email address    |
| password | string | Yes      | Account password |

---

### UserCreate

Used by admins to create a new user via `POST /admin/users/`.

| Field    | Type   | Required | Description                         |
|----------|--------|----------|-------------------------------------|
| nama     | string | Yes      | Full name                           |
| email    | string | Yes      | Unique email address                |
| password | string | Yes      | Initial password                    |
| role     | string | No       | User role (default: `"user"`)       |

---

### UserUpdate

Used by admins to update a user via `PUT /admin/users/{user_id}`.

| Field    | Type   | Required | Description           |
|----------|--------|----------|-----------------------|
| nama     | string | No       | Updated full name     |
| email    | string | No       | Updated email address |
| password | string | No       | New password          |
| role     | string | No       | Updated role          |

---

### UserResponse

Returned by user-related endpoints.

| Field      | Type          | Description                          |
|------------|---------------|--------------------------------------|
| id         | string (uuid) | Unique user identifier               |
| nama       | string        | Full name                            |
| email      | string        | Email address                        |
| role       | string        | User role (`"user"`, `"admin"`, etc.) |
| created_at | string (datetime) | Account creation timestamp       |

---

### Token

Returned by `POST /auth/login`.

| Field        | Type   | Description                  |
|--------------|--------|------------------------------|
| access_token | string | JWT access token             |
| token_type   | string | Token type, always `"bearer"` |

---

### DeviceClaim

Used to claim a device via `POST /devices/claim`.

| Field     | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| device_id | string | Yes      | Device identifier to claim |

---

### DeviceCreate

Used by admins to add a new device via `POST /admin/devices/`.

| Field        | Type    | Required | Description                          |
|--------------|---------|----------|--------------------------------------|
| device_id    | string  | Yes      | Unique identifier for the device     |
| owner_id     | string  | No       | UUID of the owner user               |
| status_pompa | boolean | No       | Initial pump status (default: false) |

---

### DeviceUpdate

Used by admins to update a device via `PUT /admin/devices/{device_id}`.

| Field        | Type    | Required | Description              |
|--------------|---------|----------|--------------------------|
| owner_id     | string  | No       | UUID of the new owner    |
| status_pompa | boolean | No       | Pump status override     |

---

### DeviceResponse

Returned by device-related endpoints.

| Field        | Type          | Description                                      |
|--------------|---------------|--------------------------------------------------|
| device_id    | string        | Human-readable device identifier (e.g., `EPUMP-001`) |
| owner_id     | string (uuid) | UUID of the owning user, or `null` if unclaimed  |
| status_pompa | boolean       | Current pump status                              |
| last_seen    | string (datetime) | Last time device was seen online, or `null`  |

---

### PaginatedResponse

Generic paginated wrapper returned by list endpoints.

| Field       | Type    | Description                      |
|-------------|---------|----------------------------------|
| items       | array   | Array of result objects          |
| total       | integer | Total number of records          |
| page        | integer | Current page number              |
| page_size   | integer | Number of items per page         |
| total_pages | integer | Total number of pages            |

---

### TelemetryResponse

Returned by telemetry endpoints.

| Field      | Type          | Description                              |
|------------|---------------|------------------------------------------|
| id         | string (uuid) | Unique telemetry record ID               |
| device_id  | string        | Source device identifier                 |
| data       | object        | Sensor readings (key-value pairs)        |
| created_at | string (datetime) | Timestamp of the sensor reading      |

---

### ControlCommand

Used to send a pump command via `POST /control/{device_id}`.

| Field  | Type   | Required | Description                     |
|--------|--------|----------|---------------------------------|
| action | string | Yes      | Pump command: `"on"` or `"off"` |

---

### ControlResponse

Returned after a control command is dispatched.

| Field     | Type   | Description                         |
|-----------|--------|-------------------------------------|
| device_id | string | Target device identifier            |
| action    | string | Command that was sent               |
| message   | string | Dispatch status message             |

---

### ActivityLogResponse

Returned by activity log endpoints.

| Field      | Type          | Description                                    |
|------------|---------------|------------------------------------------------|
| id         | string (uuid) | Unique log entry ID                            |
| user_id    | string (uuid) | ID of the user who performed the action        |
| category   | string        | Log category (see `ActivityCategory`)          |
| data       | object        | Activity details (key-value pairs)             |
| created_at | string (datetime) | Timestamp of the activity                 |

---

### ActivityCategory

Enumeration of valid activity log categories.

| Value          | Description                       |
|----------------|-----------------------------------|
| device         | Device claim and management events |
| control        | Pump control commands             |
| administrative | Administrative actions            |

---

### UserFilter

Query filter for the user count dashboard endpoint.

| Value         | Description                                   |
|---------------|-----------------------------------------------|
| include_admin | Count both regular users and admins (default) |
| user_only     | Count only regular (non-admin) users          |

---

### DeviceFilter

Query filter for the device count dashboard endpoint.

| Value        | Description                            |
|--------------|----------------------------------------|
| all          | Count all devices (default)            |
| registered   | Count only devices with an owner       |
| unregistered | Count only devices without an owner    |

---

### HTTPValidationError

Returned when request validation fails (HTTP `422 Unprocessable Entity`).

| Field  | Type  | Description               |
|--------|-------|---------------------------|
| detail | array | List of validation errors |

Each item in `detail` has the following structure:

| Field | Type   | Description                              |
|-------|--------|------------------------------------------|
| loc   | array  | Location of the error (field path)       |
| msg   | string | Human-readable error message             |
| type  | string | Error type identifier                    |

**Example**

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```
