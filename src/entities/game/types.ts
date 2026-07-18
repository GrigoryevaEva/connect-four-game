export type TGameState = {
  readonly activeGame: boolean
  readonly activeUser: TUsers
  readonly isWin: boolean
  readonly isDeadend: boolean
  readonly winnerUser: TUsers | null
  readonly countOccupiedCells: number
  readonly countWinsOneUser: number
  readonly countWinsTwoUser: number

  readonly board: Array<Array<TUsers | null>>
  readonly winnerCells: TCell[]

  readonly valueMoveTimer: number
  readonly intervalId: number | null
  readonly timerId: number | null

  readonly isGameRulesMode: boolean
}

export type TActions = {
  readonly toggleActiveUser: () => void

  readonly startGame: () => void
  readonly restartGame: () => void
  readonly pauseGame: () => void
  readonly continueGame: () => void
  readonly stopGame: () => void
  readonly winGame: () => void
  readonly deadendGame: () => void

  readonly move: (colIndex: number) => void
  readonly checkWin: (colIndex: number, cellIndex: number) => void
  readonly checkVerticalWin: (colIndex: number, cellIndex: number) => void
  readonly checkHorizontalWin: (colIndex: number, cellIndex: number) => void
  readonly checkDiagonalWin: (colIndex: number, cellIndex: number) => void
  readonly checkAccessMove: (colIndex: number) => boolean
  readonly checkDeadend: () => void

  readonly checkCellIsWin: (colIndex: number, cellIndex: number) => boolean

  readonly startMoveTimer: () => void
  readonly pauseMoveTimer: () => void
  readonly stopMoveTimer: () => void

  readonly toggleGameRulesMode: () => void
}

export type TUsers = 'one' | 'two'

export type TCell = {
    colIndex: number
    cellIndex: number
}