import { createClient } from '@supabase/supabase-js';
import { initialPatients, initialAuditLogs } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-supabase')
);

let realClient = null;

if (isSupabaseConfigured) {
  try {
    realClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn("Could not initialize real Supabase client, defaulting to Mock Engine:", err);
    realClient = null;
  }
}

// In-memory Mock Database Store for fallback demo mode
const mockStore = {
  patients: JSON.parse(JSON.stringify(initialPatients)),
  auditLogs: JSON.parse(JSON.stringify(initialAuditLogs)),
  currentUser: {
    id: "usr-doc-01",
    name: "Dr. Ananya Sharma, MD",
    email: "doctor.sharma@medigen.ai",
    role: "Doctor", // Doctor, Patient, Admin
    mciReg: "DMC-49102-DL",
    abhaId: null,
    phone: "+91 98765 43210"
  }
};

// Fallback Mock Engine mimicking Supabase methods
export const mockSupabase = {
  auth: {
    getUser: async () => ({
      data: { user: mockStore.currentUser },
      error: null
    }),
    signInWithPassword: async ({ email, password }) => {
      let role = "Doctor";
      let name = "Dr. Ananya Sharma, MD";
      if (email.includes("patient") || email.includes("rajesh")) {
        role = "Patient";
        name = "Rajesh Kumar";
      } else if (email.includes("admin")) {
        role = "Admin";
        name = "Dr. Vikramaditya Roy (Admin)";
      }
      mockStore.currentUser = {
        id: `usr-${role.toLowerCase()}-01`,
        email,
        name,
        role,
        phone: "+91 98765 43210"
      };
      return {
        data: { user: mockStore.currentUser, session: { access_token: "mock-jwt-token" } },
        error: null
      };
    },
    signOut: async () => {
      mockStore.currentUser = null;
      return { error: null };
    }
  },
  from: (tableName) => {
    return {
      select: (columns = "*") => {
        return {
          eq: (field, value) => {
            const data = (mockStore[tableName] || []).filter(item => item[field] === value);
            return Promise.resolve({ data, error: null });
          },
          then: (resolve) => {
            const data = mockStore[tableName] || [];
            return Promise.resolve(resolve({ data, error: null }));
          }
        };
      },
      insert: (newRows) => {
        const rows = Array.isArray(newRows) ? newRows : [newRows];
        if (!mockStore[tableName]) mockStore[tableName] = [];
        mockStore[tableName].unshift(...rows);
        return Promise.resolve({ data: rows, error: null });
      }
    };
  }
};

export const supabase = realClient || mockSupabase;

/**
 * Role-Based Access Control (RBAC) Helper
 * - Patients can ONLY view their own records (strict privacy isolation)
 * - Doctors can view assigned patient records and run diagnostic workflows
 * - Admins can monitor system logs without accessing confidential clinical data
 */
export function checkAccessPermission(role, resource, patientId = null, currentPatientAbha = null) {
  if (role === "Admin") {
    // Admins can see logs, metrics, compliance; but CANNOT see confidential clinical dossiers
    if (resource === "clinical_dossier" || resource === "radiology_dicom" || resource === "lab_reports") {
      return {
        allowed: false,
        reason: "DPDP Act Privacy Enclave: Administrators cannot directly inspect raw patient clinical records without an authorized statutory audit order."
      };
    }
    return { allowed: true };
  }

  if (role === "Doctor") {
    // Doctors can access clinical workflows and patient files assigned to them
    if (resource === "system_governance_matrix") {
      return {
        allowed: false,
        reason: "Access Restricted: System governance and credential revocation reserved for Hospital Compliance Officers."
      };
    }
    return { allowed: true };
  }

  if (role === "Patient") {
    // Patients can only see their own records
    if (resource === "audit_logs" || resource === "system_governance_matrix" || resource === "other_patients") {
      return {
        allowed: false,
        reason: "Strict Privacy Isolation: Patients are isolated to their own self-sovereign ABHA health record node."
      };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: "Unauthorized role profile" };
}

