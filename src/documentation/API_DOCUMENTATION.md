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
| name     | string | Yes      | Full name of the user |
| email    | string | Yes      | Valid email address   |
| password | string | Yes      | Account password      |

**Request Example**

```json
{
  "name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "password": "S3cur3P@ssword!"
}
```

**Response `201 Created`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "is_admin": false,
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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhM2YxYzJkNC0xMWIyLTRlM2EtOWY4Yy0xMjM0NTY3ODlhYmMiLCJleHAiOjE3NDUwMDAwMDB9.signature",
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
  "name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "is_admin": false,
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
  "id": "d7e2f3a1-22c3-5f4b-8e9d-abcdef012345",
  "device_id": "EPUMP-001",
  "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "pump_status": "off",
  "is_online": true,
  "claimed_at": "2026-04-18T09:15:00Z"
}
```

---

#### `GET /devices/`

List all devices owned by the currently authenticated user.

- **Auth required:** Yes

**Response `200 OK`**

```json
[
  {
    "id": "d7e2f3a1-22c3-5f4b-8e9d-abcdef012345",
    "device_id": "EPUMP-001",
    "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
    "pump_status": "off",
    "is_online": true,
    "claimed_at": "2026-04-18T09:15:00Z"
  },
  {
    "id": "e8f3a4b2-33d4-6e5c-9f0e-bcdef1234567",
    "device_id": "EPUMP-002",
    "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
    "pump_status": "on",
    "is_online": false,
    "claimed_at": "2026-04-17T14:30:00Z"
  }
]
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
  "flow_rate": 12.5,
  "pressure": 3.2,
  "temperature": 28.7,
  "water_level": 85.0,
  "pump_status": "on",
  "recorded_at": "2026-04-18T10:00:00Z"
}
```

---

#### `GET /telemetry/history/{device_id}`

Retrieve a list of historical telemetry readings from the specified device. The authenticated user must be the owner of the device, unless they have admin privileges.

- **Auth required:** Yes

**Path Parameters**

| Name      | Location | Type   | Required | Description              |
|-----------|----------|--------|----------|--------------------------|
| device_id | path     | string | Yes      | Target device identifier |

**Query Parameters**

| Name  | Location | Type    | Required | Description                                   |
|-------|----------|---------|----------|-----------------------------------------------|
| limit | query    | integer | No       | Maximum number of records to return (default: 100) |

**Response `200 OK`**

```json
[
  {
    "id": "t1a2b3c4-44e5-7f6d-a1b2-cdef23456789",
    "device_id": "EPUMP-001",
    "flow_rate": 12.5,
    "pressure": 3.2,
    "temperature": 28.7,
    "water_level": 85.0,
    "pump_status": "on",
    "recorded_at": "2026-04-18T10:00:00Z"
  },
  {
    "id": "t2b3c4d5-55f6-8a7e-b2c3-def034567890",
    "device_id": "EPUMP-001",
    "flow_rate": 11.8,
    "pressure": 3.0,
    "temperature": 28.5,
    "water_level": 83.5,
    "pump_status": "on",
    "recorded_at": "2026-04-18T09:55:00Z"
  }
]
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

| Field   | Type   | Required | Description                          |
|---------|--------|----------|--------------------------------------|
| command | string | Yes      | Pump command: `"on"` or `"off"`      |

**Request Example**

```json
{
  "command": "on"
}
```

**Response `200 OK`**

```json
{
  "device_id": "EPUMP-001",
  "command": "on",
  "status": "sent",
  "sent_at": "2026-04-18T10:05:00Z"
}
```

---

### Devices (Admin)

> All endpoints in this group require Admin or Superuser privileges.

---

#### `GET /admin/devices/`

Retrieve a list of all devices registered in the system.

- **Auth required:** Yes (Admin)

**Response `200 OK`**

```json
[
  {
    "id": "d7e2f3a1-22c3-5f4b-8e9d-abcdef012345",
    "device_id": "EPUMP-001",
    "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
    "pump_status": "off",
    "is_online": true,
    "claimed_at": "2026-04-18T09:15:00Z"
  }
]
```

---

#### `POST /admin/devices/`

Manually add a new device to the system.

- **Auth required:** Yes (Admin)

**Request Body**

| Field     | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| device_id | string | Yes      | Unique identifier for the device |

**Request Example**

```json
{
  "device_id": "EPUMP-003"
}
```

**Response `201 Created`**

