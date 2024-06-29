import s from "./Loader.module.scss";
import { useAppSelector } from "../../app/hooks";

export default function Loader() {
    const loading = useAppSelector((state) => state.rows.loading);
    const style = () =>
        loading === "loading" ? `${s.container}` : `${s.hidden}`;
    return (
        <div className={style()}>
            <div className={s.loader} />
        </div>
    );
}
