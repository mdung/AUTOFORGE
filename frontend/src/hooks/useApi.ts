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

  const query = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(token),
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

  const query = useQuery({
    queryKey: ['appointments'],
    queryFn: () => api.getAppointments(token),
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

  const query = useQuery({
    queryKey: ['repairOrders'],
    queryFn: () => api.getRepairOrders(token),
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
