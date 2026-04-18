// ── Enums ──
export enum Role {
  USER = "user",
  ADMIN = "admin",
  SUPERUSER = "superuser",
}

export enum PumpAction {
  ON = "on",
  OFF = "off",
}

// ── Auth ──
export interface UserRegister {
  nama: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  nama: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  nama: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdateAdmin {
  nama?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
}

// ── Device ──
export interface DeviceClaim {
  device_id: string;
}

export interface DeviceCreate {
  device_id: string;
  owner_id?: string | null;
  status_pompa?: boolean;
}

export interface DeviceUpdate {
  owner_id?: string | null;
  status_pompa?: boolean | null;
}

export interface DeviceResponse {
  device_id: string;
  owner_id: string | null;
  status_pompa: boolean;
  last_seen: string | null;
}

// ── Telemetry ──
export interface TelemetryResponse {
  id: string;
  device_id: string;
  data: Record<string, unknown>;
  created_at: string;
}

// ── Control ──
export interface ControlCommand {
  action: PumpAction;
}

export interface ControlResponse {
  device_id: string;
  action: string;
  message: string;
}

// ── Activity Log ──
export enum ActivityCategory {
  DEVICE = "device",
  CONTROL = "control",
  ADMINISTRATIVE = "administrative",
}

export interface ActivityLogResponse {
  id: string;
  user_id: string;
  category: ActivityCategory;
  data: Record<string, unknown>;
  created_at: string;
}

export interface ActivityLogListQuery {
  category?: ActivityCategory;
  user_id?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityLogCountResponse {
  count: number;
}

// ── Dashboard ──
export enum UserFilter {
  INCLUDE_ADMIN = "include_admin",
  EXCLUDE_ADMIN = "exclude_admin",
  ONLY_ADMIN = "only_admin",
}

export enum DeviceFilter {
  ALL = "all",
  CLAIMED = "claimed",
  UNCLAIMED = "unclaimed",
}

export interface CountResponse {
  count: number;
}

// ── API Error ──
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
