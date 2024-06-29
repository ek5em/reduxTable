import s from "./ListItem.module.scss";

interface ListItemProps {
    title: string;
    active?: boolean;
}

export default function ListItem(props: ListItemProps) {
    const { title, active } = props;
    const style = active ? `${s.listitem} ${s.active}` : `${s.listitem}`;

    return (
        <div className={style}>
            <div className={s.listitem_icon} />
            <div className={s.listitem_title}>{title}</div>
        </div>
    );
}
