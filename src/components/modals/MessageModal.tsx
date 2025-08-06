import React from 'react';
import { prettyDate } from '@/utils/utils';
import IconClose from '../icons/IconClose';
import { useMessageStore } from '@/stores/reserve/message';
import { useBaseModal } from '@/stores/commons/baseModal';
import { useMessageModalStore } from '@/stores/reserve/messageModal';

const MessageModal: React.FC = () => {
  const { messageInfo } = useMessageModalStore();
  const { message, setMessage, sendMessage } = useMessageStore();
  const { closeModal } = useBaseModal();

  if (!messageInfo || typeof messageInfo === 'string') return null;

  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (value.length > 45) {
      value = value.slice(0, 45);
    }

    setMessage(event.target.value);
  };

  const handleClickSendButton = () => {
    if (message.length === 0) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }
    sendMessage(message);
  };

  return (
    <div className="min-w-[565px] w-[600px] h-fit bg-white rounded-2xl p-8 flex flex-col justify-between">
      <div className="flex flex-col w-full gap-[28px]">
        {/* 제목 & 닫기 버튼 */}
        <div>
          <div className="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-xl text-primary-800 h-9">
            <div className="w-[25px]" />
            문자 커스텀
            <IconClose onClick={closeModal} className="w-8 h-8 p-2 cursor-pointer hover:bg-gray-100 rounded-2xl" />
          </div>
          <div className="text-secondary-700 font-medium text-center text-sm">
            보낼 메시지 내용을 45글자 이내로 입력해주세요.
          </div>
        </div>

        {/* 예약자 정보 */}
        <div className="w-full flex flex-col gap-4">
          <div className="text-secondary-700 text-sm ml-2">예약자 정보</div>
          <div className="relative w-full rounded-xl">
            <table className="w-full outline-primary-300 outline outline-1 rounded-xl">
              <thead className="text-secondary-500 bg-primary-800-light-3 h-[40px] text-xs">
                <tr className="bg-primary-800-light-8 text-sm">
                  <th className="rounded-tl-xl px-5">No.</th>
                  <th className="px-5">이름</th>
                  <th className="px-5">전화번호</th>
                  <th className="rounded-tr-xl px-5">예약 시간</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center h-[40px] text-sm text-secondary-700">
                  <td><span>{messageInfo.reservationNum}</span></td>
                  <td><span>{messageInfo.userName}</span></td>
                  <td><span>{messageInfo.phoneNum}</span></td>
                  <td>
                    <span>
                      {messageInfo.updatedAt
                        ? `${prettyDate(messageInfo.updatedAt)} 20:30`
                        : '-'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 메시지 입력 */}
        <div className="relative">
          <input
            type="text"
            placeholder="메시지 내용을 입력해주세요"
            onChange={handleInputMessage}
            value={message}
            maxLength={45}
            className="w-full h-[45px] border-1 border-secondary-150 rounded-xl px-[17px] font-medium focus:border-primary-800 focus:outline-none focus:border-1 pr-[80px] text-sm"
          />
          <div className="absolute bottom-3 right-5 text-secondary-500-light-70 text-sm">{message.length}/45</div>
        </div>

        {/* 버튼 */}
        <div className="w-full flex justify-end items-center text-xl gap-3">
          <button
            className="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-800 bg-white cursor-pointer select-none"
            onClick={() => closeModal()}
          >
            취소
          </button>
          <button
            className="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white bg-primary-800 cursor-pointer select-none"
            onClick={() => handleClickSendButton()}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;