import { useEffect } from "react";
import s from "./App.module.scss";
import Header from "./features/header/Header";
import DataSheet from "./features/dataSheet/DataSheet";
import Loader from "./features/loader/Loader";
import { useAppDispatch } from "./app/hooks";
import { fetchOverloads } from "./app/rowsSlice";

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchOverloads());
    }, [dispatch]);

    return (
        <div className={s.container}>
            <Header />
            <DataSheet />
            <Loader />
        </div>
    );
}
