import { AppButton } from '../../shared/ui/components/AppButton'
import { AppCard } from '../../shared/ui/components/AppCard'
import logo from '../../shared/ui/assets/icons/logo.svg'
import playerVsPlayer from '../../shared/ui/assets/icons/player-vs-player.svg'
import style from './style.module.css'
import { useGameState } from '../../entities/game'
import { useShallow } from 'zustand/shallow'

export const Menu = () => {
    const { 
        startGame,
        toggleGameRulesMode,
    } = useGameState(useShallow((state) => ({
        startGame: state.startGame,
        toggleGameRulesMode: state.toggleGameRulesMode,
    })))

    return (
        <div className={style.root}>
            <AppCard 
                className={style.menu}
                theme='dark'
                content={
                    <>
                        <img src={logo} alt="" />
                        <div className={style.buttonsWrapper}>
                            <AppButton 
                                className={style.buttonPlayersGame}
                                type='main'
                                text='PLAY VS PLAYER'
                                icon={playerVsPlayer}
                                whenClick={startGame}
                            />
                            <AppButton 
                                type='main'
                                text='GAME RULES'
                                isTextLeft
                                whenClick={toggleGameRulesMode}
                            />
                        </div>
                    </>
                }
            />
        </div>
    )
}