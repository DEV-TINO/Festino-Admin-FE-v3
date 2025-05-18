import MobileMenuModal from '@/components/modals/mobile/MobileMenuModal';
import MobileModalWrapper from '@/components/modals/mobile/MobileModalWrapper';
import { useBaseModal } from '@/stores/commons/baseModal';

const ModalPage: React.FC = () => {
  const { isMobileModalOpen, modalType } = useBaseModal();

  if (!isMobileModalOpen) return null;

  return (
    <>
      {isMobileModalOpen && (
        <MobileModalWrapper>
          {modalType === 'menuModal' && <MobileMenuModal />}
        </MobileModalWrapper>
      )}
    </>
  );
};

export default ModalPage;