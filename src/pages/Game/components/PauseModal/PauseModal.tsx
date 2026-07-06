import { AppButton } from "../../../../shared/ui/components/AppButton"
import { AppCard } from "../../../../shared/ui/components/AppCard"
import { AppHeading } from "../../../../shared/ui/components/AppHeading"

import style from './style.module.css'

interface IPauseModalProps {
  readonly whenClose: () => void
  readonly whenRestartGame: () => void
  readonly whenQuitGame: () => void
}

export const PauseModal = (props: IPauseModalProps) => {
  return (
    <div className={style.root}>
        <AppCard
            className={style.modal}
            theme="dark"
            content={
                <>
                    <AppHeading text='PAUSE' size='L' theme="dark" />
                    <div className={style.buttonWrapper}>
                        <AppButton type="main" text="CONTINUE GAME" whenClick={props.whenClose} />
                        <AppButton type="main" text="RESTART" whenClick={props.whenRestartGame} />
                        <AppButton 
                            className={style.quitGameButton}
                            type="main" 
                            text="QUIT GAME" 
                            whenClick={props.whenQuitGame} 
                            isTextThemeDark 
                        />
                    </div>
                </>
            }
        />
    </div>
  )
}