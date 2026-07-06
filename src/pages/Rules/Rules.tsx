import { useShallow } from "zustand/shallow"
import { useGameState } from "../../entities/game"
import { AppButton } from "../../shared/ui/components/AppButton"
import { AppCard } from "../../shared/ui/components/AppCard"
import { AppHeading } from "../../shared/ui/components/AppHeading"
import { AppText } from "../../shared/ui/components/AppText"

import check from '../../shared/ui/assets/icons/check.svg'

import style from './style.module.css'

export const Rules = () => {
    const { 
        toggleGameRulesMode,
        } = useGameState(useShallow((state) => ({
        toggleGameRulesMode: state.toggleGameRulesMode
      })))
    return (
        <div className={style.root}>
            <div className={style.content}>
                <AppCard
                    className={style.card}
                    content={
                        <>
                            <div className={style.heading}>
                                <AppHeading text='RULES' size='L' />
                            </div>
                            <div className={style.groupText}>
                                <AppHeading text='OBJECTIVE' size='S' />
                                <AppText text='Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).' />
                            </div>
                            <div className={style.groupText}>
                                <AppHeading text='HOW TO PLAY' size='S' />
                                <div className={style.point}>
                                    <AppHeading text='1' size='XS' />
                                    <AppText text='Red goes first in the first game.' />
                                </div>
                                <div className={style.point}>
                                    <AppHeading text='2' size='XS' />
                                    <AppText text='Players must alternate turns, and only one disc can be dropped in each turn. ' />
                                </div>
                                <div className={style.point}>
                                    <AppHeading text='3' size='XS' />
                                    <AppText text='The game ends when there is a 4-in-a-row or a stalemate.' />
                                </div>
                                <div className={style.point}>
                                    <AppHeading text='4' size='XS' />
                                    <AppText text='The starter of the previous game goes second on the next game.' />
                                </div>
                            </div>
                        </>
                    }
                />
                <AppButton
                    className={style.checkButton}
                    type='icon'
                    icon={check}
                    whenClick={toggleGameRulesMode}
                />
            </div>
        </div>
    )
}