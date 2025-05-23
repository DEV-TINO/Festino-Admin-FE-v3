import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { api } from '@/utils/api';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { Cook, CookingMenu } from '@/types/orders/order.types';

const OrderCookingCard: React.FC<CookingMenu> = ({ menuId, menuName, tableCount, totalRemainCount, cookList }) => {
  const { boothId } = useTableStatusOrder();
  const { openPopup } = useOrderPopup();
  const { getCustomTableNum } = useTableDetail();

  const [localCookMap, setLocalCookMap] = useState<Record<string, number>>({});
  const patchDebounceMap = useRef<Record<string, (count: number) => void>>({});

  const getDetailOrder = async (orderId: string) => {
    try {
      const response = await api.get(`/admin/booth/${boothId}/order/${orderId}`);
      const data = response.data;
      return data.success ? data.data : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };  

  const getLocalServed = (cook: Cook) => {
    return localCookMap[cook.cookId] ?? cook.servedCount;
  };  

  const patchCookServeCount = async (cookId: string, servedCount: number) => {
    try {
      const response = await api.put(`/admin/booth/${boothId}/order/cook/count`, { cookId, servedCount });
      if (response.data.success) {
        const updatedCount = response.data.data.servedCount;

        setLocalCookMap((prev) => ({
          ...prev,
          [cookId]: updatedCount,
        }));
      }
    } catch (error) {
      console.error('[OrderCookingCard] patchCookServeCount', error);
    }
  };  

  const ensureDebounced = (cookId: string) => {
    if (!patchDebounceMap.current[cookId]) {
      patchDebounceMap.current[cookId] = _.debounce((count: number) => {
        patchCookServeCount(cookId, count);
      }, 200);
    }
    return patchDebounceMap.current[cookId];
  };

  const updateCookCount = (cook: Cook, next: number) => {
    setLocalCookMap((prev) => ({ ...prev, [cook.cookId]: next }));
    const debouncedFn = ensureDebounced(cook.cookId);
    debouncedFn(next);
  };

  const handleClickMenuPlus = (cook: Cook) => {
    const newValue = Math.min(getLocalServed(cook) + 1, cook.totalCount);
    updateCookCount(cook, newValue);
  };

  const handleClickMenuMinus = (cook: Cook) => {
    const newValue = Math.max(getLocalServed(cook) - 1, 0);
    updateCookCount(cook, newValue);
  };

  const handleInputServeCount = (cook: Cook, e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') value = '0';
    const parsed = parseInt(value, 10);
    if (parsed >= 0 && parsed <= cook.totalCount) {
      updateCookCount(cook, parsed);
    }
  };

  const isComplete = (cook: Cook) => getLocalServed(cook) === cook.totalCount;

  const handleClickMenuComplete = async (cook: Cook) => {
    if (!isComplete(cook)) return;
    const orderInfo = await getDetailOrder(cook.orderId);
    if (orderInfo) {
      openPopup({
        type: 'cooking',
        selectOrderInfo: {
          orderId: cook.orderId,
          orderNum: 0,
          orderType: 'COOKING',
          phoneNum: '',
          tableNum: cook.tableNum,
          totalPrice: 0,
          userName: '',
          createAt: orderInfo.createAt,
        },
        selectMenuInfoList: [],
        selectCookingInfo: {
          menuId,
          menuName,
          tableCount,
          totalRemainCount,
          cook,
          createAt: orderInfo.createAt,
        },
      });
    }
  };

  useEffect(() => {
    const initialMap = cookList.reduce((acc, cook) => {
      acc[cook.cookId] = cook.servedCount;
      return acc;
    }, {} as Record<string, number>);

    setLocalCookMap(initialMap);
  }, [cookList]);  

  return (
    <div className='w-full min-w-[350px] h-[400px] rounded-3xl flex flex-col justify-between outline outline-1 outline-primary-800-light-24 max-w-[350px] shrink-0'>
      <div className='flex justify-center w-full h-[65px] items-center rounded-t-3xl px-[28px] text-lg font-semibold bg-primary-800-light-8 border-b border-primary-200'>
        {menuName}
      </div>
      <div className={`relative h-[353px] w-full overflow-y-auto scrollbar-hide ${cookList.length < 6 ? 'overflow-y-hidden' : ''}`}>
        <table className='w-full bg-white relative'>
          <thead className='sticky top-0 bg-white z-10'>
            <tr className='h-[38px] border-b border-secondary-300 text-[13px] shadow-sm'>
              <th className='text-center align-middle pl-[28px] min-w-[70px] select-none'>테이블 번호</th>
              <th className='min-w-[30px] text-center align-middle'>수량</th>
              <th className='min-w-[120px] text-center align-middle'>조리 현황</th>
              <th className='min-w-[80px] text-center align-middle pr-[28px]'>완료</th>
            </tr>
          </thead>
          <tbody>
            {cookList.map((cook, cookIndex) => (
              <tr
                key={cookIndex}
                className='h-[40px] border-b border-primary-300 last:border-none hover:bg-slate-50 text-sm'
              >
                <td className='text-center align-middle pl-[28px] min-w-[70px] select-none'>
                  {getCustomTableNum(cook.tableNum)}번
                </td>
                <td className='min-w-[30px] text-center align-middle'>{cook.totalCount}개</td>
                <td className='min-w-[80px] text-center align-middle'>
                  <div className='w-full gap-[10px] flex justify-center items-center'>
                    <button
                      className={`select-none is-button w-5 h-5 font-normal flex items-center justify-center text-center leading-none ${
                        getLocalServed(cook) === 0 ? 'cursor-not-allowed bg-gray-400' : ''
                      }`}
                      onClick={() => handleClickMenuMinus(cook)}
                    >
                      -
                    </button>
                    <input
                      type='text'
                      className='is-button font-normal is-outlined w-[50px] h-[25px] text-center text-black text-sm select-none'
                      value={getLocalServed(cook)}
                      onChange={(e) => handleInputServeCount(cook, e)}
                    />
                    <button
                      className={`select-none is-button w-5 h-5 font-normal flex items-center justify-center text-center leading-none ${
                        getLocalServed(cook) === cook.totalCount ? 'cursor-not-allowed bg-gray-400' : ''
                      }`}
                      onClick={() => handleClickMenuPlus(cook)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className='min-w-[80px] text-center align-middle pr-[28px] select-none'>
                  <button
                    className={`is-button w-[50px] h-[23px] rounded-full font-normal text-sm ${
                      !isComplete(cook) ? 'bg-gray-400 text-white' : ''
                    }`}
                    onClick={() => handleClickMenuComplete(cook)}
                  >
                    완료
                  </button>
                </td>
              </tr>
            ))}
            {cookList.length < 6 &&
              Array.from({ length: 6 - cookList.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={4} className='h-[57px]' />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between items-center h-[65px] w-full rounded-b-3xl px-[28px] bg-primary-800-light-8 text-secondary-700-light select-none'>
        <div className='text-lg select-none'>현재 주문 테이블: <b>{tableCount}</b></div>
        <div className='text-lg select-none'>남은 주문 수량: <b>{totalRemainCount}</b></div>
      </div>
    </div>
  );
};

export default OrderCookingCard;