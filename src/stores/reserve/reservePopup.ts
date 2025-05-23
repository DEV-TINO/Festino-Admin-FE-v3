import { create } from 'zustand';
import { useBaseModal } from '../commons/baseModal';
import { useBoothList } from '../booths/boothList';
import { Booth } from '@/types/booths/booth.types';

interface ReservationInfo {
  [key: string]: any;
}

type CallbackFn = (payload?: any) => void | Promise<void>;

interface ReservePopupStore {
  boothInfo: Booth | undefined;
  reservationInfo: ReservationInfo | null;
  popupType: string;
  handleSubmit: CallbackFn;
  setReservationInfo: (reservation: ReservationInfo) => void;
  openBoothReservePopup: (params: { booth: Booth | undefined; callback: CallbackFn }) => void | undefined;
  submitBoothReservePopup: () => Promise<void>;
  openPopup: (params: { reserveInfo: ReservationInfo; type: string; callback: CallbackFn }) => void;
  submitPopup: () => Promise<void>;
  closePopup: () => void;
}

export const useReservePopupStore = create<ReservePopupStore>((set, get) => ({
  boothInfo: undefined,
  reservationInfo: null,
  popupType: '',
  handleSubmit: async () => {},

  setReservationInfo: (reservation) => {
    set({ reservationInfo: reservation });
  },

  openBoothReservePopup: ({ booth, callback }) => {
    const baseModal = useBaseModal.getState();

    set({
      boothInfo: booth,
      handleSubmit: callback,
      popupType: 'booth',
    });
    baseModal.setModalType('reservePopup');
    baseModal.openModal();
  },

  submitBoothReservePopup: async () => {
    const { boothInfo, handleSubmit } = get();
    const baseModal = useBaseModal.getState();
    const boothListStore = useBoothList.getState();

    if (!boothInfo) return;

    baseModal.setModalType('loadingModal');

    await boothListStore.updateBoothReservation({
      boothId: boothInfo.boothId,
      adminCategory: boothInfo.adminCategory,
      isReservation: boothInfo.isReservation,
    });

    handleSubmit({
      ...boothInfo,
      isReservation: !boothInfo.isReservation,
    });

    baseModal.closeModal();
  },

  openPopup: ({ reserveInfo, type, callback }) => {
    const baseModal = useBaseModal.getState();
    set({
      reservationInfo: reserveInfo,
      handleSubmit: callback,
      popupType: type,
    });
    baseModal.setModalType('reservePopup');
    baseModal.openModal();
  },

  submitPopup: async () => {
    const { handleSubmit } = get();
    const baseModal = useBaseModal.getState();

    baseModal.setModalType('loadingModal');
    try {
      await handleSubmit();
    } finally {
      baseModal.closeModal();
    }
  },

  closePopup: () => {
    const baseModal = useBaseModal.getState();
    baseModal.closeModal();
  },
}));