import React, { useEffect, useRef, useState } from 'react';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { getHourandMinute, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconClock from '@/components/icons/IconClock';
import IconOrderCheck from '@/components/icons/IconOrderCheck';
import { ORDER_STATUS } from '@/constants/constant';

const OrderPopup: React.FC = () => {
  const {
    selectType,
    menuInfoList,
    orderInfo,
    cookingInfo,
    note,
    submitPopup,
    closePopup,
    getNote,
  } = useOrderPopup();
  const { getCustomTableNum } = useTableDetail();

  const [isSubmit, setIsSubmit] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitType = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value');
    if (isSubmit || !submitType) return;
    setIsSubmit(true);
    await submitPopup({ type: submitType });
    setIsSubmit(false);
    closePopup();
  };

  useEffect(() => {
    submitRef.current?.focus();
    getNote();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-[600px] min-h-[350px] bg-white shadow-primary rounded-2xl flex flex-col justify-between gap-[20px] px-[40px] py-[32px]">
        {/* Header */}
        <div className="flex w-full items-center justify-center text-primary-800 text-xl font-semibold relative">
          {ORDER_STATUS[selectType] ?? ORDER_STATUS.ready}
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center absolute right-0"
            onClick={closePopup}
          >
            <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none">
              <path stroke="currentColor" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
            </svg>
          </button>
        </div>

        {/* Cooking Info */}
        {selectType === 'cooking' && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="text-secondary-700">조리 완료 확인</div>
            <div className="flex items-center gap-2 text-xs text-secondary-700">
              <IconClock className="w-4 h-4" />
              <span>{getHourandMinute(cookingInfo.createAt)}</span>
            </div>
            <div className="rounded-2xl border border-primary-800-light-24 shadow-primary text-xs">
              <table className="w-full">
                <thead className="bg-primary-200 text-secondary-500 h-[50px]">
                  <tr>
                    <th className="rounded-tl-2xl">테이블 번호</th>
                    <th>메뉴</th>
                    <th>수량</th>
                    <th className="rounded-tr-2xl">조리현황</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center h-[50px]">
                    <td>{getCustomTableNum(cookingInfo.cook.tableNum)}번</td>
                    <td>{cookingInfo.menuName}</td>
                    <td>{cookingInfo.cook.servedCount}개</td>
                    <td>{cookingInfo.cook.totalCount}개</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Info */}
        {selectType !== 'cooking' && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="text-secondary-700">예약자 정보</div>
            <div className="flex items-center gap-2 text-xs text-secondary-700">
              <IconClock className="w-4 h-4" />
              <span>{getHourandMinute(orderInfo.createAt)}</span>
              {selectType === 'finish' && (
                <>
                  <IconOrderCheck className="ml-2 w-4 h-4" />
                  <span>{getHourandMinute(orderInfo.finishAt)}</span>
                </>
              )}
            </div>
            <div className="rounded-2xl outline outline-primary-800-light-16 outline-1">
              <table className="w-full text-xs">
                <thead className="bg-primary-200 text-secondary-500 h-[50px] font-semibold">
                  <tr>
                    <th className="rounded-tl-2xl pl-2">No.</th>
                    <th>테이블 번호</th>
                    <th>입금자명</th>
                    <th>전화번호</th>
                    <th className="rounded-tr-2xl pr-2">가격</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center h-[50px]">
                    <td className="pl-2">{orderInfo.orderNum}</td>
                    <td>{getCustomTableNum(orderInfo.tableNum)}번</td>
                    <td>{orderInfo.userName}</td>
                    <td>{prettyPhoneNumber(orderInfo.phoneNum)}</td>
                    <td className="pr-2">{prettyPrice(orderInfo.totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Menu List */}
        {selectType !== 'cooking' && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="text-secondary-700">상세 메뉴</div>
            <div className="overflow-y-scroll max-h-[225px] rounded-2xl outline outline-1 outline-primary-800-light-16 scrollbar-hide" id="menuContainer">
              <table className="w-full table-fixed text-xs">
                <thead className="sticky top-0 bg-primary-200 text-secondary-500 h-[50px]">
                  <tr>
                    <th className="pl-[26px] text-left rounded-tl-2xl">메뉴</th>
                    <th className="w-[50px] text-center">수량</th>
                    <th className="w-[100px] pr-2 rounded-tr-2xl">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {menuInfoList.map((menu, i) => (
                    <tr key={i} className="text-center h-[50px]">
                      <td className="pl-[26px] text-left">{menu.menuName}</td>
                      <td>{prettyMenuNum(menu.menuCount)}</td>
                      <td className="pr-2">{prettyPrice(menu.menuPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Note */}
        {note && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="text-secondary-700">메모</div>
            <div className="w-full h-24 border border-primary-800-light-24 rounded-2xl p-4 text-secondary-700">{note}</div>
          </div>
        )}

        {/* Button Group */}
        <div className="flex justify-between items-end gap-[20px] pt-3">
          {selectType === 'ready' && (
            <>
              <button type="submit" className="is-button is-outlined w-1/2 h-[35px] rounded-2xl text-sm font-semibold" value="cancel">
                주문 취소
              </button>
              <button type="submit" className="is-button w-1/2 h-[35px] rounded-2xl text-sm font-semibold text-white bg-primary-800" value="deposit" ref={submitRef}>
                입금 확인
              </button>
            </>
          )}
          {selectType === 'finish' && (
            <button type="submit" className="is-button w-full h-[35px] rounded-2xl text-sm font-semibold text-white bg-primary-800" value="restore" ref={submitRef}>
              주문 복구
            </button>
          )}
          {(selectType === 'complete' || selectType === 'cooking') && (
            <button type="submit" className="is-button w-full h-[35px] rounded-2xl text-sm font-semibold text-white bg-primary-800" value="complete" ref={submitRef}>
              조리 완료
            </button>
          )}
          {selectType === 'cancel' && (
            <button type="submit" className="is-button w-full h-[35px] rounded-2xl text-sm font-semibold text-white bg-primary-800" value="cancel" ref={submitRef}>
              주문 취소 복구
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default OrderPopup;