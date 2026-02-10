'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as eventApi from '@/api/event';

export const useMyLikes = () => {
  return useQuery({
    queryKey: ['my-likes'],
    queryFn: async () => {
      const { data } = await eventApi.getMyLikes();
      return data;
    },
  });
};

export const useMyJoinedEvents = () => {
  return useQuery({
    queryKey: ['my-joined'],
    queryFn: async () => {
      const { data } = await eventApi.getMyJoinedEvents();
      return data;
    },
  });
};

export const useJoinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string | number; message: string }) =>
      eventApi.joinEvent(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-joined'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useCancelJoinMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => eventApi.cancelJoinEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-joined'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
