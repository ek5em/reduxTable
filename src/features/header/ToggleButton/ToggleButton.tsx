import s from "./ToggleButton.module.scss";

interface ToglleButtonProps {
    name: string;
    active: boolean;
}

export default function ToggleButton(props: ToglleButtonProps) {
    const { name, active } = props;
    let buttonStyle = active ? `${s.button} ${s.active}` : `${s.button}`;
    return (
        <>
            <button className={buttonStyle}>{name}</button>
        </>
    );
}
