import { AppHeading } from "../AppHeading"

import style from './style.module.css'

interface IAppButtonProps {
  readonly type: 'main' | 'secondary' | 'icon'
  readonly text?: string
  readonly isTextLeft?: boolean
  readonly icon?: string
  readonly className?: string
  readonly isTextThemeDark?: boolean
  readonly whenClick: () => void
}

export const AppButton = (props: IAppButtonProps) => {
    const themeText = props.isTextThemeDark ? 'dark' : 'light'
    const text = props.text ?? ''
    switch (props.type) {
        case 'main':
            return (
                <button 
                    className={`
                        ${style.main}
                        ${props.className ?? ''}
                        ${(props.isTextLeft || props.icon) && (style.textLeft)}
                    `}
                    onClick={props.whenClick}
                >
                    <AppHeading text={text} size="M" theme={themeText} />
                    {props.icon && (
                        <img src={props.icon} alt="" />
                    )}
                </button>
            )
        case 'secondary':
            return (
                <button 
                    className={`${style.secondary} ${props.className ?? ''}`} 
                    onClick={props.whenClick}
                >
                    <AppHeading text={text} size="XS" theme="dark" />
                </button>
            )
        case 'icon':
            return (
                <button 
                    className={`${style.icon} ${props.className ?? ''}`} 
                    onClick={props.whenClick}
                >
                    <img src={props.icon} alt="" />
                </button>
            )
    }
}