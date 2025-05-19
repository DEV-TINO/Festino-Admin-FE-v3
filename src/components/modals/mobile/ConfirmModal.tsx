import { useEffect, useMemo, useState } from 'react';
import IconBoothInfo from '../../icons/IconBoothInfo';
import { useReserveModalStore } from '@/stores/reserve/reserveModalStore';
import { useReserveListStore } from '@/stores/reserve/reserveList';
import { BOOTH_POPUP_INFO } from '@/constants/constant';

const MobileConfirmModal = () => {
  const {
    confirmReserve,
    deleteReserve,
    restoreReserve,
    getReserveList,
  } = useReserveListStore();

  const {
    closeMobilePopup,
    openLoadingModal,
    reserveData,
    confirmType,
    popupType,
    selectedBooth,
  } = useReserveModalStore();

  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    if (!selectedBooth?.boothId || !reserveData?.reservationId) {
      setLoading(true);
      return;
    }
    setLoading(true);

    if (confirmType === 'confirm') {
      await confirmReserve({ boothId: selectedBooth.boothId, reserveId: reserveData.reservationId });
    } else if (confirmType === 'cancel') {
      await deleteReserve({ boothId: selectedBooth.boothId, reserveId: reserveData.reservationId });
    } else if (confirmType === 'restore') {
      await restoreReserve({
        boothId: selectedBooth.boothId,
        reserveId: reserveData.reservationId,
        reserveType: popupType,
      });
      await getReserveList({ boothId: selectedBooth.boothId, type: 'reserve' });
    }

    await getReserveList({ boothId: selectedBooth.boothId, type: popupType });
    closeMobilePopup();
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      openLoadingModal();
    }
  }, [loading, openLoadingModal]);

  useEffect(() => {
    if (confirmType && confirmType in BOOTH_POPUP_INFO) {
      const popup = BOOTH_POPUP_INFO[confirmType as keyof typeof BOOTH_POPUP_INFO];
      if (typeof popup === 'object' && 'title' in popup && 'subTitle' in popup) {
        setTitle(popup.title);
        setSubTitle(popup.subTitle);
      } else {
        setTitle('');
        setSubTitle('');
      }
    } else {
      setTitle('');
      setSubTitle('');
    }
  }, [confirmType]);

  const iconType = useMemo(() => (confirmType === 'cancel' ? 'danger' : 'info'), [confirmType]);

  return (
    <div className="w-[380px] min-w-[325px] bg-white rounded-3xl flex flex-col items-center px-10 py-8 gap-5">
      <IconBoothInfo type={iconType} />
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="font-bold text-xl text-secondary-800">{title}</div>
        <div className="text-secondary-700 text-center whitespace-pre-wrap">
          <div>{subTitle}</div>
        </div>
      </div>
      <div className="mt-2 flex gap-5 font-semibold text-xl w-full">
        <div
          className="flex items-center justify-center w-full h-12 border-2 border-primary-800 rounded-3xl text-primary-800 cursor-pointer"
          onClick={closeMobilePopup}
        >
          취소
        </div>
        <div
          onClick={confirm}
          className="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-800 text-white cursor-pointer"
        >
          확인
        </div>
      </div>
    </div>
  );
};

export default MobileConfirmModal;