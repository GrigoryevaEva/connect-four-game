import boardLayerBlackLarge from '../../shared/ui/assets/icons/board-layer-black-large.svg'
import boardLayerWhiteLarge from '../../shared/ui/assets/icons/board-layer-white-large.svg'
import boardLayerBlackSmall from '../../shared/ui/assets/icons/board-layer-black-small.svg'
import boardLayerWhiteSmall from '../../shared/ui/assets/icons/board-layer-white-small.svg'
import markerPink from '../../shared/ui/assets/icons/marker-pink.svg'
import markerYellow from '../../shared/ui/assets/icons/marker-yellow.svg'
import cellPinkLarge from '../../shared/ui/assets/icons/counter-red-large.svg'
import cellYellowLarge from '../../shared/ui/assets/icons/counter-yellow-large.svg'
import cellPinkSmall from '../../shared/ui/assets/icons/counter-red-small.svg'
import cellYellowSmall from '../../shared/ui/assets/icons/counter-yellow-small.svg'
import winCardPink from '../../shared/ui/assets/icons/turn-background-red.svg'
import winCardYellow from '../../shared/ui/assets/icons/turn-background-yellow.svg'
import playerOne from '../../shared/ui/assets/icons/player-one.svg'
import playerTwo from '../../shared/ui/assets/icons/player-two.svg'
import logo from '../../shared/ui/assets/icons/logo.svg'

import style from './style.module.css'

import { useGameState } from '../../entities/game'
import { useShallow } from 'zustand/shallow'
import { useState } from 'react'
import { AppCard } from '../../shared/ui/components/AppCard'
import { AppButton } from '../../shared/ui/components/AppButton'
import { AppHeading } from '../../shared/ui/components/AppHeading'
import type { TUsers } from '../../entities/game/types'
import { MOBILE_SIZE } from '../../shared/constants'
import { useWindowSize } from '../../shared/composables/useWindowSize'
import { PauseModal } from './components/PauseModal'

