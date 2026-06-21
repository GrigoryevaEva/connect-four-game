import style from './style.module.css'

interface IAppHeadingProps {
  readonly text: string
  readonly size: 'L' | 'M' | 'S' | 'XS'
}

export const AppHeading = (props: IAppHeadingProps) => {
    return (
        <p className={`${style.root} ${style[props.size]}`}>{props.text}</p>
    )
}