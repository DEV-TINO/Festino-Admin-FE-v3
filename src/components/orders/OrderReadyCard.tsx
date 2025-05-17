import React from 'react';
import { getHourandMinute, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconClock from '@/components/icons/IconClock';
import { OrderReadyCardProps } from '@/types/orders/order.types';

const OrderReadyCard: React.FC<OrderReadyCardProps> = (props) => {
  const { openPopup } = useOrderPopup();
  const { getCustomTableNum } = useTableDetail();

  const handleClickOrderDetail = () => {
    openPopup({
      type: 'ready',
      selectOrderInfo: {
        orderId: props.orderId,
        orderNum: props.orderNum,
        orderType: '',
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
    <div className="w-full min-w-[350px] h-[400px] flex flex-col justify-between outline outline-1 outline-danger-50 rounded-3xl max-w-[500px]">
      <div className="flex justify-between w-full h-[65px] items-center px-[21px] text-[13px] font-semibold bg-danger-50 rounded-t-3xl border-b border-secondary-100 flex-wrap gap-x-2">
        <div>No.{props.orderNum}</div>
        <div>{getCustomTableNum(props.tableNum)}번</div>
        <div>{props.userName}</div>
        <div>{prettyPhoneNumber(props.phoneNum)}</div>
        <div className="flex items-center gap-1">
          <IconClock />
          <div>{getHourandMinute(props.createAt)}</div>
        </div>
      </div>
      <div className={`relative h-[353px] w-full overflow-y-auto ${props.menuList.length < 7 ? 'overflow-y-hidden' : ''}`}>
        <table className="w-full bg-white relative">
          <thead>
            <tr className="h-[38px] border-b border-secondary-300 text-sm">
              <th className="text-start min-w-[220px] align-middle pl-[28px]">메뉴</th>
              <th className="min-w-[30px] text-center align-middle">수량</th>
              <th className="min-w-[100px] text-right align-middle pr-[28px]">가격</th>
            </tr>
          </thead>
          <tbody>
            {props.menuList.map((menu, index) => (
              <tr key={index} className="h-[40px] border-b border-danger-50 last:border-none hover:bg-slate-50 text-sm">
                <td className="text-start align-middle pl-[28px]">{menu.menuName}</td>
                <td className="min-w-[30px] text-center align-middle">{prettyMenuNum(menu.menuCount)}</td>
                <td className="min-w-[100px] text-right align-middle pr-[28px]">{prettyPrice(menu.menuPrice)}</td>
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
      <div className="flex justify-between items-center h-[65px] w-full rounded-b-3xl px-[28px] bg-danger-50">
        <div
          className="w-[100px] h-9 rounded-2xl flex items-center justify-center cursor-pointer bg-white text-danger-800 font-semibold text-sm"
          onClick={handleClickOrderDetail}
        >
          입금 확인
        </div>
        <div className="font-bold text-md text-secondary-700-light">{prettyPrice(props.totalPrice)}</div>
      </div>
    </div>
  );
};

export default OrderReadyCard;