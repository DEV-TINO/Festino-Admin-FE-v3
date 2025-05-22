import { create } from "zustand";
import { useBaseModal } from "../commons/baseModal";
import { api } from "@/utils/api";
import { TableVisualizationStore } from "@/types/modals/modal.types";

export const useTableVisualizationDetail = create<TableVisualizationStore>((set) => {
  const baseModal = useBaseModal.getState();

  return {
    tableList: [],
    tableOrderList: [],
    selectedTableNumIndex: null,

    getAllTableVisualization: async ({ boothId, date }) => {
      try {
        const response = await api.get(`/admin/booth/${boothId}/order/visualization/${date}`);
        set({ tableList: response.data.success ? response.data.data : [] });
      } catch {
        set({ tableList: [] });
      }
    },

    getAllOrderByTableNum: async ({ boothId, tableNum }) => {
      try {
        const response = await api.get(`/admin/booth/${boothId}/order/all/table/${tableNum}`);
        set({ tableOrderList: response.data.success ? response.data.data : [] });
      } catch {
        set({ tableOrderList: [] });
      }
    },

    updateTablePriority: async (boothId: string, tableNumPriorityList: { tableNumIndex: number, tablePriority: number }[]) => {
      try {
        const response = await api.put('/admin/order/table/priority', {
          boothId,
          tableNumPriorityList,
        });
        return response.data.success;
      } catch (error) {
        console.error('테이블 우선순위 업데이트 실패', error);
        return false;
      }
    },

    openTableVisualDetail: ({ tableNumIndex }) => {
      set({ selectedTableNumIndex: tableNumIndex });
      baseModal.setModalType('tableVisualizationModal');
      baseModal.openModal();
    },

    closeTableVisualDetail: () => {
      baseModal.closeModal();
    },

    initSelectedTableNum: () => {
      set({ selectedTableNumIndex: null })
    }
  };
});