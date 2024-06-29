import s from "./TableRow.module.scss";
import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  addRowLocally,
  setEditable,
  addRow,
  setPath,
  saveEditRow,
  deleteRow,
} from "../../../../app/rowsSlice";
import { RowData, AddRowData } from "../../../../app/store.types";
import { RowStyles, Parents } from "./TableRow.types";
import { validateInput } from "./TableRow.service";

type TableRowProps = RowStyles & RowData & Parents;

export default function TableRow(props: TableRowProps) {
  const {
    rowName,
    child,
    parentId,
    id,
    salary,
    equipmentCosts,
    overheads,
    estimatedProfit,
    hasparent,
    parents,
    width,
  } = props;

  const [newRowName, setNewRowName] = useState(rowName);
  const [newSalary, setNewSalary] = useState(String(salary));
  const [newOverheads, setnewOverheads] = useState(String(overheads));
  const [newEstimatedProfit, setnewEstimatedProfit] = useState(
    String(estimatedProfit)
  );
  const [newEquipmentCosts, setnewEquipmentCosts] = useState(
    String(equipmentCosts)
  );

  const editable = useAppSelector((state) => state.rows.editable);
  const dispatch = useAppDispatch();

  const buttonsStyle = useMemo(() => {
    return hasparent ? `${s.addRow} ${s.addRow_hasparent}` : `${s.addRow}`;
  }, [hasparent]);

  const addRowHandle = () => {
    if (editable === null) {
      dispatch(setEditable(0));
      dispatch(setPath(parents));
      dispatch(addRowLocally(id!));
    }
  };

  const editRowHandle = () => {
    if (editable === null) {
      dispatch(setEditable(id!));
      dispatch(setPath(parents));
    }
  };

  const deleteRowHandle = () => {
    if (editable === null) {
      dispatch(setPath(parents));
      dispatch(deleteRow(id!));
    }
  };

  const saveNewRow = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params: AddRowData = {
        id: id,
        rowName: newRowName,
        parentId: parentId,
        salary: Number(newSalary) || 0,
        overheads: Number(newOverheads) || 0,
        equipmentCosts: Number(newEquipmentCosts) || 0,
        estimatedProfit: Number(newEstimatedProfit) || 0,
      };
      editable === 0 ? dispatch(addRow(params)) : dispatch(saveEditRow(params));
    } else {
      return e.key;
    }
  };

  const childrenRows = () => {
    return (
      child &&
      child.map((row) => {
        return (
          <TableRow
            key={row.id}
            {...row}
            width={width - 20}
            hasparent={true}
            parents={[...parents, row.id!]}
            parentId={id}
          />
        );
      })
    );
  };

  if (editable !== null && editable === id) {
    return (
      <>
        <div className={s.row}>
          <div className={s.row_line}>
            <div className={s.buttons} style={{ width: `${width}px` }}>
              <div className={s.buttons_cont}>
                <div className={buttonsStyle} />
                <div className={s.delRow} />
              </div>
            </div>
            <div className={s.title}>
              <input
                autoFocus
                className={s.input}
                value={newRowName}
                onChange={(e) => setNewRowName(e.target.value)}
                onKeyDown={saveNewRow}
              />
            </div>
            <div className={s.cell}>
              <input
                className={s.input}
                value={newSalary}
                onBlur={() =>
                  newSalary.trim().length === 0 && setNewSalary("0")
                }
                onChange={(e) => setNewSalary(validateInput(e.target.value))}
                onKeyDown={saveNewRow}
              />
            </div>
            <div className={s.cell}>
              <input
                className={s.input}
                value={newEquipmentCosts}
                onBlur={() =>
                  newEquipmentCosts.trim().length === 0 &&
                  setnewEquipmentCosts("0")
                }
                onChange={(e) =>
                  setnewEquipmentCosts(validateInput(e.target.value))
                }
                onKeyDown={saveNewRow}
              />
            </div>
            <div className={s.cell}>
              <input
                className={s.input}
                value={newOverheads}
                onBlur={() =>
                  newOverheads.trim().length === 0 && setnewOverheads("0")
                }
                onChange={(e) => setnewOverheads(validateInput(e.target.value))}
                onKeyDown={saveNewRow}
              />
            </div>
            <div className={s.cell}>
              <input
                className={s.input}
                value={newEstimatedProfit}
                onBlur={() =>
                  newSalary.trim().length === 0 && setNewSalary("0")
                }
                onChange={(e) =>
                  setnewEstimatedProfit(validateInput(e.target.value))
                }
                onKeyDown={saveNewRow}
              />
            </div>
          </div>
          {childrenRows()}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={s.row}>
          <div className={s.row_line} onDoubleClick={editRowHandle}>
            <div className={s.buttons} style={{ width: `${width}px` }}>
              <div className={s.buttons_cont}>
                <div className={buttonsStyle} onClick={addRowHandle} />
                <div className={s.delRow} onClick={deleteRowHandle} />
              </div>
            </div>
            <div className={s.title}>{rowName}</div>
            <div className={s.cell}>{salary}</div>
            <div className={s.cell}>{equipmentCosts} </div>
            <div className={s.cell}>{overheads}</div>
            <div className={s.cell}>{estimatedProfit}</div>
          </div>
          {childrenRows()}
        </div>
      </>
    );
  }
}
