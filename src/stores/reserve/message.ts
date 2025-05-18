import { create } from 'zustand';
import { alertError, api } from '@/utils/api';
import { useBaseModal } from '../commons/baseModal';
import { useMessageModalStore } from './messageModal';
import { useReserveModalStore } from './reserveModalStore';
import { useBoothDetail } from '../booths/boothDetail';

interface CustomMessage {
  message: string;
  messageType: number;
}

interface ReserveData {
  phoneNum: string;
  userName: string;
}

interface MessageStore {
  message: string;
  customMessageList: CustomMessage[];
  setMessage: (value: string) => void;
  getMessage: (boothId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  sendMobileMessage: (message: string, data: ReserveData) => Promise<void>;
  saveCustomMessage: (messages: CustomMessage[]) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
  message: '',
  customMessageList: [
    { message: '', messageType: 0 },
    { message: '', messageType: 1 },
    { message: '', messageType: 2 },
  ],

  setMessage: (value) => set({ message: value }),

  getMessage: async (boothId) => {
    const baseModal = useBaseModal.getState();

    try {
      const response = await api.get('/admin/message/all', {
        params: { boothId },
      });

      if (response.data.success) {
        const list = response.data.data.map(({ message, messageType }: CustomMessage) => ({
          message,
          messageType,
        }));
        set({ customMessageList: list });
      } else {
        set({
          customMessageList: [
            { message: '', messageType: 0 },
            { message: '', messageType: 1 },
            { message: '', messageType: 2 },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      alertError(error);
      baseModal.closeModal();
    }
  },

  sendMessage: async (message: string) => {
    const baseModal = useBaseModal.getState();
    const messageModal = useMessageModalStore.getState();
    const { boothInfo } = useBoothDetail.getState();

    baseModal.closeModal();

    if (!messageModal.messageInfo?.phoneNum || !messageModal.messageInfo.userName || !boothInfo.adminName) {
      return alert('메세지 전송에 실패했습니다.');
    }

    baseModal.setModalType('loadingModal');
    baseModal.openModal();

    try {
      const res = await api.post('/admin/message/send', {
        phoneNum: messageModal.messageInfo.phoneNum,
        userName: messageModal.messageInfo.userName,
        adminName: boothInfo.adminName,
        message
      });

      if(res.data === 'SEND_SUCCESS') {
        alert('메세지 전송에 성공했습니다.');
      } else {
        alert('메세지 전송에 실패했습니다. SEND_ERROR');
      }
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      baseModal.closeModal();
    }
  },

  sendMobileMessage: async (message, data) => {
    const { selectedBooth, closeMobilePopup, openLoadingModal } = useReserveModalStore.getState();

    if (!data.phoneNum || !data.userName || !selectedBooth?.adminName) {
      return alertError('메시지 전송에 실패했습니다.');
    }

    openLoadingModal();

    try {
      const response = await api.post('/admin/message/send', {
        phoneNum: data.phoneNum,
        userName: data.userName,
        adminName: selectedBooth.adminName,
        message,
      });

      if (response.data === 'SEND_SUCCESS') {
        alert('메시지 전송에 성공했습니다.');
      } else {
        alert('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    } finally {
      closeMobilePopup();
    }
  },

  saveCustomMessage: async (messages) => {
    const baseModal = useBaseModal.getState();
    const { boothInfo } = useBoothDetail.getState();

    try {
      const response = await api.post('/admin/message', {
        boothId: boothInfo?.boothId,
        customMessageList: messages,
      });

      if (response.data.success) {
        alert('메시지 수정에 성공했습니다.');
      } else {
        alert('메시지 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alertError(error);
    } finally {
      baseModal.closeModal();
    }
  },
}));