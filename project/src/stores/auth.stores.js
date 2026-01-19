import {create} from 'zustand';

export const useAuthStore = create(set => ({
  loading: false,
  setLoading: loading => set({loading}),
}));
