import React from 'react';
import IconBoothInfo from '@/components/icons/IconBoothInfo';
import { useReserveModalStore } from '@/stores/reserve/reserveModalStore';

const MobileReserveModal: React.FC = () => {
  const {
    closeMobilePopup,
    openConfirmPopup,
    reserveData,
    popupType,
  } = useReserveModalStore();

  const getMobileNum = (num: string) => {
    if (num.length !== 11) return num;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
  };

  const clickCancel = () => {
    closeMobilePopup();
    openConfirmPopup('cancel');
  };

  const clickComplete = () => {
    openConfirmPopup('confirm');
  };

  const clickReserve = () => {
    closeMobilePopup();
    openConfirmPopup('restore');
  };

  return (
    <div className="w-[380px] min-w-[325px] bg-white rounded-3xl flex flex-col items-center px-10 py-8">
      <div className="flex w-full justify-end">
        <svg
          onClick={closeMobilePopup}
          className="w-3 h-3 cursor-pointer"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </div>
      <IconBoothInfo type="info" />
      <div className="flex flex-col items-center gap-4 w-full pt-5">
        <div className="font-bold text-xl text-secondary-700">예약 관리</div>
        <div className="flex w-full rounded-2xl text-sm border border-primary-800-light-16">
          <div className="flex flex-col rounded-l-2xl bg-primary-200 border-r border-primary-800-light-16">
            <div className="py-2.5 px-5 border-b border-primary-800-light-16">No.</div>
            <div className="py-2.5 px-5 border-b border-primary-800-light-16">입금자명</div>
            <div className="py-2.5 px-5">전화번호</div>
          </div>
          <div className="flex flex-col grow">
            <div className="py-2.5 px-5 border-b border-primary-800-light-16">{reserveData?.reservationNum}</div>
            <div className="py-2.5 px-5 border-b border-primary-800-light-16">{reserveData?.userName}</div>
            <div className="py-2.5 px-5">{getMobileNum(reserveData?.phoneNum)}</div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-5 font-semibold text-xl w-full pt-5">
        {popupType !== 'complete' && (
          <div
            onClick={clickComplete}
            className="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-800 text-white cursor-pointer"
          >
            입장
          </div>
        )}
        {popupType !== 'cancel' && (
          <div
            onClick={clickCancel}
            className="flex items-center justify-center w-full h-12 border-2 border-danger-800 rounded-3xl text-danger-800 cursor-pointer"
          >
            취소
          </div>
        )}
        {popupType !== 'reserve' && (
          <div
            onClick={clickReserve}
            className="flex items-center justify-center w-full h-12 border-2 border-primary-800 rounded-3xl text-primary-800 cursor-pointer"
          >
            예약
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileReserveModal;