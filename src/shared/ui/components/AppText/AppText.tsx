import style from './style.module.css'

interface IAppTextProps {
  readonly text: string
  readonly className?: string
}

export const AppText = (props: IAppTextProps) => {
    return (
        <p className={`
            ${style.root}
            ${props.className ?? ''}
        `}
        >{props.text}</p>
    )
}