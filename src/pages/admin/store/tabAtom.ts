import { atom } from 'recoil';
import type { Tab } from '@/pages/admin/ProductManagement/types';

export const tabsState = atom<Tab[]>({
  key: 'tabsState',
  default: [],
});

export const activeTabIdState = atom<string | null>({
  key: 'activeTabIdState',
  default: null,
});