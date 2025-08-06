import { create } from 'zustand';
import { api, alertError } from '@/utils/api';
import { ADMIN_CATEGORY } from '@/constants/constant';
import { BoothListState } from '@/types/booths/booth.types';
import { useNavigate } from 'react-router-dom';

export const useBoothList = create<BoothListState>((set, get) => {
  const navigate = useNavigate();

  return {
  boothList: [],

  getAllBoothList: async () => {
    try {
      const [nightResponse, dayResponse, foodResponse] = await Promise.all([
        api.get('/admin/booth/night/all'),
        api.get('/admin/booth/day/all'),
        api.get('/admin/booth/food/all'),
      ]);
      const nightData = nightResponse.data;
      const dayData = dayResponse.data;
      const foodData = foodResponse.data;
  
      if (nightData.success && dayData.success && foodData.success) {
        const combined = [...nightData.data, ...dayData.data, ...foodData.data];
        set({ boothList: combined });
        return combined;
      } else {
        alertError(`${nightData.message}, ${dayData.message}, ${foodData.message}`);
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  },  

  setBoothList: (boothList) => {
    boothList = boothList;
  },

  handleClickBoothDetail: (boothId: string) => {
    navigate(`/booth/${boothId}`);
  },

  updateBoothOpen: async ({ boothId, isOpen, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/open`, {
        boothId,
        isOpen,
      });
      if (response.data.success) {
        await get().getAllBoothList();
      } else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },

  updateBoothOrder: async ({ boothId, isOrder, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/order`, {
        boothId,
        isOrder,
      });
      if (response.data.success) {
        await get().getAllBoothList();
      } else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },

  updateBoothReservation: async ({ boothId, isReservation, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/reservation`, {
        boothId,
        isReservation,
      });
      if (response.data.success) {
        await get().getAllBoothList();
      } else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },

  updateBoothCall: async ({ boothId, isCall, adminCategory }) => {
    try {
      const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[adminCategory]}/call`, {
        boothId,
        isCall,
      });
      if (response.data.success) {
        await get().getAllBoothList();
      } else {
        alertError(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
});
