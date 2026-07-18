import style from './style.module.css'

interface IAppHeadingProps {
  readonly text: string
  readonly size: 'L' | 'M' | 'S' | 'XS'
  readonly theme?: 'light' | 'dark'
  readonly className?: string
}

export const AppHeading = (props: IAppHeadingProps) => {
    return (
        <p className={`
            ${style.root}
            ${props.theme === 'dark' && style.dark}
            ${style[props.size]}
            ${props.className ?? ''}
        `}>{props.text}</p>
    )
}