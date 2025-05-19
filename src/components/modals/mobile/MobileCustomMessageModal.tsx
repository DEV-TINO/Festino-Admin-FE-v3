import React, { useEffect, useState } from 'react';
import { useMessageStore } from '@/stores/reserve/message';
import { useReserveModalStore } from '@/stores/reserve/reserveModalStore';
import _ from 'lodash';

const MAX_MESSAGE_LENGTH = 35;

export const MobileCustomMessageModal: React.FC = () => {
  const messageStore = useMessageStore();
  const reserveModalStore = useReserveModalStore();

  const { saveCustomMessage, customMessageList } = messageStore;
  const { closeMobilePopup } = reserveModalStore;

  const [messageList, setMessageList] = useState(
    _.cloneDeep(customMessageList)
  );

  useEffect(() => {
    setMessageList(_.cloneDeep(customMessageList));
  }, [customMessageList]);

  const handleInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>, type: number) => {
    const newMessage = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    const updatedList = [...messageList];
    updatedList[type].message = newMessage;
    setMessageList(updatedList);
  };

  const handleClickSave = async () => {
    if (messageList.some((msg) => msg.message.trim().length === 0)) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }
    await saveCustomMessage(messageList);
    closeMobilePopup();
  };

  const handleClickCancel = () => {
    closeMobilePopup();
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
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="font-bold text-xl text-secondary-800">문자 커스텀</div>
        <div className="w-full text-sm text-center">
          <p>
            메세지 앞에 <span className="text-danger-800 font-bold">ㅇㅇㅇ님</span>이 고정으로 붙습니다.
            <br />보낼 메세지 내용을 {MAX_MESSAGE_LENGTH}자 이내로 작성해주세요.
          </p>
        </div>
        <div className="relative w-full flex flex-col gap-2">
          {['예약 완료', '입장 완료', '예약 취소'].map((label, idx) => (
            <div key={idx} className="flex flex-col gap-2 relative">
              <div>{label}</div>
              <textarea
                placeholder={
                  idx === 0
                    ? 'ㅇㅇㅇ학과 예약이 완료되었습니다.'
                    : idx === 1
                    ? 'ㅇㅇㅇ학과에서 즐거운 시간 보내시기 바랍니다.'
                    : 'ㅇㅇㅇ학과 예약이 취소 되었습니다.'
                }
                onChange={(e) => handleInputMessage(e, idx)}
                value={messageList[idx]?.message || ''}
                maxLength={MAX_MESSAGE_LENGTH}
                className="text-sm w-full resize-none border border-primary-800-light-16 p-4 h-24 rounded-2xl"
              />
              <div className="absolute bottom-4 right-5 text-secondary-500-light-70">
                {messageList[idx]?.message?.length || 0}/{MAX_MESSAGE_LENGTH}
              </div>
            </div>
          ))}
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
          수정
        </div>
      </div>
    </div>
  );
};

export default MobileCustomMessageModal;