```json
{
  "id": "f9a4b5c3-66g7-9b8f-c3d4-ef0145678901",
  "device_id": "EPUMP-003",
  "owner_id": null,
  "pump_status": "off",
  "is_online": false,
  "claimed_at": null
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
  "id": "d7e2f3a1-22c3-5f4b-8e9d-abcdef012345",
  "device_id": "EPUMP-001",
  "owner_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "pump_status": "on",
  "is_online": true,
  "claimed_at": "2026-04-18T09:15:00Z"
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

| Field       | Type   | Required | Description                            |
|-------------|--------|----------|----------------------------------------|
| owner_id    | string | No       | UUID of the new owner user             |
| pump_status | string | No       | Pump status override: `"on"` or `"off"` |

**Request Example**

```json
{
  "owner_id": "b4e2d3f5-33c4-6g5d-a2b3-def123456789",
  "pump_status": "off"
}
```

**Response `200 OK`**

```json
{
  "id": "d7e2f3a1-22c3-5f4b-8e9d-abcdef012345",
  "device_id": "EPUMP-001",
  "owner_id": "b4e2d3f5-33c4-6g5d-a2b3-def123456789",
  "pump_status": "off",
  "is_online": true,
  "claimed_at": "2026-04-18T09:15:00Z"
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

Retrieve a list of all registered users in the system.

- **Auth required:** Yes (Admin)

**Response `200 OK`**

```json
[
  {
    "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
    "name": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "is_admin": false,
    "created_at": "2026-04-18T08:00:00Z"
  },
  {
    "id": "b4e2d3f5-22c3-5f4b-8e9d-234567890bcd",
    "name": "Siti Rahayu",
    "email": "siti.rahayu@example.com",
    "is_admin": true,
    "created_at": "2026-04-10T07:30:00Z"
  }
]
```

---

#### `POST /admin/users/`

Manually create a new user account.

- **Auth required:** Yes (Admin)

**Request Body**

| Field    | Type    | Required | Description                           |
|----------|---------|----------|---------------------------------------|
| name     | string  | Yes      | Full name of the user                 |
| email    | string  | Yes      | Unique email address                  |
| password | string  | Yes      | Initial password                      |
| is_admin | boolean | No       | Grant admin role (default: `false`)   |

**Request Example**

```json
{
  "name": "Agus Wijaya",
  "email": "agus.wijaya@example.com",
  "password": "Adm1nP@ss!",
  "is_admin": false
}
```

**Response `201 Created`**

```json
{
  "id": "c5f3e4g6-33d4-6e5c-9f0e-345678901cde",
  "name": "Agus Wijaya",
  "email": "agus.wijaya@example.com",
  "is_admin": false,
  "created_at": "2026-04-18T11:00:00Z"
}
```

---

#### `GET /admin/users/{user_id}`

Retrieve the details of a specific user by their UUID.

- **Auth required:** Yes (Admin)

**Path Parameters**

| Name    | Location | Type   | Required | Description       |
|---------|----------|--------|----------|-------------------|
| user_id | path     | string (uuid) | Yes | Target user UUID |

**Response `200 OK`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "is_admin": false,
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

| Field    | Type    | Required | Description                      |
|----------|---------|----------|----------------------------------|
| name     | string  | No       | Updated full name                |
| email    | string  | No       | Updated email address            |
| password | string  | No       | New password                     |
| is_admin | boolean | No       | Grant or revoke admin privileges |

**Request Example**

```json
{
  "name": "Budi Santoso Updated",
  "is_admin": true
}
```

**Response `200 OK`**

```json
{
  "id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
  "name": "Budi Santoso Updated",
  "email": "budi.santoso@example.com",
  "is_admin": true,
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

| Name     | Location | Type    | Required | Description                                              |
|----------|----------|---------|----------|----------------------------------------------------------|
| category | query    | string  | No       | Filter by log category (e.g., `auth`, `device`, `control`) |
| user_id  | query    | string  | No       | Filter by a specific user's ID                           |
| limit    | query    | integer | No       | Maximum records to return (1–1000, default: 100)         |
| offset   | query    | integer | No       | Number of records to skip for pagination (default: 0)    |

**Response `200 OK`**

```json
[
  {
    "id": "log1a2b3-55f6-8c7e-b3c4-ef0156789012",
    "user_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
    "category": "control",
    "description": "User sent command 'on' to device EPUMP-001",
    "created_at": "2026-04-18T10:05:00Z"
  },
  {
    "id": "log2b3c4-66g7-9d8f-c4d5-f01267890123",
    "user_id": "a3f1c2d4-11b2-4e3a-9f8c-123456789abc",
    "category": "auth",
    "description": "User logged in successfully",
    "created_at": "2026-04-18T08:00:30Z"
  }
]
```

---

#### `GET /admin/activity-logs/count`

Return the total count of activity logs, with optional filtering by category and user.

- **Auth required:** Yes (Admin)

**Query Parameters**

| Name     | Location | Type   | Required | Description                                              |
|----------|----------|--------|----------|----------------------------------------------------------|
| category | query    | string | No       | Filter by log category                                   |
| user_id  | query    | string | No       | Filter by a specific user's ID                           |

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

| Name   | Location | Type   | Required | Description                                                               |
|--------|----------|--------|----------|---------------------------------------------------------------------------|
| filter | query    | string | No       | Filter user type: `"include_admin"` (default) or `"exclude_admin"` or `"only_admin"` |

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

| Name   | Location | Type   | Required | Description                                                             |
|--------|----------|--------|----------|-------------------------------------------------------------------------|
| filter | query    | string | No       | Filter device status: `"all"` (default), `"claimed"`, or `"unclaimed"` |

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
| name     | string | Yes      | Full name         |
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

| Field    | Type    | Required | Description                         |
|----------|---------|----------|-------------------------------------|
| name     | string  | Yes      | Full name                           |
| email    | string  | Yes      | Unique email address                |
| password | string  | Yes      | Initial password                    |
| is_admin | boolean | No       | Grant admin role (default: `false`) |

---

### UserUpdate

Used by admins to update a user via `PUT /admin/users/{user_id}`.

| Field    | Type    | Required | Description                     |
|----------|---------|----------|---------------------------------|
| name     | string  | No       | Updated full name               |
| email    | string  | No       | Updated email address           |
| password | string  | No       | New password                    |
| is_admin | boolean | No       | Grant or revoke admin role      |

---

### UserResponse

Returned by user-related endpoints.

| Field      | Type    | Description                          |
|------------|---------|--------------------------------------|
| id         | string (uuid) | Unique user identifier         |
| name       | string  | Full name                            |
| email      | string  | Email address                        |
| is_admin   | boolean | Whether the user has admin privileges |
| created_at | string (datetime) | Account creation timestamp |

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

| Field     | Type   | Required | Description                      |
|-----------|--------|----------|----------------------------------|
| device_id | string | Yes      | Unique identifier for the device |

---

### DeviceUpdate

Used by admins to update a device via `PUT /admin/devices/{device_id}`.

| Field       | Type   | Required | Description                            |
|-------------|--------|----------|----------------------------------------|
| owner_id    | string | No       | UUID of the new owner user             |
| pump_status | string | No       | Override pump status: `"on"` or `"off"` |

---

### DeviceResponse

Returned by device-related endpoints.

| Field       | Type    | Description                              |
|-------------|---------|------------------------------------------|
| id          | string (uuid) | Internal unique device record ID   |
| device_id   | string  | Human-readable device identifier (e.g., `EPUMP-001`) |
| owner_id    | string (uuid) | UUID of the owning user, or `null` if unclaimed |
| pump_status | string  | Current pump status: `"on"` or `"off"`   |
| is_online   | boolean | Whether the device is currently online   |
| claimed_at  | string (datetime) | Timestamp when the device was claimed, or `null` |

---

### TelemetryResponse

Returned by telemetry endpoints.

| Field       | Type    | Description                                    |
|-------------|---------|------------------------------------------------|
| id          | string (uuid) | Unique telemetry record ID               |
| device_id   | string  | Source device identifier                       |
| flow_rate   | number  | Water flow rate (L/min)                        |
| pressure    | number  | Water pressure (bar)                           |
| temperature | number  | Water temperature (°C)                         |
| water_level | number  | Water level percentage (0–100)                 |
| pump_status | string  | Pump status at time of reading: `"on"` or `"off"` |
| recorded_at | string (datetime) | Timestamp of the sensor reading        |

---

### ControlCommand

Used to send a pump command via `POST /control/{device_id}`.

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| command | string | Yes      | Pump command: `"on"` or `"off"` |

---

### ControlResponse

Returned after a control command is dispatched.

| Field     | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| device_id | string | Target device identifier                |
| command   | string | Command that was sent                   |
| status    | string | Dispatch status, typically `"sent"`     |
| sent_at   | string (datetime) | Timestamp when command was sent |

---

### ActivityLogResponse

Returned by activity log endpoints.

| Field       | Type    | Description                                  |
|-------------|---------|----------------------------------------------|
| id          | string (uuid) | Unique log entry ID                    |
| user_id     | string (uuid) | ID of the user who performed the action |
| category    | string  | Log category (see `ActivityCategory`)        |
| description | string  | Human-readable description of the activity   |
| created_at  | string (datetime) | Timestamp of the activity             |

---

### ActivityCategory

Enumeration of valid activity log categories.

| Value   | Description                       |
|---------|-----------------------------------|
| auth    | Login, logout, and auth events    |
| device  | Device claim and management events |
| control | Pump control commands             |
| admin   | Administrative actions            |

---

### UserFilter

Query filter for the user count dashboard endpoint.

| Value         | Description                                  |
|---------------|----------------------------------------------|
| include_admin | Count both regular users and admins (default) |
| exclude_admin | Count only regular (non-admin) users         |
| only_admin    | Count only admin users                       |

---

### DeviceFilter

Query filter for the device count dashboard endpoint.

| Value     | Description                            |
|-----------|----------------------------------------|
| all       | Count all devices (default)            |
| claimed   | Count only devices with an owner       |
| unclaimed | Count only devices without an owner    |

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