export const Game = () => {
  const [ hoveredColIndex, setHoveredColIndex ] = useState<number | null>(null)
  const [ isPause, setIsPause ] = useState<boolean>(false)

  const { 
    board,
    activeUser,
    isWin,
    isDeadend,
    winnerUser,
    valueMoveTimer,
    countWinsOneUser,
    countWinsTwoUser,
    handleMove,
    restartGame,
    stopGame,
    pauseGame,
    continueGame,
    checkAccessMove,
    checkCellIsWin,
    } = useGameState(useShallow((state) => ({
		board: state.board,
        activeUser: state.activeUser,
        isWin: state.isWin,
        isDeadend: state.isDeadend,
        winnerUser: state.winnerUser,
        countWinsOneUser: state.countWinsOneUser,
        countWinsTwoUser: state.countWinsTwoUser,
        valueMoveTimer: state.valueMoveTimer,
        startGame: state.startGame,
        handleMove: state.move,
		stopGame: state.stopGame,
        pauseGame: state.pauseGame,
        continueGame: state.continueGame,
        restartGame: state.restartGame,
        checkAccessMove: state.checkAccessMove,
        checkCellIsWin: state.checkCellIsWin,
    })))

    const renderNameUser = (user: TUsers | null) => {
        if (!user) return 'blabla'
        return user === 'one' ? 'PLAYER 1' : 'PLAYER 2'
    }

    const handlePauseGame = () => {
        setIsPause(true)
        pauseGame()
    }

    const handleContinueGame = () => {
        setIsPause(false)
        continueGame()
    }

    const handleRestartGame = () => {
        setIsPause(false)
        restartGame()
    }

    const { width } = useWindowSize();

  return (
    <div className={style.root}>
        <div className={style.header}>
            <AppButton 
                className={style.headerButton}
                text='MENU' 
                type='secondary' 
                whenClick={handlePauseGame}
            />
            <img src={logo} />
            <AppButton 
                className={style.headerButton}
                text='RESTART' 
                type='secondary' 
                whenClick={restartGame}
            />
        </div>
        <div className={style.board}>
            <img 
                className={style.blackBoard} 
                src={width > MOBILE_SIZE ? boardLayerBlackLarge : boardLayerBlackSmall} 
            />
            <img 
                className={style.whiteBoard} 
                src={width > MOBILE_SIZE ? boardLayerWhiteLarge : boardLayerWhiteSmall}
            />
            <div className={style.boardWrapper}>
                {board.map((col, colIndex) => (
                    <div 
                        className={style.col} key={colIndex} 
                        onClick={() => handleMove(colIndex)}
                        onMouseOver={() => !isWin && setHoveredColIndex(colIndex)}
                        onMouseOut={() => setHoveredColIndex(null)}
                    >
                        {width > MOBILE_SIZE && (
                            <img 
                                className={`
                                    ${style.marker} 
                                    ${
                                        hoveredColIndex === colIndex 
                                        && checkAccessMove(colIndex) 
                                        && (style.markerVisible)}
                                `}
                                src={
                                    activeUser === 'one'
                                        ? markerPink
                                        : markerYellow
                                } 
                            />
                        )}
                        {col.map((cell, rowIndex) => (
                            <div 
                                key={rowIndex}
                                className={style.cell}
                            >
                              {cell && (
                                <img 
                                    className={style.cellImg}
                                    style={{ '--row-index': rowIndex }}
                                    src={
                                        cell === 'one'
                                            ? width > MOBILE_SIZE ? cellPinkLarge : cellPinkSmall
                                            : width > MOBILE_SIZE ? cellYellowLarge : cellYellowSmall
                                    } 
                                />
                              )}
                              {checkCellIsWin(colIndex, rowIndex) && (
                                <div className={style.winMarker}></div>
                              )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <AppCard 
                className={`${style.playerCard} ${style.playerCardOne}`}
                content={
                    <>
                        <img 
                            className={style.playerImg}
                            src={playerOne}
                        />
                        <AppHeading text={renderNameUser('one')} size={`${width > MOBILE_SIZE ? 'S' : 'XS'}`} />
                        <AppHeading text={`${countWinsOneUser}`} size={`${width > MOBILE_SIZE ? 'L' : 'M'}`} />
                    </>
                }
            />
            <AppCard 
                className={`${style.playerCard} ${style.playerCardTwo}`}
                content={
                    <>
                        <img 
                            className={style.playerImg}
                            src={playerTwo}
                        />
                        <AppHeading text={renderNameUser('two')} size={`${width > MOBILE_SIZE ? 'S' : 'XS'}`} />
                        <AppHeading text={`${countWinsTwoUser}`} size={`${width > MOBILE_SIZE ? 'L' : 'M'}`} />
                    </>
                }
            />
            {
                isWin
                    ? (
                        <AppCard 
                            className={style.resultGameCard}
                            content={
                                <>
                                    <AppHeading text={renderNameUser(winnerUser)} size='XS' />
                                    <AppHeading text='WINS' size='L' />
                                    <AppButton text='PLAY AGAIN' type='secondary' whenClick={restartGame} />
                                </>
                            }
                        />
                    )
                    : isDeadend
                        ? (
                            <AppCard 
                                className={style.resultGameCard}
                                content={
                                    <>
                                        <AppHeading text='DRAWN GAME' size='XS' />
                                        <AppHeading text='DEADEND' size='L' />
                                        <AppButton text='PLAY AGAIN' type='secondary' whenClick={restartGame} />
                                    </>
                                }
                            />
                        )
                        : (
                            <div className={style.turnCard}>
                                <img src={activeUser === 'one' ? winCardPink : winCardYellow} />
                                <div className={style.turnInfo}>
                                    <AppHeading text={`${renderNameUser(activeUser)}’S TURN`} size='XS' theme={activeUser === 'one' ? 'dark' : 'light'} />
                                    <AppHeading text={`${valueMoveTimer}s`} size='L' theme={activeUser === 'one' ? 'dark' : 'light'} />
                                </div>
                            </div>
                        )
            }
        </div>
        <div 
            className={`
                ${style.footer} 
                ${
                    winnerUser
                        ? winnerUser === 'one'
                            ? style.footerWinOne
                            : style.footerWinTwo
                        : ''
                }
            `}
        >
        </div>
        {isPause && (
            <PauseModal 
                whenClose={handleContinueGame}
                whenRestartGame={handleRestartGame}
                whenQuitGame={stopGame}
            />
        )}
    </div>
  )
}