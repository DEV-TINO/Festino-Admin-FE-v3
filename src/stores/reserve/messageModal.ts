import { create } from 'zustand';
import { useBaseModal } from '../commons/baseModal';

export interface MessageInfo {
  reservationNum: number | string;
  userName: string;
  phoneNum: string;
  updatedAt: string;
}

interface MessageModalStore {
  messageInfo: MessageInfo | null;
  setMessageInfo: (info: MessageInfo) => void;
  openMessageModal: (info: MessageInfo) => void;
  openMessageCustomModal: () => void;
}

export const useMessageModalStore = create<MessageModalStore>((set) => ({
  messageInfo: null,

  setMessageInfo: (info) => {
    set({ messageInfo: info });
  },

  openMessageModal: (info) => {
    const baseModal = useBaseModal.getState();
    set({ messageInfo: info });
    baseModal.setModalType('messageModal');
    baseModal.openModal();
  },

  openMessageCustomModal: () => {
    const baseModal = useBaseModal.getState();
    baseModal.setModalType('messageCustomModal');
    baseModal.openModal();
  },
}));