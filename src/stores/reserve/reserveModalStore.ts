import { create } from 'zustand';
import { useBaseModal } from '../commons/baseModal';

interface ReserveModalData {
  [key: string]: any;
}

interface SelectedBooth {
  boothId?: string;
  [key: string]: any;
}

interface ReserveModalState {
  popupType: string;
  confirmType: string;
  reserveData: ReserveModalData | null;
  selectedBooth: SelectedBooth;
  setSelectedBooth: (booth: SelectedBooth) => void;

  openReservePopup: (type: string, data: ReserveModalData) => void;
  openMessagePopup: (data: ReserveModalData) => void;
  openCustomMessagePopup: () => void;
  openConfirmPopup: (type: string) => void;
  openLoadingModal: () => void;
  closeMobilePopup: () => void;
}

export const useReserveModalStore = create<ReserveModalState>((set) => {
  const baseModal = useBaseModal.getState();
  
  return {
    popupType: '',
    confirmType: '',
    reserveData: null,
    selectedBooth: {},
  
    setSelectedBooth: (booth) => set({ selectedBooth: booth }),
  
    openReservePopup: (type, data) => {
      set({
        reserveData: data,
        popupType: type,
      });
      baseModal.setModalType('mobileReserve');
      baseModal.openMobileModal();
    },
  
    openMessagePopup: (data) => {
      set({ reserveData: data });
      baseModal.setModalType('mobileMessage');
      baseModal.openMobileModal();
    },
  
    openCustomMessagePopup: () => {
      baseModal.setModalType('mobileCustom');
      baseModal.openMobileModal();
    },
  
    openConfirmPopup: (type) => {
      set({ confirmType: type });
      baseModal.setModalType('mobileConfirm');
      baseModal.openMobileModal();
    },
  
    openLoadingModal: () => {
      baseModal.setModalType('mobileLoading');
      baseModal.openMobileModal();
    },
  
    closeMobilePopup: () => {
      baseModal.closeMobileModal();
    },
  };
})