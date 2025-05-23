import React from 'react';
import { getHourandMinute, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconClock from '@/components/icons/IconClock';
import IconRecipe from '@/components/icons/IconRecipe';
import IconOrderCheck from '@/components/icons/IconOrderCheck';
import { useLocation } from 'react-router-dom';
import { OrderFinishCardProps } from '@/types/orders/order.types';

const OrderFinishCard: React.FC<OrderFinishCardProps> = (props) => {
  const { openPopup } = useOrderPopup();
  const { getCustomTableNum } = useTableDetail();
  const { pathname } = useLocation();

  const handleClickOrderRestore = () => {
    openPopup({
      type: 'finish',
      selectOrderInfo: {
        orderId: props.orderId,
        orderNum: props.orderNum,
        orderType: 'FINISH',
        phoneNum: props.phoneNum,
        tableNum: props.tableNum,
        totalPrice: props.totalPrice,
        userName: props.userName,
        createAt: props.createAt,
        finishAt: props.finishAt,
      },
      selectMenuInfoList: props.menuList,
    });
  };

  return (
    <>
      {/* 조리완료 페이지 */}
      {pathname.includes('finish') ? (
        <div className="w-full min-w-[350px] h-[400px] flex flex-col justify-between outline outline-1 outline-success-800-light-70 rounded-3xl max-w-[350px]">
          <div className="flex justify-between w-full h-[73px] items-center px-[21px] text-sm font-semibold bg-success-50 flex-wrap gap-x-1 rounded-t-3xl border-b border-secondary-100">
            <div>No.{props.orderNum}</div>
            <div>{getCustomTableNum(props.tableNum)}번</div>
            <div>{props.userName}</div>
            <div className="text-sm">{prettyPhoneNumber(props.phoneNum)}</div>
            <div className="flex items-center gap-1">
              <IconClock />
              <div className="text-sm font-medium">{getHourandMinute(props.createAt)}</div>
            </div>
          </div>
          <div className={`relative h-[353px] w-full overflow-y-auto ${props.menuList.length < 7 ? 'overflow-y-hidden' : ''}`}>
            <table className="w-full bg-white relative">
              <thead>
                <tr className="h-[38px] border-b border-secondary-300 text-sm">
                  <th className="text-start min-w-[230px] align-middle pl-[28px]">메뉴</th>
                  <th className="min-w-[30px] text-center align-middle">수량</th>
                  <th className="min-w-[80px] text-right align-middle pr-[28px]">가격</th>
                </tr>
              </thead>
              <tbody>
                {props.menuList.map((menu, index) => (
                  <tr key={index} className="h-[40px] border-b border-success-50 last:border-none hover:bg-slate-50 text-sm">
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
          <div className="flex justify-between items-center h-[73px] w-full rounded-b-3xl px-[28px] bg-success-50">
            <div
              className="flex justify-center items-center rounded-2xl w-[100px] h-9 bg-white shrink-0 text-success-800 font-semibold text-sm cursor-pointer"
              onClick={handleClickOrderRestore}
            >
              주문 복구
            </div>
            <div className="font-bold text-md text-secondary-700-light">{prettyPrice(props.totalPrice)}</div>
          </div>
        </div>
      ) : (
        // 실시간 페이지
        <div className="w-[350px] min-w-[350px] h-[92px] rounded-3xl flex justify-between items-center outline outline-1 outline-success-800-light-70 bg-success-50 px-6">
          <div className="w-full flex flex-col justify-center text-secondary-700 font-medium gap-[11px]">
            <div className="flex gap-[11px] items-center">
              <div className="flex items-center gap-[2px]">
                <IconRecipe />
                <div className="text-sm">{getHourandMinute(props.createAt)}</div>
              </div>
              <div className="flex items-center gap-[2px]">
                <IconOrderCheck />
                <div className="text-sm">{getHourandMinute(props.finishAt ?? '')}</div>
              </div>
            </div>
            <div className="flex text-sm items-center gap-[10px]">
              <div className="pl-[5px]">{getCustomTableNum(props.tableNum)}번 테이블</div>
              <div>{props.userName}</div>
              <div>{prettyPrice(props.totalPrice)}</div>
            </div>
          </div>
          <div
            className="flex justify-center items-center rounded-2xl w-[100px] h-9 bg-white shrink-0 text-success-800 font-semibold text-sm cursor-pointer"
            onClick={handleClickOrderRestore}
          >
            주문 복구
          </div>
        </div>
      )}
    </>
  );
};

export default OrderFinishCard;