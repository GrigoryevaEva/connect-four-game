import { useShallow } from "zustand/shallow";
import { useGameState } from "../entities/game";
import { Game } from "../pages/Game";
import { Menu } from "../pages/Menu";
import { Rules } from "../pages/Rules";

export const App = () => {

  const { 
    activeGame,
    isGameRulesMode,
    } = useGameState(useShallow((state) => ({
    activeGame: state.activeGame,
    isGameRulesMode: state.isGameRulesMode
  })))

  return (
    <div>
      {
        activeGame
          ? <Game />
          : isGameRulesMode
            ? <Rules />
            : <Menu />
      }
    </div>
  )
}

export default App