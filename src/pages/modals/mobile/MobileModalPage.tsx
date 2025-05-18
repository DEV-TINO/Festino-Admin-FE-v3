import MobileMenuModal from '@/components/modals/mobile/MobileMenuModal';
import MobileModalWrapper from '@/components/modals/mobile/MobileModalWrapper';
import MobileTableCustomModal from '@/components/modals/mobile/MobileTableModal';
import { useBaseModal } from '@/stores/commons/baseModal';

const ModalPage: React.FC = () => {
  const { isMobileModalOpen, modalType } = useBaseModal();

  if (!isMobileModalOpen) return null;

  return (
    <>
      {isMobileModalOpen && (
        <MobileModalWrapper>
          {modalType === 'menuModal' && <MobileMenuModal />}
          {modalType === 'customTable' && <MobileTableCustomModal />}
        </MobileModalWrapper>
      )}
    </>
  );
};

export default ModalPage;