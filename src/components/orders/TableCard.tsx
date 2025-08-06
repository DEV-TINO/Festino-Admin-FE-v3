import { useTableDetail } from "@/stores/booths/tableDetail";
import { useTableVisualizationDetail } from "@/stores/orders/tableVisualization";
import { TableCardProps } from "@/types/orders/order.types";
import { prettyPrice } from "@/utils/utils";

const TableCard: React.FC<TableCardProps> = ({ table }) => {
  const { openTableVisualDetail } = useTableVisualizationDetail();
  const { getCustomTableNum } = useTableDetail();

  return (
    <>
      {/* 가장 최근 주문 건이 입금대기인 테이블 */}
      {table.type === 'ready' && (
        <div 
          className={`cursor-pointer select-none w-28 h-28 md:w-36 md:h-36 p-3 bg-danger-50 rounded-xl flex flex-col justify-between text-secondary-700 hover:bg-danger-600-light-40`}
          onClick={() => openTableVisualDetail({ tableNumIndex: table.tableNumIndex })}
        >
          {/* 테이블 번호 */}
          <div className="font-semibold text-center">테이블 {getCustomTableNum(table.tableNumIndex)}번</div>
          <div className="flex flex-col items-end">
            {/* 주문상태 */}
            <div className={`text-right w-fit rounded-full text-danger-800 font-medium`}>입금대기</div>
            {/* 총 금액 */}
            <div className="font-semibold text-secondary-700">{prettyPrice(Number(table.orderInfo?.totalPrice ?? 0))}</div>
          </div>
        </div>
      )}

      {/* 가장 최근 주문 건이 조리중인 테이블 */}
      {table.type === 'cooking' && (
        <div 
          className={`cursor-pointer select-none w-28 h-28 md:w-36 md:h-36 p-3 bg-primary-300 rounded-xl flex flex-col justify-between text-secondary-700 hover:bg-primary-800-light-50`}
          onClick={() => openTableVisualDetail({ tableNumIndex: table.tableNumIndex })}
        >
          {/* 테이블 번호 */}
          <div className="font-semibold text-center">테이블 {getCustomTableNum(table.tableNumIndex)}번</div>
          <div className="flex flex-col items-end">
            {/* 주문상태 */}
            <div className={`text-right w-fit rounded-full text-primary-800 font-medium`}>조리중</div>
            {/* 총 금액 */}
            <div className="font-semibold text-secondary-700">{prettyPrice(Number(table.orderInfo?.totalPrice ?? 0))}</div>
          </div>
        </div>
      )}

      {/* 가장 최근 주문 건이 조리완료인 테이블 */}
      {table.type === 'complete' && table.orderInfo && (
        <div 
          className={`cursor-pointer select-none w-28 h-28 md:w-36 md:h-36 p-3 bg-success-50 rounded-xl flex flex-col justify-between text-secondary-700 hover:bg-success-800-light-70`}
          onClick={() => openTableVisualDetail({ tableNumIndex: table.tableNumIndex })}
        >
          {/* 테이블 번호 */}
          <div className="font-semibold text-center">테이블 {getCustomTableNum(table.tableNumIndex)}번</div>
          <div className="flex flex-col items-end">
            {/* 주문상태 */}
            <div className={`text-right w-fit rounded-full text-success-900 font-medium`}>조리완료</div>
            {/* 총 금액 */}
            <div className="font-semibold text-secondary-700">{prettyPrice(Number(table.orderInfo?.totalPrice ?? 0))}</div>
          </div>
        </div>
      )}

        {/* 최근 주문이 없는 테이블 */}
        {!table.orderInfo && (
          <div
            className={`cursor-pointer select-none w-28 h-28 md:w-36 md:h-36 p-3 bg-gray-200 rounded-xl flex flex-col justify-between text-secondary-700 hover:bg-gray-300`}
            onClick={() => openTableVisualDetail({ tableNumIndex: table.tableNumIndex })}
          >
            {/* 테이블 번호 */}
            <div className="font-semibold text-center">테이블 {getCustomTableNum(table.tableNumIndex)}번</div>
            <div className="flex flex-col items-end">
              {/* 최근 주문 없음 안내 */}
              <div className={`text-center w-full rounded-full text-secondary-600 font-medium`}>최근 1시간 내</div>
              <div className={`text-center w-full rounded-full text-secondary-600 font-medium`}>주문 건 없음</div>
            </div>
          </div>
        )}
    </>
  );
};

export default TableCard;
