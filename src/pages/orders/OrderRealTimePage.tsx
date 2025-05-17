import { useEffect, useRef, useState } from 'react';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useFinishOrder } from '@/stores/orders/finishOrder';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';
import { useDate } from '@/stores/commons/date';
import IconNotFound from '@/components/icons/IconNotFound';
import { cloneDeep, isEqual } from 'lodash';
import OrderCard from '@/components/orders/OrderCard';
import { WaitDepositOrder } from '@/types/orders/order.types';

const OrderRealTimePage: React.FC = () => {
  const { boothId } = useTableStatusOrder();
  const { nowDate } = useDate();

  const { cookingList, getCookingOrderList } = useCookingOrder();
  const { waitDepositList, getWaitDepositOrderList } = useDepositOrder();
  const { finishList, getFinishOrderList } = useFinishOrder();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [prevWaitDepositList, setPrevWaitDepositList] = useState<WaitDepositOrder[]>([]);
  const [isNewWaitDepositExist, setIsNewWaitDepositExist] = useState(false);

  const getAllOrderList = async () => {
    await Promise.allSettled([
      getCookingOrderList({ boothId, date: nowDate }),
      getWaitDepositOrderList({ boothId, date: nowDate }),
      getFinishOrderList({ boothId, date: nowDate })
    ]);
  };

  useEffect(() => {
    if (!boothId || !nowDate) return;
    getAllOrderList();
  }, [boothId, nowDate]);
  
  useEffect(() => {
    if (!boothId) return;
  
    const isNew = !isEqual(prevWaitDepositList, waitDepositList);
  
    if (isNew) {
      setPrevWaitDepositList(cloneDeep(waitDepositList));
      if (!isFirstLoad) {
        setIsNewWaitDepositExist(true);
      } else {
        setIsFirstLoad(false);
      }
    }
  }, [waitDepositList, boothId]);
  
  useEffect(() => {
    if (!boothId || !nowDate) return;
  
    intervalRef.current = setInterval(() => {
      getAllOrderList();
    }, 3000);
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [boothId, nowDate]);

  const renderCardSection = (title: string, type: string, data: any[]) => {
    const bgMap: Record<string, string> = {
      ready: 'bg-danger-600-light-5',
      cooking: 'bg-primary-600-light-5',
      finish: 'bg-success-800-light-5'
    };

    const textMap: Record<string, string> = {
      ready: '입금 대기',
      cooking: '조리중',
      finish: '조리 완료'
    };

    const iconMap: Record<string, string> = {
      ready: 'bg-danger-800',
      cooking: 'bg-primary-800',
      finish: 'bg-success-800'
    };

    const emptyTextMap: Record<string, string> = {
      ready: '입금 대기중인 주문이 없어요...',
      cooking: '조리할 메뉴가 없어요...',
      finish: '조리 완료된 주문이 없어요...'
    };

    return (
      <div className="flex flex-col grow gap-4 w-full 3xl:w-fit">
        <div className="flex gap-2 items-center">
          <div className={`w-[14px] h-[14px] rounded-full ${iconMap[type]}`} />
          <div className="text-md font-semibold">{textMap[type]}</div>
          {type === 'ready' && isNewWaitDepositExist && (
            <div className="text-sm text-danger pl-5">새로운 입금 대기가 들어왔어요!</div>
          )}
        </div>
        <div className={`min-w-full flex 3xl:flex-col rounded-xl ${bgMap[type]} gap-[40px] py-[30px] px-[15px] 3xl:justify-center 3xl:items-center overflow-x-auto 3xl:w-[420px]`}>
          {data.length > 0 ? (
            data.map((order, index) => (
              <OrderCard key={index} type={type} cardData={order} />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center">
              <IconNotFound width={200} />
              <div className="text-md text-gray-500 pt-3">{emptyTextMap[type]}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-between gap-[20px] max-3xl:flex-col">
      {renderCardSection('입금 대기', 'ready', waitDepositList)}
      {renderCardSection('조리중', 'cooking', cookingList)}
      {renderCardSection('조리 완료', 'finish', finishList)}
    </div>
  );
};

export default OrderRealTimePage;