import React from 'react';
import IconOrderDetail from '@/components/icons/IconOrderDetail';
import IconOrderCheck from '@/components/icons/IconOrderCheck';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { getHourandMinute } from '@/utils/utils';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';
import { api } from '@/utils/api';
import { Props } from '@/types/orders/order.types';

const TableOrderItem: React.FC<Props> = ({ tableOrder }) => {
  const { getCustomTableNum } = useTableDetail();
  const { openPopup } = useOrderPopup();
  const { boothId } = useTableStatusOrder();

    // 주문 디테일 API 요청
  const getDetailOrder = async (orderId: string) => {
    try {
      const res = await api.get(`/admin/booth/${boothId}/order/${orderId}`);
      if (res.data.success) return res.data.data;
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  
  // 주문 완료 여부 판단
  const isFinish = (tableOrder: { servedCount: number; totalCount: number }) => {
    return tableOrder.servedCount === tableOrder.totalCount;
  };

  const handleClickOrderDetail = async (orderId: string, orderType: string) => {
    const orderInfo = await getDetailOrder(orderId);
    if (orderInfo) {
      openPopup({
        type: 'detail',
        selectOrderInfo: {
          orderId: orderInfo.orderId,
          orderNum: orderInfo.orderNum,
          orderType,
          phoneNum: orderInfo.phoneNum,
          tableNum: orderInfo.tableNum,
          totalPrice: orderInfo.totalPrice,
          userName: orderInfo.userName,
          createAt: orderInfo.createAt,
        },
        selectMenuInfoList: orderInfo.menuList,
      });
    }
  };

  // 주문 완료 팝업
  const handleClickOrderFinish = async (
    tableOrder: { servedCount: number; totalCount: number },
    orderId: string,
    orderType: string
  ) => {
    if (!isFinish(tableOrder)) return;
    const orderInfo = await getDetailOrder(orderId);
    if (orderInfo) {
      openPopup({
        type: 'complete',
        selectOrderInfo: {
          orderId: orderInfo.orderId,
          orderNum: orderInfo.orderNum,
          orderType,
          phoneNum: orderInfo.phoneNum,
          tableNum: orderInfo.tableNum,
          totalPrice: orderInfo.totalPrice,
          userName: orderInfo.userName,
          createAt: orderInfo.createAt,
        },
        selectMenuInfoList: orderInfo.menuList,
      });
    }
  };

  return (
    <div className='w-full min-w-[238px] h-[124px] bg-white rounded-2xl p-[18px] flex justify-between font-bold'>
      <div className='flex flex-col justify-between'>
        <div>
          <div className='text-2xs text-primary-800-light-50 select-none'>
            테이블
          </div>
          <div className='text-xl text-primary-800-light-70 -translate-y-1 max-w-[130px] truncate select-none'>
            {getCustomTableNum(tableOrder.tableNum)}번
          </div>
        </div>
        <div>
          <div className='text-2xs text-primary-800-light-50 translate-y-1 select-none'>
            주문시간
          </div>
          <div className='text-xl text-primary-800-light-70'>
            {getHourandMinute(tableOrder?.createAt)}
          </div>
        </div>
      </div>

      <div className='grid grid-rows-3 text-secondary-700-light text-sm w-[100px]'>
        <div className='flex items-start justify-between'>
          <div>서빙현황</div>
          <div className='font-normal'>
            {tableOrder.servedCount}/{tableOrder.totalCount}
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div>주문내역</div>
          <IconOrderDetail
            className='justify-self-end -translate-x-[3px] cursor-pointer'
            onClick={() =>
              handleClickOrderDetail(
                tableOrder.orderId,
                tableOrder.orderType
              )
            }
          />
        </div>
          <div className='flex items-end justify-between'>
            <div>완료</div>
            <IconOrderCheck
              className={`justify-self-end ${
                !isFinish(tableOrder) ? 'cursor-not-allowed' : ''
              }`}
              isActive={isFinish(tableOrder)}
              onClick={() =>
                handleClickOrderFinish(
                  tableOrder,
                  tableOrder.orderId,
                  tableOrder.orderType
                )
              }
            />
        </div>
      </div>
    </div>
  )
};

export default TableOrderItem;