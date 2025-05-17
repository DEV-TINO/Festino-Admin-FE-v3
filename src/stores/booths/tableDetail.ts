import { create } from 'zustand';
import { api, alertError } from '@/utils/api';
import { TableDetailState } from '@/types/booths/booth.types';
import { useBaseModal } from '../commons/baseModal';

export const useTableDetail = create<TableDetailState>()((set, get) => ({
  tableNumList: [],
  tableNum: 0,

  openTableDetailModal: () => {
    const baseModal = useBaseModal.getState();
    baseModal.openModal();
    baseModal.setModalType('tableModal');
  },

  closeTableDetailModal: () => {
    const baseModal = useBaseModal.getState();
    baseModal.closeModal();
  },

  getTableList: async (boothId: string) => {
    try {
      const res = await api.get(`/admin/order/table/booth/${boothId}`);
      if (res.data.success) {
        set({
          tableNumList: res.data.data,
          tableNum: res.data.data.length,
        });
      } else {
        alertError(res.data.message);
      }
    } catch (error) {
      alertError(error);
    }
  },

  submitTableDetail: async (boothId: string) => {
    try {
      const { tableNumList } = get();
      const res = await api.post('/admin/order/table', {
        boothId,
        tableNumList: tableNumList.map(({ tableNumIndex, customTableNum }) => ({
          tableNumIndex,
          customTableNum,
        })),
      });

      if (res.data.success) {
        return true;
      } else {
        alertError(res.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    }
  },

  getCustomTableNum: (tableNum: number) => {
    const { tableNumList } = get();
    return (
      tableNumList.find((table) => table.tableNumIndex === tableNum)?.customTableNum ?? tableNum
    );
  },

  setTableNum: (num: number) => {
    set({ tableNum: num });
  },
  
  setTableNumList: (list: TableDetailState['tableNumList']) => {
    set({ tableNumList: list });
  },
}));
