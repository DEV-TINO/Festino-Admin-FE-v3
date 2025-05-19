import { useEffect, useState, useRef } from 'react';
import IconNotFound from '@/components/icons/IconNotFound';
import IconLoading from '@/components/icons/IconLoading';
import { prettyDate } from '@/utils/utils';
import { useReserveListStore } from '@/stores/reserve/reserveList';
import { useReserveModalStore } from '@/stores/reserve/reserveModalStore';

interface Props {
  listType: 'reserve' | 'cancel' | 'complete';
}

const getMobileNum = (num: string) => {
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
};

export default function ReserveList({ listType }: Props) {
  const { getReserveList, reserveList } = useReserveListStore();
  const { openReservePopup, openMessagePopup, selectedBooth } = useReserveModalStore();

  const [reserveData, setReserveData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshReserveList = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (!selectedBooth.boothId) {
        setLoading(true);
        return;
      }
      await getReserveList({ boothId: selectedBooth.boothId, type: 'reserve' });
    }, 3000);
  };

  const loadData = async () => {
    if (!selectedBooth.boothId) {
      setLoading(true);
      return;
    }
    setLoading(true);
    await getReserveList({ boothId: selectedBooth.boothId, type: listType });

    const listMap = {
      reserve: reserveList.reserve,
      cancel: reserveList.cancel,
      complete: reserveList.complete,
    };
    setReserveData(listMap[listType] || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [listType, selectedBooth.boothId]);

  useEffect(() => {
    const listMap = {
      reserve: reserveList.reserve,
      cancel: reserveList.cancel,
      complete: reserveList.complete,
    };
    setReserveData(listMap[listType] || []);
  }, [reserveList, listType]);

  useEffect(() => {
    loadData();
    refreshReserveList();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      {loading ? (
        <div className="w-full pt-36 justify-center items-center flex flex-col gap-4">
          <IconLoading width={200} />
          <div>예약 내역을 불러오고 있습니다</div>
        </div>
      ) : reserveData.length > 0 ? (
        reserveData.map((data) => (
          <div key={data.reservationNum} className="flex items-center w-full py-[14px]">
            <div className="w-full gap-1.5 justify-center flex text-secondary-700 items-center">
              <div className="w-1/12 text-xl font-semibold text-center">{data.reservationNum}</div>
              <div className="w-2/12 text-sm flex flex-col gap-1 items-center">
                <div>{data.userName}</div>
                <div>{data.personCount}명</div>
              </div>
              <div className="w-4/12 items-center flex flex-col">
                <div className="text-sm">{getMobileNum(data.phoneNum)}</div>
                <div className="text-secondary-700 text-xs">{prettyDate(data.updateAt)}</div>
              </div>
              <div className="w-3/12 flex justify-center gap-1.5">
                <div
                  onClick={() => openReservePopup(listType, data)}
                  className="w-full text-center py-0.5 text-sm rounded-full bg-primary-800 border border-primary-800 text-white cursor-pointer"
                >
                  관리
                </div>
                <div
                  onClick={() => openMessagePopup(data)}
                  className="w-full text-center py-0.5 text-sm rounded-full border border-primary-800 text-primary-800 cursor-pointer"
                >
                  문자
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full pt-32 justify-center items-center flex flex-col gap-4">
          <IconNotFound width={200} />
          <p>예약 내역이 없습니다</p>
        </div>
      )}
    </div>
  );
}