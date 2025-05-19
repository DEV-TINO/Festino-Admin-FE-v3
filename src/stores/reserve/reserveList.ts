import { create } from 'zustand';
import { alertError, api } from '@/utils/api';

interface ReserveItem {
  reservationId: string; 
  userName: string;
  reservationNum: string | number;
  personCount: number;
  phoneNum: string;
  updateAt: string;
}

type ReserveType = 'reserve' | 'cancel' | 'complete';

interface ReserveList {
  reserve: ReserveItem[];
  cancel: ReserveItem[];
  complete: ReserveItem[];
}

interface ReserveListStore {
  reserveList: ReserveList;
  deleteReserveList: ReserveItem[];
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  setReserveList: (params: { type: string; data: ReserveItem[] }) => void;
  getFilteredReserveList: (type: ReserveType) => ReserveItem[];
  getReserveList: (params: { boothId: string; type: string }) => Promise<void>;
  confirmReserve: (params: { boothId: string; reserveId: string }) => Promise<boolean>;
  deleteReserve: (params: { boothId: string; reserveId: string }) => Promise<boolean>;
  restoreReserve: (params: { boothId: string; reserveId: string; reserveType: string }) => Promise<boolean>;
}

export const useReserveListStore = create<ReserveListStore>((set, get) => ({
  reserveList: {
    reserve: [],
    cancel: [],
    complete: [],
  },
  deleteReserveList: [],
  searchKeyword: '',

  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword });
  },

  setReserveList: ({ type, data }) => {
    set((state) => ({
      reserveList: {
        ...state.reserveList,
        [type]: data,
      },
    }));
  },

  getFilteredReserveList: (type) => {
    const { reserveList, searchKeyword } = get();
    if (!searchKeyword) return reserveList[type];
    return reserveList[type].filter((reserve) =>
      [reserve.userName, reserve.reservationNum, reserve.personCount, reserve.phoneNum]
        .map(String)
        .some((value) => value.includes(searchKeyword))
    );
  },

  getReserveList: async ({ boothId, type }: { boothId: string; type: string }) => {
    try {
      const response = await api.get(`/admin/reservation/${type}/booth/${boothId}`);
      const data = response.data;
      const list = data?.data?.reservationList ?? [];
      get().setReserveList({ type, data: list });
    } catch (error) {
      console.error(error);
      alertError(error);
      get().setReserveList({ type, data: [] });
    }
  },  

  confirmReserve: async ({ boothId, reserveId }) => {
    try {
      const response = await api.put('/admin/reservation/complete', {
        boothId,
        reservationId: reserveId,
      });
      return response.data?.success ?? false;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  },

  deleteReserve: async ({ boothId, reserveId }) => {
    try {
      const response = await api.delete('/admin/reservation', {
        data: {
          boothId,
          reservationId: reserveId,
        },
      });
      return response.data?.success ?? false;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  },

  restoreReserve: async ({ boothId, reserveId, reserveType }) => {
    try {
      const response = await api.put('/admin/reservation/restore', {
        boothId,
        reservationId: reserveId,
        reservationType: reserveType.toUpperCase(),
      });
      return response.data?.success ?? false;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  },
}));