import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconNotFound from '@/components/icons/IconNotFound';
import IconClose from '@/components/icons/IconClose';
import IconPlus from '@/components/icons/IconPlus';

interface TableItem {
  customTableNum: string;
  tableNumIndex: number;
}

const TableCustomModal: React.FC = () => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const {
    tableNumList,
    closeTableDetailModal,
    setTableNumList,
    setTableNum,
  } = useTableDetail();

  const [newTableNumList, setNewTableNumList] = useState<TableItem[]>(
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
    setNewTableNumList([]);
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
    closeTableDetailModal();
  };

  const handleClickCancelButton = () => {
    setNewTableNumList([...tableNumList]);
    closeTableDetailModal();
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
    <div className="min-w-[580px] w-[660px] h-[700px] flex flex-col justify-start items-center bg-white rounded-2xl overflow-y-auto px-[52px] py-11 gap-[24px]">
      <div className="w-full flex justify-between items-center text-xl font-semibold text-primary-800 h-9">
        <div className="w-[25px]" />
        테이블 커스텀
        <div className="items-center justify-center flex w-8 h-8 p-2 cursor-pointer hover:bg-gray-100 rounded-2xl">
          <IconClose onClick={closeTableDetailModal} />
        </div>
      </div>

      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col items-center">
          <div className="w-[230px] h-[48px] rounded-2xl bg-primary-50 text-md flex gap-[10px] justify-center items-center">
            <span className="text-primary-800 font-bold">현재 테이블 개수</span>
            <span className="w-[60px] h-[30px] rounded-2xl border border-secondary-150 text-secondary-700 text-center font-bold bg-white grid place-items-center">
              {newTableNumList.length}
            </span>
          </div>
        </div>

        <div className="w-full flex justify-between font-semibold">
          <div className="flex gap-[10px]">
            <button onClick={() => handleClickAddTableButton(1)} className="w-[130px] rounded-2xl border border-primary-800 h-11 flex items-center justify-center gap-2 text-primary-800 text-sm hover:bg-primary-800-light-8">
              <IconPlus /> 테이블 추가
            </button>
            <button onClick={() => handleClickAddTableButton(10)} className="w-[155px] rounded-2xl border border-primary-800 h-11 flex items-center justify-center gap-2 text-primary-800 text-sm hover:bg-primary-800-light-8">
              <IconPlus /> 테이블 10개 추가
            </button>
          </div>
          <button onClick={handleClickTotalDeleteButton} className="w-[100px] rounded-2xl border border-danger-800 h-11 flex items-center justify-center text-danger-800 text-sm hover:bg-danger-800-light-12">
            전체 삭제
          </button>
        </div>
      </div>

      {newTableNumList.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center text-md font-medium text-secondary-700 gap-8 h-full">
          <IconNotFound />
          현재 테이블이 존재하지 않습니다.<br />테이블 추가 버튼을 통해 테이블을 추가해주세요!
        </div>
      ) : (
        <>
          <div className="text-secondary-700 font-medium text-center text-sm">
            커스텀 테이블 번호를 입력해주세요. (예시: A-1, 최대 10글자)<br />미 입력 시 테이블 번호가 자동으로 설정됩니다.
          </div>

          <div id="modalContainer" ref={modalContainerRef} className="grow overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px] place-items-start px-2">
              {newTableNumList.map((table, tableIndex) => (
                <div
                  key={tableIndex}
                  id={`table-${tableIndex}`}
                  draggable
                  onDragStart={(e) => handleDropStartTable(e, tableIndex)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropTable(e, tableIndex)}
                  className="w-[250px] flex flex-col gap-3 p-2 border border-transparent rounded-2xl cursor-pointer hover:border-primary-800"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">테이블 {tableIndex + 1}</span>
                    <span className="w-[40px] h-[25px] rounded-full bg-danger-800-light-12 text-danger-800 cursor-pointer grid place-items-center font-medium text-xs" onClick={() => handleClickDeleteButton(tableIndex)}>
                      삭제
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder={`${tableIndex + 1}`}
                    value={table.customTableNum}
                    onChange={(e) => handleInputCustomTableNum(e, tableIndex)}
                    maxLength={10}
                    className="w-full h-[45px] border border-secondary-150 rounded-xl px-[17px] font-medium text-sm focus:border-primary-800 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="w-full flex justify-end items-center gap-3 text-xl">
        <button onClick={handleClickCancelButton} className="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-800 bg-white border border-primary-800">
          취소
        </button>
        <button onClick={handleClickSaveButton} className="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white bg-primary-800">
          저장
        </button>
      </div>
    </div>
  );
}

export default TableCustomModal;