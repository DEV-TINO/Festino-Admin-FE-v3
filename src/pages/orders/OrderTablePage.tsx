import React, { useEffect, useRef, useState } from "react";
import TableCard from "@/components/orders/TableCard";
import { useTableVisualizationDetail } from "@/stores/orders/tableVisualization";
import { useDate } from "@/stores/commons/date";
import { TableItemType } from "@/types/modals/modal.types";

const OrderTablePage: React.FC = () => {
  // 열 수, 레이아웃, 편집 상태 등 관리
  const [cols, setCols] = useState<number>(4);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [cards, setCards] = useState<TableItemType[]>([]);
  const [originalCards, setOriginalCards] = useState<TableItemType[]>([]);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [rows, setRows] = useState(3); // 세로일 때 행 수

  const { tableList, getAllTableVisualization, updateTablePriority } = useTableVisualizationDetail();
  const { nowDate } = useDate();
  const didFetchRef = useRef(false); // 데이터 최초 1회만 가져오기 위한 ref

  // 쿠키에서 boothId 가져오기
  const getCookie = (name: string): string | undefined => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  // 드래그 시작 시 index 저장
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // 드롭 시 두 아이템 교환
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...cards];
    const temp = updated[draggedIndex];
    updated[draggedIndex] = updated[index];
    updated[index] = temp;

    setCards(updated);
    setDraggedIndex(null);
  };

  // 편집 시작 시 현재 상태 저장
  const handleStartEdit = () => {
    setOriginalCards(cards);
    setIsEditing(true);
  };

  // 편집 취소 시 원래 상태 복구
  const handleCancelEdit = () => {
    setCards(originalCards);
    setIsEditing(false);
  };

  // 저장 시 서버에 우선순위 업데이트 요청
  const handleSave = async () => {
    const boothIdFromCookie = getCookie('boothId');
    if (!boothIdFromCookie) {
      alert("부스 정보가 없습니다.");
      return;
    }

    // 우선순위 리스트 생성
    const tableNumPriorityList = cards.map((card, index) => ({
      tableNumIndex: card.tableNumIndex,
      tablePriority: index + 1,
    }));

    // 서버 업데이트
    const success = await updateTablePriority(boothIdFromCookie, tableNumPriorityList);

    if (success) {
      alert("테이블 우선순위가 저장되었습니다.");
      setIsEditing(false);
      localStorage.setItem('tableCols', String(cols));
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  // 데이터 최초 1회 fetch 및 열 정보 로컬에서 불러오기
  useEffect(() => {
    if (isEditing || didFetchRef.current) return;

    const boothIdFromCookie = getCookie('boothId');
    if (boothIdFromCookie) {
      getAllTableVisualization({ boothId: boothIdFromCookie, date: nowDate });
      didFetchRef.current = true;
    }

    const col = localStorage.getItem('tableCols');
    if (col) {
      setCols(Number(col));
    }
  }, [nowDate, isEditing]);

  // 테이블 리스트 갱신 시 카드 리스트도 반영
  useEffect(() => {
    setCards(tableList);
  }, [tableList]);

  // 열 수에 따라 Tailwind 클래스로 grid 적용
  const gridColsClass =
    cols === 3 ? "grid-cols-3" :
    cols === 4 ? "grid-cols-4" :
    cols === 5 ? "grid-cols-5" :
    "grid-cols-4";

  // 세로 배치일 때 열 단위로 행 수 기준으로 그룹핑
  const verticalGroups = Array.from({ length: Math.ceil(cards.length / rows) }, (_, colIndex) =>
    cards.slice(colIndex * rows, colIndex * rows + rows)
  );

  return (
    <div className="p-4">
      {/* 상단 우측 버튼 영역 */}
      <div className="w-full flex justify-end pb-4 gap-2">
        {isEditing && (
          <button
            type="button"
            className="is-button is-outlined py-2 px-6 text-sm"
            onClick={handleCancelEdit}
          >
            취소
          </button>
        )}
        <button
          type="button"
          className="is-button py-2 px-6 text-sm"
          onClick={isEditing ? handleSave : handleStartEdit}
        >
          {isEditing ? "저장" : "테이블 순서 변경"}
        </button>
      </div>

      {/* 드롭다운 설정 영역 */}
      {isEditing && (
        <div className="w-full flex justify-center items-center pb-10 gap-4">
          <label className="text-sm font-medium">배치 방식:</label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as 'horizontal' | 'vertical')}
            className="border px-2 py-1 text-sm rounded"
          >
            <option value="horizontal">가로</option>
            <option value="vertical">세로</option>
          </select>

          {/* 가로일 때 열 수 설정 */}
          {layout === 'horizontal' && (
            <>
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
            </>
          )}

          {/* 세로일 때 행 수 설정 */}
          {layout === 'vertical' && (
            <>
              <label className="text-sm font-medium">행 수:</label>
              <select
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="border px-2 py-1 text-sm rounded"
              >
                {[2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}행</option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {/* 테이블 카드 출력 영역 */}
      <div className="flex justify-center">
        {layout === 'horizontal' ? (
          <div
            className={`max-w-[1100px] grid gap-8 justify-items-center ${gridColsClass}`}
            style={{ gridTemplateRows: `repeat(${Math.ceil(cards.length / cols)}, minmax(0, 1fr))` }}
          >
            {cards.map((card, index) => (
              <div
                key={card.tableNumIndex}
                draggable={isEditing}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className={`transition-transform duration-150 ${isEditing ? "cursor-move" : ""}`}
              >
                <TableCard table={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-8">
            {verticalGroups.map((group, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-8">
                {group.map((card, index) => (
                  <div
                    key={card.tableNumIndex}
                    draggable={isEditing}
                    onDragStart={() => handleDragStart(colIdx * rows + index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(colIdx * rows + index)}
                    className={`transition-transform duration-150 ${isEditing ? "cursor-move" : ""}`}
                  >
                    <TableCard table={card} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTablePage;