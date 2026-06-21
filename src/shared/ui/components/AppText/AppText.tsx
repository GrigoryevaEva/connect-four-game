import style from './style.module.css'

interface IAppTextProps {
  readonly text: string
}

export const AppText = (props: IAppTextProps) => {
    return (
        <p className={style.root}>{props.text}</p>
    )
}