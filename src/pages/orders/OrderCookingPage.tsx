import { useEffect, useRef } from 'react';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import IconNotFound from '@/components/icons/IconNotFound';
import OrderCookingCard from '@/components/orders/OrderCookingCard';
import { useDate } from '@/stores/commons/date';
import { useTableStatusOrder } from '@/stores/orders/tableStatusOrder';

const OrderCookingPage: React.FC = () => {
  const { boothId } = useTableStatusOrder();
  const { nowDate } = useDate();
  const {
    cookingList,
    getCookingOrderList,
  } = useCookingOrder();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!boothId) return;

    getCookingOrderList({ boothId, date: nowDate });

    intervalRef.current = setInterval(() => {
      getCookingOrderList({ boothId, date: nowDate });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [boothId, nowDate]);

  return (
    <>
      <div className="flex gap-4 items-center">
        <div className="w-[14px] h-[14px] rounded-full bg-primary-800" />
        <div className="text-md font-semibold">조리 중</div>
      </div>
      <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
        {cookingList.length > 0 ? (
          cookingList.map((order, index) => (
            <OrderCookingCard
              key={index}
              {...order}
            />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <IconNotFound width={200} />
            <div className="text-lg text-gray-500">조리할 메뉴가 없어요...</div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderCookingPage;
