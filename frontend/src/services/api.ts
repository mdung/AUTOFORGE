import { API_URL } from '../config/env';

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Customers
  getCustomers: async (token?: string) => {
    const res = await fetch(`${API_URL}/customers`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },
  createCustomer: async (customer: any, token?: string) => {
    const res = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
  },

  // Vehicles
  getVehicles: async (token?: string) => {
    const res = await fetch(`${API_URL}/vehicles`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return res.json();
  },
  createVehicle: async (vehicle: any, token?: string) => {
    const res = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(vehicle)
    });
    if (!res.ok) throw new Error('Failed to create vehicle');
    return res.json();
  },

  // Parts
  getParts: async (token?: string) => {
    const res = await fetch(`${API_URL}/parts`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch parts');
    return res.json();
  },
  createPart: async (part: any, token?: string) => {
    const res = await fetch(`${API_URL}/parts`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(part)
    });
    if (!res.ok) throw new Error('Failed to create part');
    return res.json();
  },
  updatePartStock: async (partId: string, qtyChange: number, token?: string) => {
    const res = await fetch(`${API_URL}/parts/${partId}/stock?change=${qtyChange}`, {
      method: 'PUT',
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to update part stock');
    return res.json();
  },

  // Appointments
  getAppointments: async (token?: string) => {
    const res = await fetch(`${API_URL}/appointments`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },
  createAppointment: async (appointment: any, token?: string) => {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(appointment)
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  },

  // Repair Orders
  getRepairOrders: async (token?: string) => {
    const res = await fetch(`${API_URL}/repairorders`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch repair orders');
    return res.json();
  },
  getRepairOrdersPaginated: async (page: number, size: number, token?: string) => {
    const res = await fetch(`${API_URL}/repairorders/paginated?page=${page}&size=${size}`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch paginated repair orders');
    return res.json();
  },
  createRepairOrder: async (ro: any, token?: string) => {
    const res = await fetch(`${API_URL}/repairorders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(ro)
    });
    if (!res.ok) throw new Error('Failed to create repair order');
    return res.json();
  },
  updateROStatus: async (roId: string, status: string, token?: string) => {
    const res = await fetch(`${API_URL}/repairorders/${roId}/status?status=${status}`, {
      method: 'PUT',
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to update repair order status');
    return res.json();
  },

  // Estimates
  getEstimates: async (token?: string) => {
    const res = await fetch(`${API_URL}/estimates`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch estimates');
    return res.json();
  },
  getEstimateItems: async (estimateId: string, token?: string) => {
    const res = await fetch(`${API_URL}/estimates/${estimateId}/items`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch estimate items');
    return res.json();
  },
  createEstimate: async (estimate: any, token?: string) => {
    const res = await fetch(`${API_URL}/estimates`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(estimate)
    });
    if (!res.ok) throw new Error('Failed to create estimate');
    return res.json();
  },
  approveEstimate: async (estimateId: string, approvedItemIds: string[], signature: string, token?: string) => {
    const res = await fetch(`${API_URL}/estimates/${estimateId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ approvedItemIds, signature })
    });
    if (!res.ok) throw new Error('Failed to approve estimate');
    return res.json();
  },

  // Invoices
  getInvoices: async (token?: string) => {
    const res = await fetch(`${API_URL}/invoices`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },
  generateInvoice: async (roId: string, token?: string) => {
    const res = await fetch(`${API_URL}/invoices/repairorders/${roId}`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to generate invoice');
    return res.json();
  },
};
