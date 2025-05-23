import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconNotFound from '@/components/icons/IconNotFound';
import { useBaseModal } from '@/stores/commons/baseModal';

const MobileTableCustomModal: React.FC = () => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const { closeMobileModal } = useBaseModal();
  const {
    tableNumList,
    setTableNumList,
    setTableNum,
  } = useTableDetail();

  const [newTableNumList, setNewTableNumList] = useState(
    _.cloneDeep(tableNumList)
  );

  const handleInputCustomTableNum = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updated = [...newTableNumList];
    updated[index].customTableNum = event.target.value;
    setNewTableNumList(updated);
  };

  const handleClickAddTableButton = async (num: number) => {
    let newIndex = newTableNumList.length;
    const newItems = num === 1
      ? [{ customTableNum: '', tableNumIndex: newIndex }]
      : Array(10).fill(null).map(() => ({ customTableNum: '', tableNumIndex: newIndex++ }));

    setNewTableNumList(prev => [...prev, ...newItems]);

    await new Promise(resolve => setTimeout(resolve));
    const lastIndex = newTableNumList.length + newItems.length - 1;
    document.getElementById(`table-${lastIndex}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleClickTotalDeleteButton = () => {
    setNewTableNumList([{
      "customTableNum": "1",
      "tableNumIndex": 1
    }]);
  };

  const handleClickDeleteButton = (index: number) => {
    const updated = [...newTableNumList];
    updated.splice(index, 1);
    setNewTableNumList(updated);
  };

  const handleClickSaveButton = () => {
    const updated = newTableNumList.map((table, index) => ({
      ...table,
      customTableNum: table.customTableNum || `${index + 1}`,
    }));
    setTableNumList(updated);
    setTableNum(updated.length);
    closeMobileModal();
  };

  const handleClickCancelButton = () => {
    setNewTableNumList([...tableNumList]);
    closeMobileModal();
  };

  const handleDropStartTable = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDropTable = (event: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const items = [...newTableNumList];
    const [dragItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, dragItem);

    const updated = items.map((item, index) => ({
      ...item,
      tableNumIndex: index + 1,
    }));
    setNewTableNumList(updated);
  };

  useEffect(() => {
    modalContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const updated = newTableNumList.map((table, index) => ({
      ...table,
      tableNumIndex: index + 1,
    }));
    setNewTableNumList(updated);
  }, [newTableNumList.length]);

  return (

  <div className="w-[390px] min-w-[325px] h-[560px] bg-white rounded-3xl flex flex-col items-center p-6 gap-3 justify-between">
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex w-full justify-between items-center">
        <div className="w-3 h-3" />
        <div className="font-semibold text-primary-800">테이블 커스텀</div>
        <svg onClick={() => closeMobileModal()} className="w-3 h-3 cursor-pointer" viewBox="0 0 14 14" fill="none">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1L13 13M13 1L1 13" />
        </svg>
      </div>

      <div className="bg-primary-800-light-8 p-2.5 flex gap-1 items-center rounded-xl">
        <div className="text-primary-800 text-2xs font-bold">현재 테이블 개수</div>
        <div className="w-9 h-[18px] bg-white rounded-full border-1 text-xs text-secondary-700 text-center">
          {newTableNumList.length}
        </div>
      </div>

      <div className="flex justify-between text-xs w-full">
        <div className="text-primary-900 flex gap-2">
          <button className="px-2 py-1.5 rounded-xl border border-primary-800" onClick={() => handleClickAddTableButton(1)}>+ 테이블 추가</button>
          <button className="px-2 py-1.5 rounded-xl border border-primary-800" onClick={() => handleClickAddTableButton(10)}>+ 테이블 10개 추가</button>
        </div>
        <button className="px-2 py-1.5 rounded-xl border border-danger-800 text-danger-800" onClick={handleClickTotalDeleteButton}>전체 삭제</button>
      </div>

      {newTableNumList.length !== 0 ? (
        <>
          <div className="text-secondary-700 text-2xs flex flex-col items-center">
            <div>커스텀 테이블 번호를 입력해주세요. (예시 : A-1, 최대 10글자)</div>
            <div>미 입력 시 테이블 번호가 자동으로 설정됩니다.</div>
          </div>

          <div ref={modalContainerRef} className="w-full max-h-[300px] overflow-y-auto flex flex-wrap justify-between">
            {newTableNumList.map((table, tableIndex) => (
              <div
                key={tableIndex}
                id={`table-${tableIndex}`}
                className="flex flex-col rounded-xl gap-1.5 w-[48%] py-1.5"
                draggable
                onDragStart={(e) => handleDropStartTable(e, tableIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropTable(e, tableIndex)}
              >
                <div className="flex justify-between items-center">
                  <div className="text-xs">테이블 {tableIndex + 1}</div>
                  <div
                    className="rounded-full bg-danger-800-light-12 text-danger-800 text-2xs px-2 py-1 cursor-pointer"
                    onClick={() => handleClickDeleteButton(tableIndex)}
                  >
                    삭제
                  </div>
                </div>
                <input
                  type="text"
                  placeholder={`${tableIndex + 1}`}
                  value={table.customTableNum}
                  onChange={(e) => handleInputCustomTableNum(e, tableIndex)}
                  maxLength={10}
                  className="border border-secondary-150 rounded-xl py-1.5 px-4 text-2xs"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-xs flex flex-col items-center h-[342px] justify-center">
          <IconNotFound width={150} />
          <div>현재 테이블이 존재하지 않습니다.</div>
          <div>테이블 추가 버튼을 통해 테이블을 추가해주세요!</div>
        </div>
      )}
    </div>

    <div className="text-xs font-semibold gap-2.5 flex w-full justify-end">
      <button onClick={handleClickCancelButton} className="px-4 py-1.5 border border-primary-800 rounded-xl text-primary-800">취소</button>
      <button onClick={handleClickSaveButton} className="px-4 py-1.5 border border-primary-800 rounded-xl bg-primary-800 text-white">저장</button>
    </div>
  </div>
  );
};

export default MobileTableCustomModal;