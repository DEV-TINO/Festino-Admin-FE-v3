import { create } from 'zustand';
import { api } from '@/utils/api';
import type { WaitDepositOrder, FinishOrder, CookingMenu } from '@/types/orders/order.types';

interface NowOrderStore {
  waitDepositList: WaitDepositOrder[];
  cookingList: CookingMenu[];
  finishList: FinishOrder[];
  getNowOrderList: (params: { boothId: string; date: number }) => Promise<boolean>;
}

export const useNowOrderStore = create<NowOrderStore>((set) => ({
  waitDepositList: [],
  cookingList: [],
  finishList: [],

  getNowOrderList: async ({ boothId, date }) => {
    if (!boothId) return false;

    try {
      const res = await api.get(`/admin/booth/${boothId}/order/now/all/${date}`);
      console.log(res)

      if (res.data?.data) {
        const { waitDepositList, cookingList, finishList } = res.data.data;

        set({
          waitDepositList: waitDepositList ?? [],
          cookingList: cookingList ?? [],
          finishList: finishList ?? [],
        });

        return true;
      } else {
        set({
          waitDepositList: [],
          cookingList: [],
          finishList: [],
        });
        return false;
      }
    } catch (err) {
      console.error('getNowOrderList 실패', err);
      set({
        waitDepositList: [],
        cookingList: [],
        finishList: [],
      });
      return false;
    }
  },
}));