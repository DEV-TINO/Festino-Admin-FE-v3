import React, { useEffect, useRef, useState } from "react";
import TableCard from "@/components/orders/TableCard";
import { useTableVisualizationDetail } from "@/stores/orders/tableVisualization";
import { useDate } from "@/stores/commons/date";
import { TableItemType } from "@/types/modals/modal.types";

const OrderTablePage: React.FC = () => {
  // 열 수, 편집 상태 등 관리
  const [cols, setCols] = useState<number>(4);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [cards, setCards] = useState<TableItemType[]>([]);
  const [originalCards, setOriginalCards] = useState<TableItemType[]>([]);

  const { tableList, getAllTableVisualization, updateTablePriority } = useTableVisualizationDetail();
  const { nowDate } = useDate();
  const didFetchRef = useRef(false); // 데이터 최초 1회만 가져오기 위한 ref

  const getCookie = (name: string): string | undefined => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...cards];
    const temp = updated[draggedIndex];
    updated[draggedIndex] = updated[index];
    updated[index] = temp;
    setCards(updated);
    setDraggedIndex(null);
  };

  const handleStartEdit = () => {
    setOriginalCards(cards);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setCards(originalCards);
    setIsEditing(false);
  };

  const handleReset = () => {
    const sorted = [...cards].sort((a, b) => a.tableNumIndex - b.tableNumIndex);
    setCards(sorted);
  };

  const handleSave = async () => {
    const boothIdFromCookie = getCookie('boothId');
    if (!boothIdFromCookie) {
      alert("부스 정보가 없습니다.");
      return;
    }

    const tableNumPriorityList = cards.map((card, index) => ({
      tableNumIndex: card.tableNumIndex,
      tablePriority: index + 1,
    }));

    const success = await updateTablePriority(boothIdFromCookie, tableNumPriorityList);
    if (success) {
      alert("테이블 우선순위가 저장되었습니다.");
      setIsEditing(false);
      localStorage.setItem('tableCols', String(cols));
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (isEditing || didFetchRef.current) return;
    const boothIdFromCookie = getCookie('boothId');
    if (boothIdFromCookie) {
      getAllTableVisualization({ boothId: boothIdFromCookie, date: nowDate });
      didFetchRef.current = true;
    }
    const col = localStorage.getItem('tableCols');
    if (col) setCols(Number(col));
  }, [nowDate, isEditing]);

  useEffect(() => {
    setCards(tableList);
  }, [tableList]);

  const gridColsClass =
    cols === 3 ? "grid-cols-3" :
    cols === 4 ? "grid-cols-4" :
    cols === 5 ? "grid-cols-5" :
    "grid-cols-4";

  return (
    <div className="p-4">
      <div className="w-full flex justify-end pb-4 gap-2">
        {isEditing && (
          <>
            <button type="button" className="is-button is-outlined py-2 px-6 text-sm" onClick={handleCancelEdit}>취소</button>
            <button type="button" className="is-button is-outlined py-2 px-6 text-sm" onClick={handleReset}>리셋</button>
          </>
        )}
        <button type="button" className="is-button py-2 px-6 text-sm" onClick={isEditing ? handleSave : handleStartEdit}>
          {isEditing ? "저장" : "테이블 순서 변경"}
        </button>
      </div>

      {isEditing && (
        <div className="w-full flex justify-center items-center pb-10 gap-4">
          <label className="text-sm font-medium">열 수:</label>
          <select
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="border px-2 py-1 text-sm rounded"
          >
            {[3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}열</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-center">
        <div className={`max-w-[1100px] grid gap-8 justify-items-center ${gridColsClass}`} style={{ gridTemplateRows: `repeat(${Math.ceil(cards.length / cols)}, minmax(0, 1fr))` }}>
          {cards.map((card, index) => (
            <div key={card.tableNumIndex} draggable={isEditing} onDragStart={() => handleDragStart(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(index)} className={`transition-transform duration-150 ${isEditing ? "cursor-move" : ""}`}>
              <TableCard table={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTablePage;