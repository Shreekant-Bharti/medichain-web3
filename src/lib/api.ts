import axios, { AxiosInstance, AxiosError } from "axios";
import type { ApiResponse } from "@/types";

const BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "Server error";
      console.error("API Error:", message);
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      throw new Error("Request failed");
    }
  }
);

// Patient APIs
export const patientAPI = {
  /**
   * Get patient by token ID
   */
  getPatient: async (tokenId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/patient/${tokenId}`
    );
    return response.data;
  },

  /**
   * Get patient by wallet address
   */
  getPatientByAddress: async (address: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/patient/address/${address}`
    );
    return response.data;
  },

  /**
   * Get patient's access list
   */
  getAccessList: async (tokenId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/patient/${tokenId}/access`
    );
    return response.data;
  },

  /**
   * Sync patient data from blockchain
   */
  syncPatient: async (tokenId: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/patient/sync`, {
      tokenId,
    });
    return response.data;
  },
};

// Prescription APIs
export const prescriptionAPI = {
  /**
   * Get prescription by ID
   */
  getPrescription: async (prescriptionId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/prescription/${prescriptionId}`
    );
    return response.data;
  },

  /**
   * Get patient's prescriptions
   */
  getPatientPrescriptions: async (tokenId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/prescription/patient/${tokenId}`
    );
    return response.data;
  },

  /**
   * Get doctor's prescriptions
   */
  getDoctorPrescriptions: async (doctorAddress: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/prescription/doctor/${doctorAddress}`
    );
    return response.data;
  },

  /**
   * Verify prescription
   */
  verifyPrescription: async (prescriptionId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/prescription/${prescriptionId}/verify`
    );
    return response.data;
  },

  /**
   * Sync prescription from blockchain
   */
  syncPrescription: async (prescriptionId: string) => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/prescription/sync`,
      { prescriptionId }
    );
    return response.data;
  },
};

// Doctor APIs
export const doctorAPI = {
  /**
   * Get doctor by address
   */
  getDoctor: async (address: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/doctor/${address}`
    );
    return response.data;
  },

  /**
   * Get all verified doctors
   */
  getVerifiedDoctors: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/doctor/verified");
    return response.data;
  },

  /**
   * Get doctor's patients (who granted access)
   */
  getDoctorPatients: async (doctorAddress: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/doctor/${doctorAddress}/patients`
    );
    return response.data;
  },

  /**
   * Sync doctor from blockchain
   */
  syncDoctor: async (address: string) => {
    const response = await apiClient.post<ApiResponse<any>>("/doctor/sync", {
      address,
    });
    return response.data;
  },
};

// Pharmacy APIs
export const pharmacyAPI = {
  /**
   * Get pharmacy by address
   */
  getPharmacy: async (address: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/pharmacy/${address}`
    );
    return response.data;
  },

  /**
   * Get all verified pharmacies
   */
  getVerifiedPharmacies: async () => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/pharmacy/verified"
    );
    return response.data;
  },

  /**
   * Search pharmacies by location
   */
  searchPharmaciesByLocation: async (location: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/pharmacy/search?location=${location}`
    );
    return response.data;
  },

  /**
   * Sync pharmacy from blockchain
   */
  syncPharmacy: async (address: string) => {
    const response = await apiClient.post<ApiResponse<any>>("/pharmacy/sync", {
      address,
    });
    return response.data;
  },
};

// Analytics APIs
export const analyticsAPI = {
  /**
   * Get platform statistics
   */
  getPlatformStats: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/analytics/stats");
    return response.data;
  },

  /**
   * Get prescription analytics
   */
  getPrescriptionAnalytics: async (period: string = "30d") => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/analytics/prescriptions?period=${period}`
    );
    return response.data;
  },

  /**
   * Get fraud detection alerts
   */
  getFraudAlerts: async () => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/analytics/fraud-alerts"
    );
    return response.data;
  },
};

// Auth APIs
export const authAPI = {
  /**
   * Login with wallet signature
   */
  login: async (address: string, signature: string) => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      "/auth/login",
      {
        address,
        signature,
      }
    );

    if (response.data.success && response.data.data?.token) {
      localStorage.setItem("auth_token", response.data.data.token);
    }

    return response.data;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem("auth_token");
  },

  /**
   * Get nonce for signing
   */
  getNonce: async (address: string) => {
    const response = await apiClient.get<ApiResponse<{ nonce: string }>>(
      `/auth/nonce/${address}`
    );
    return response.data;
  },
};

export default apiClient;
