'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profileApi from '@/api/profile';
import { ProfileData } from '@/types';

export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await profileApi.getProfile();
      return data;
    },
    enabled,
  });
};

export const usePublicProfile = (displayId: string) => {
  return useQuery({
    queryKey: ['profile', 'public', displayId],
    queryFn: async () => {
      const { data } = await profileApi.getPublicProfile(displayId);
      return data;
    },
    enabled: !!displayId,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProfileData>) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
