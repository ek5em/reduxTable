import s from "./DataSheet.module.scss";
import ListItem from "./listItem/ListItem";
import NewTable from "./newTable/Table";
import React from "react";

function DataSheet() {
    const projList: string[] = [
        "По проекту",
        "Объекты",
        "РД",
        "МТО",
        "СМР",
        "График",
        "МиМ",
        "Рабочие",
        "Капвложения",
        "Бюджет",
        "Финансирования",
        "Панорамы",
        "Камеры",
        "Поручения",
        "Контрагенты",
    ];

    const list = projList.map((elem, i) => {
        return <ListItem key={i} title={elem} active={elem === "СМР"} />;
    });

    return (
        <div className={s.container}>
            <div className={s.projectlist}>
                <div className={s.projectlist_header}>
                    <div className={s.projectlist_title}>
                        <p className={s.projectlist_title_name}>
                            Название проекта
                        </p>
                        <p className={s.projectlist_title_note}>Аббревеатура</p>
                    </div>
                    <div className={s.projectlist_button} />
                </div>
                <div className={s.projectlist_list}>{list}</div>
            </div>
            <div className={s.datasheet}>
                <div className={s.datasheet_header}>
                    <p className={s.datasheet_header_title}>
                        Строительно-монтажные работы
                    </p>
                </div>
                <NewTable />
            </div>
        </div>
    );
}
export default React.memo(DataSheet);
