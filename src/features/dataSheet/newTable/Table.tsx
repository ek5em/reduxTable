import React from "react";
import { useAppSelector } from "../../../app/hooks";
import s from "./Table.module.scss";
import { RowData } from "../../../app/store.types";
import TableRow from "./tableRow/TableRow";

export default function Table() {
    const rows = useAppSelector((state) => state.rows.rows);
    const mainRows = () => {
        return rows.map((row: RowData) => {
            return (
                <React.Fragment key={row.id}>
                    <TableRow
                        {...row}
                        width={140}
                        hasparent={false}
                        parents={[row.id!]}
                    />
                </React.Fragment>
            );
        });
    };

    return (
        <>
            <div className={s.table}>
                <div className={s.table_head}>
                    <div className={s.table_head_buttons}>Уровень</div>
                    <div className={s.table_head_title}>Наименование работ</div>
                    <div className={s.table_head_name}>Основная з/п</div>
                    <div className={s.table_head_name}>Оборудование</div>
                    <div className={s.table_head_name}>Накладные расходы</div>
                    <div className={s.table_head_name}>Сметная прибыль</div>
                </div>
                {mainRows()}
            </div>
        </>
    );
}
