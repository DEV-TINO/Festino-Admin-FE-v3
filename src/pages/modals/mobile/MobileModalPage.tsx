import MobileMenuModal from '@/components/modals/mobile/MobileMenuModal';
import MobileModalWrapper from '@/components/modals/mobile/MobileModalWrapper';
import MobileTableCustomModal from '@/components/modals/mobile/MobileTableModal';
import LoadingModal from '@/components/modals/mobile/LoadingModal';
import { useBaseModal } from '@/stores/commons/baseModal';
import MobileReserveModal from '@/components/modals/mobile/MobileReserveModal';
import MobileMessageModal from '@/components/modals/mobile/MobileMessageModal';
import MobileCustomMessageModal from '@/components/modals/mobile/MobileCustomMessageModal';
import MobileConfirmModal from '@/components/modals/mobile/ConfirmModal';

const ModalPage: React.FC = () => {
  const { isMobileModalOpen, modalType } = useBaseModal();

  if (!isMobileModalOpen) return null;

  return (
    <>
      {isMobileModalOpen && (
        <MobileModalWrapper>
          {modalType === 'menuModal' && <MobileMenuModal />}
          {modalType === 'mobileConfirm' && <MobileConfirmModal />}
          {modalType === 'customTable' && <MobileTableCustomModal />}
          {modalType === 'mobileLoading' && <LoadingModal />}
          {modalType === 'mobileReserve' && <MobileReserveModal />}
          {modalType === 'mobileMessage' && <MobileMessageModal />}
          {modalType === 'mobileCustom' && <MobileCustomMessageModal />}
        </MobileModalWrapper>
      )}
    </>
  );
};

export default ModalPage;