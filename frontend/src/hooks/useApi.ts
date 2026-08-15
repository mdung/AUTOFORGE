import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useCustomers = (token?: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.getCustomers(token),
    staleTime: 5 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: (newCustomer: any) => api.createCustomer(newCustomer, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  return { ...query, createCustomer: createMutation.mutateAsync };
};

export const useVehicles = (token?: string) => {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useCustomers(token);

  const query = useQuery({
    queryKey: ['vehicles', customers],
    queryFn: async () => {
      const vehiclesList = await api.getVehicles(token);
      if (!Array.isArray(vehiclesList)) return [];
      return vehiclesList.map((v: any) => {
        const owner = customers.find((c: any) => c.id === v.ownerId);
        return {
          ...v,
          ownerName: v.ownerName || owner?.name || '-'
        };
      });
    },
    staleTime: 5 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: (newVehicle: any) => api.createVehicle(newVehicle, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });

  return { ...query, createVehicle: createMutation.mutateAsync };
};

export const useParts = (token?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['parts'],
    queryFn: () => api.getParts(token),
    staleTime: 5 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: (newPart: any) => api.createPart(newPart, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ partId, qtyChange }: { partId: string; qtyChange: number }) =>
      api.updatePartStock(partId, qtyChange, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    }
  });

  return {
    ...query,
    createPart: createMutation.mutateAsync,
    updatePartStock: updateStockMutation.mutateAsync
  };
};

export const useAppointments = (token?: string) => {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useCustomers(token);
  const { data: vehicles = [] } = useVehicles(token);

  const query = useQuery({
    queryKey: ['appointments', customers, vehicles],
    queryFn: async () => {
      const apptList = await api.getAppointments(token);
      if (!Array.isArray(apptList)) return [];
      return apptList.map((appt: any) => {
        const cust = customers.find((c: any) => c.id === appt.customerId);
        const veh = vehicles.find((v: any) => v.id === appt.vehicleId);
        
        let dateStr = appt.date;
        let timeStr = appt.time;
        if (appt.scheduledTime) {
          try {
            const dt = new Date(appt.scheduledTime);
            dateStr = dateStr || dt.toISOString().split('T')[0];
            timeStr = timeStr || dt.toTimeString().substring(0, 5);
          } catch (e) {
            // fallback
          }
        }

        return {
          ...appt,
          customerName: appt.customerName || cust?.name || 'Khách hàng',
          vehicleDesc: appt.vehicleDesc || (veh ? `${veh.make} ${veh.model} (${veh.licensePlate})` : 'Phương tiện'),
          date: dateStr || '2026-08-14',
          time: timeStr || '08:30',
          type: appt.type || appt.serviceType || 'Bảo dưỡng'
        };
      });
    },
    staleTime: 5 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: (newAppointment: any) => api.createAppointment(newAppointment, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return { ...query, createAppointment: createMutation.mutateAsync };
};

export const useRepairOrders = (token?: string) => {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useCustomers(token);
  const { data: vehicles = [] } = useVehicles(token);

  const query = useQuery({
    queryKey: ['repairOrders', customers, vehicles],
    queryFn: async () => {
      const roList = await api.getRepairOrders(token);
      if (!Array.isArray(roList)) return [];
      return roList.map((ro: any) => {
        const cust = customers.find((c: any) => c.id === ro.customerId);
        const veh = vehicles.find((v: any) => v.id === ro.vehicleId);
        return {
          ...ro,
          customerName: ro.customerName || cust?.name || 'Khách hàng',
          vehicleDesc: ro.vehicleDesc || (veh ? `${veh.make} ${veh.model} (${veh.licensePlate})` : 'Phương tiện')
        };
      });
    },
    staleTime: 5 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: (newRo: any) => api.createRepairOrder(newRo, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairOrders'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ roId, status }: { roId: string; status: string }) =>
      api.updateROStatus(roId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairOrders'] });
    }
  });

  return {
    ...query,
    createRepairOrder: createMutation.mutateAsync,
    updateROStatus: updateStatusMutation.mutateAsync
  };
};

export const useEstimates = (token?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['estimates'],
    queryFn: () => api.getEstimates(token),
    staleTime: 5 * 60 * 1000
  });

  const approveMutation = useMutation({
    mutationFn: ({ estimateId, approvedItemIds, signature }: { estimateId: string; approvedItemIds: string[]; signature: string }) =>
      api.approveEstimate(estimateId, approvedItemIds, signature, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estimates'] });
    }
  });

  return { ...query, approveEstimate: approveMutation.mutateAsync };
};

export const useInvoices = (token?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.getInvoices(token),
    staleTime: 5 * 60 * 1000
  });

  const generateMutation = useMutation({
    mutationFn: (roId: string) => api.generateInvoice(roId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  return { ...query, generateInvoice: generateMutation.mutateAsync };
};
