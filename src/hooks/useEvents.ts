'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as eventApi from '@/api/event';

export const useEvents = (params?: {
  search?: string;
  category?: string;
  time?: string;
  date?: string;
}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const { data } = await eventApi.getAllEvents(params);
      return data;
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await eventApi.getEvent(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await eventApi.getCategories();
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => eventApi.likeEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['my-likes'] });
    },
  });
};

export const useUnlikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => eventApi.unlikeEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['my-likes'] });
    },
  });
};
