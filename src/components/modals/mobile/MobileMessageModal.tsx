import React, { useMemo } from 'react';
import { useMessageStore } from '@/stores/reserve/message';
import { useReserveModalStore } from '@/stores/reserve/reserveModalStore';
import { ReserveData } from '@/stores/reserve/message';

const MAX_MESSAGE_LENGTH = 45;

const MobileMessageModal: React.FC = () => {
  const {
    message,
    setMessage,
    sendMobileMessage
  } = useMessageStore();

  const {
    reserveData,
    closeMobilePopup
  } = useReserveModalStore();

  const messageLength = useMemo(() => message?.length ?? 0, [message]);

  const getMobileNum = (num: string) => {
    if(num) {
      return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
    }
  };

  const handleInputMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setMessage(value);
  };

  const handleClickSendButton = () => {
    if (!message || message.length === 0) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }

    const reserveDataForSend: ReserveData = {
      phoneNum: reserveData?.phoneNum,
      userName: reserveData?.userName,
    };

    sendMobileMessage(message, reserveDataForSend);
  };

  const handleClickSave = () => {
    handleClickSendButton();
  };

  const handleClickCancel = () => {
    closeMobilePopup();
  };

  return (
    <div className="w-[380px] min-w-[325px] bg-white rounded-3xl flex flex-col items-center px-10 py-8">
      <div className="flex w-full justify-end">
        <svg onClick={closeMobilePopup} className="w-3 h-3 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <div className="font-bold text-xl text-secondary-700">문자 커스텀</div>
        <div className="w-full">
          <div className="p-1">예약자 정보</div>
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

        <div className="relative w-full">
          <div className="p-1">커스텀 메세지</div>
          <textarea
            placeholder="메세지 내용을 입력해주세요"
            onChange={handleInputMessage}
            value={message}
            maxLength={MAX_MESSAGE_LENGTH}
            className="text-sm w-full resize-none border border-primary-800-light-16 p-4 h-24 rounded-2xl"
          ></textarea>
          <div className="absolute bottom-4 right-5 text-sm text-secondary-500">
            {messageLength}/{MAX_MESSAGE_LENGTH}
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-5 font-semibold text-xl w-full pt-2">
        <div
          onClick={handleClickCancel}
          className="flex items-center justify-center w-full h-12 border-2 border-primary-800 rounded-3xl text-primary-800 cursor-pointer"
        >
          취소
        </div>
        <div
          onClick={handleClickSave}
          className="flex items-center justify-center w-full h-12 rounded-3xl bg-primary-800 text-white cursor-pointer"
        >
          전송
        </div>
      </div>
    </div>
  );
};

export default MobileMessageModal;