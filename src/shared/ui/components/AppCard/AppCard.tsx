import style from './style.module.css'

interface IAppCardProps {
  readonly content: React.ReactNode
  readonly theme?: 'light' | 'dark'
  readonly className?: string
}

export const AppCard = (props: IAppCardProps) => {
    const theme = props.theme ? props.theme : 'light'

  return (
    <div className={`${style.root} ${props.className ?? ''} ${style[theme]}`}>{ props.content }</div>
  )
}