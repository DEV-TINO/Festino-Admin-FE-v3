import React from 'react';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { getHourandMinute, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import IconClock from '../icons/IconClock';
import { OrderCancelCardProps } from '@/types/orders/order.types';

const OrderCancelCard: React.FC<OrderCancelCardProps> = (props) => {
  const { openPopup } = useOrderPopup();
  const { getCustomTableNum } = useTableDetail();

  const handleClickCancelRestore = () => {
    openPopup({
      type: 'cancel',
      selectOrderInfo: {
        orderId: props.orderId,
        orderNum: props.orderNum,
        orderType: 'CANCEL',
        phoneNum: props.phoneNum,
        tableNum: props.tableNum,
        totalPrice: props.totalPrice,
        userName: props.userName,
        createAt: props.createAt,
      },
      selectMenuInfoList: props.menuList,
    });
  };

  return (
    <div className="w-full min-w-[350px] h-[400px] flex flex-col justify-between outline outline-1 outline-secondary-500 rounded-3xl max-w-[350px]">
      <div className="flex justify-between w-full h-[73px] items-center rounded-t-3xl border-b border-secondary-150 px-[21px] text-sm font-semibold bg-secondary-200 flex-wrap gap-x-1">
        <div>No.{props.orderNum}</div>
        <div>{getCustomTableNum(props.tableNum)}번</div>
        <div>{props.userName}</div>
        <div>{prettyPhoneNumber(props.phoneNum)}</div>
        <div className="flex items-center gap-1">
          <IconClock className="p-[1px]" />
          <div className="font-medium">{getHourandMinute(props.createAt)}</div>
        </div>
      </div>

      <div
        className={`relative h-[353px] w-full overflow-y-auto ${props.menuList.length < 7 ? 'overflow-y-hidden' : ''}`}
      >
        <table className="w-full bg-white relative">
          <thead>
            <tr className="h-[38px] border-b border-secondary-300 text-sm">
              <th className="text-start min-w-[230px] align-middle pl-[28px]">메뉴</th>
              <th className="min-w-[30px] text-center align-middle">수량</th>
              <th className="min-w-[80px] text-right align-middle pr-[28px]">가격</th>
            </tr>
          </thead>
          <tbody>
            {props.menuList.map((menu, menuIndex) => (
              <tr
                key={menuIndex}
                className="h-[40px] border-b border-primary-150 last:border-none hover:bg-slate-50 text-sm"
              >
                <td className="text-start align-middle pl-[28px]">{menu.menuName}</td>
                <td className="min-w-[30px] text-center align-middle">{prettyMenuNum(menu.menuCount)}</td>
                <td className="min-w-[80px] text-right align-middle pr-[28px]">{prettyPrice(menu.menuPrice)}</td>
              </tr>
            ))}
            {props.menuList.length < 7 &&
              Array.from({ length: 7 - props.menuList.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={3} className="h-[43px]" />
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center h-[73px] w-full rounded-b-3xl px-[28px] bg-secondary-200">
        <div
          className="flex justify-center items-center rounded-2xl w-[100px] h-9 bg-white shrink-0 text-secondary-700 font-semibold text-sm cursor-pointer"
          onClick={handleClickCancelRestore}
        >
          주문 복구
        </div>
        <div className="font-bold text-md text-secondary-700">{prettyPrice(props.totalPrice)}</div>
      </div>
    </div>
  );
};

export default OrderCancelCard;