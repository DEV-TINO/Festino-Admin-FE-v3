import { create } from 'zustand';
import { useBoothList } from './boothList';
import { alertError } from '@/utils/api';
import { Booth } from '@/types/booths/booth.types';
import { useBaseModal } from '../commons/baseModal';

type BoothPopupType = 'open' | 'order' | 'reservation' | '';

interface BoothPopupState {
  boothInfo: Partial<Booth>;
  selectedType: BoothPopupType;
  setBoothInfo: (booth: Partial<Booth>) => void;
  setSelectedType: (type: BoothPopupType) => void;
  openPopup: (params: { type: BoothPopupType; boothInfo: Partial<Booth> }) => void;
  submitPopup: () => void;
  closePopup: () => void;
}

export const useBoothPopup = create<BoothPopupState>((set, get) => ({
  boothInfo: {},
  selectedType: '',

  setBoothInfo: (booth) => set({ boothInfo: booth }),

  setSelectedType: (type) => set({ selectedType: type }),

  openPopup: ({ type, boothInfo }) => {
    const baseModal = useBaseModal.getState();
    get().setSelectedType(type);
    get().setBoothInfo(boothInfo);
    baseModal.setModalType('boothPopup');
    baseModal.openModal();
  },

  submitPopup: () => {
    const { boothInfo, selectedType } = get();
    const baseModal = useBaseModal.getState();
    const boothList = useBoothList.getState();

    baseModal.closeModal();

    switch (selectedType) {
      case 'open':
        boothList.updateBoothOpen({
          boothId: boothInfo.boothId!,
          isOpen: boothInfo.isOpen!,
          adminCategory: boothInfo.adminCategory!,
        });
        break;
      case 'order':
        boothList.updateBoothOrder({
          boothId: boothInfo.boothId!,
          isOrder: boothInfo.isOrder!,
          adminCategory: boothInfo.adminCategory!,
        });
        break;
      case 'reservation':
        boothList.updateBoothReservation({
          boothId: boothInfo.boothId!,
          isReservation: boothInfo.isReservation!,
          adminCategory: boothInfo.adminCategory!,
        });
        break;
      default:
        alertError('[Close Popup] 잘못된 타입입니다.');
    }
  },

  closePopup: () => {
    const baseModal = useBaseModal.getState();
    baseModal.closeModal();
  },
}));