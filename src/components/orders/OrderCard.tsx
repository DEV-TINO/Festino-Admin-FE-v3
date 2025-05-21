import React from 'react';
import OrderCancel from '@/pages/orders/OrderCancelPage';
import OrderCookingCard from './OrderCookingCard';
import OrderReadyCard from './OrderReadyCard';
import OrderFinishCard from './OrderFinishCard';
import { OrderCardProps } from '@/types/orders/order.types';

const OrderCard: React.FC<OrderCardProps> = ({ type, cardData }) => {
  return (
    <div className="w-full flex flex-col 2xl:items-center 2xl:px-8 select-none">
      {type === 'ready' && <OrderReadyCard {...cardData} />}
      {type === 'cooking' && <OrderCookingCard {...cardData} />}
      {type === 'finish' && <OrderFinishCard {...cardData} />}
      {type === 'cancel' && <OrderCancel {...cardData} />}
    </div>
  );
};

export default OrderCard;