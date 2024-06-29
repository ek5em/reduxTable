import React from "react";
import s from "./Header.module.scss";
import ToggleButton from "./ToggleButton/ToggleButton";

function Header() {
    return (
        <nav className={s.header}>
            <button className={s.button_menu} />
            <button className={s.button_back} />
            <ToggleButton name={"Просмотр"} active={true} />
            <ToggleButton name={"Управление"} active={false} />
        </nav>
    );
}

export default React.memo(Header);
