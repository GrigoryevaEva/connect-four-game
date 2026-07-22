import { useShallow } from "zustand/shallow";
import { useGameState } from "../entities/game";
import { Game } from "../pages/Game";
import { Menu } from "../pages/Menu";
import { Rules } from "../pages/Rules";
import { AppHeading } from "../shared/ui/components/AppHeading";

import style from './style.module.css'

export const App = () => {

  const { 
    activeGame,
    isGameRulesMode,
    } = useGameState(useShallow((state) => ({
    activeGame: state.activeGame,
    isGameRulesMode: state.isGameRulesMode
  })))

  return (
    <div className={style.root}>
      {
        activeGame
          ? <Game />
          : isGameRulesMode
            ? <Rules />
            : <Menu />
      }
      <AppHeading 
        className={style.watermark} 
        size="S"
        theme="dark"
        text="DESIGN - frontendmentor.io"
      />
    </div>
  )
}

export default App