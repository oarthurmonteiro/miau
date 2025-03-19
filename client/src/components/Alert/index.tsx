import CircleInfo from '@assets/circle-info.svg'
import "./Alert.css";

type Props = {
    variant?: 'info' | 'danger';
    message: string;
}

export function Alert({ variant, message }: Props) {


    return (
        <div className={`alert ${variant}`}>
            <CircleInfo width={'1.3rem'} />
            <div>
                <span>{message}</span>
            </div>
        </div>
    )
}