import { create } from "zustand";

import type { TActions, TGameState, TUsers } from "./types";
import { MAX_COL_INDEX, MAX_ROW_INDEX, MIN_ROW_WIN_INDEX, QUANTITY_CELL } from "./constants";

export const useGameState = create<TGameState & TActions>()((set, get) => ({
  activeGame: false,
  activeUser: 'one',
  isWin: false,
  isDeadend: false,
  winnerUser: null,
  countOccupiedCells: 0,
  countWinsOneUser: 0,
  countWinsTwoUser: 0,

  board: [
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
  ],
  winnerCells: null,

  valueMoveTimer: 30,
  intervalId: null,
  timerId: null,

  isGameRulesMode: false,

  toggleActiveUser: () => {
    get().stopMoveTimer()
    set(state => ({ activeUser: state.activeUser === 'one' ? 'two' : 'one' }))
    get().startMoveTimer()
  },

  startGame: () => { 
    set(() => ({ activeGame: true })) 
    get().startMoveTimer()
  },
  restartGame: () => {
    get().stopMoveTimer()
    set(() => ({
        isWin: false,
        isDeadend: false,
        winnerUser: null,
        board: [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ],
        winnerCells: null,
        valueMoveTimer: 30,
    }))
    get().startMoveTimer()
  },
  pauseGame: () => { 
    get().pauseMoveTimer()
  },
  continueGame: () => { 
    get().startMoveTimer()
  },
  stopGame: () => {
    set(() => ({
        isWin: false,
        isDeadend: false,
        winnerUser: null,
        countWinsOneUser: 0,
        countWinsTwoUser: 0,
        board: [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
        ],
        winnerCells: null,
        valueMoveTimer: 30,
    }))
    get().stopMoveTimer()
    set(() => ({ activeGame: false })) 
  },
  winGame: () => {
    get().stopMoveTimer()
    set(state => ({
        isWin: true,
        winnerUser: state.activeUser,
    }))
  },
  deadendGame: () => {
    get().stopMoveTimer()
    set(() => ({
        isDeadend: true
    }))
  },

  move: (colIndex) => {
    if (get().isWin || get().isDeadend) return

    get().checkDeadend()

    if (!get().checkAccessMove(colIndex)) return

    const board = get().board

    let lastEmptyCellIndex = -1
    for (const cell of board[colIndex]) {
      if (cell) break
      lastEmptyCellIndex += 1
    }

    set(state => ({ countOccupiedCells: state.countOccupiedCells + 1 }))

    const newBoard = [...board]
    newBoard[colIndex][lastEmptyCellIndex] = get().activeUser

    set(() => ({ board: newBoard }))

    get().checkWin(colIndex, lastEmptyCellIndex)
    
    if (!get().isWin) {
      get().toggleActiveUser()
    } else {
      get().stopMoveTimer()
      if (get().activeUser === 'one') {
        set(state => ({ countWinsOneUser: state.countWinsOneUser + 1 }))
      } else {
        set(state => ({ countWinsTwoUser:  state.countWinsTwoUser + 1 }))
      }
    }
  },
  checkWin: (colIndex, cellIndex) => {
    get().checkVerticalWin(colIndex, cellIndex)
    get().checkHorizontalWin(colIndex, cellIndex)
    get().checkDiagonalWin(colIndex, cellIndex)
  },
  checkVerticalWin: (colIndex, cellIndex) => {
    if (cellIndex === MAX_ROW_INDEX || cellIndex > MIN_ROW_WIN_INDEX) return

    const board = get().board

    let streak = 1
    let tmpIndex = cellIndex + 1
    while (tmpIndex <= MAX_ROW_INDEX) {
      if (streak === 4) break

      const tmpCell = board[colIndex][tmpIndex]

      if (tmpCell !== get().activeUser) break

      streak += 1
      tmpIndex += 1
    }

    if (streak === 4) get().winGame()
  },
  checkHorizontalWin: (colIndex, cellIndex) => {
    const board = get().board

    const row: Array<TUsers | null> = []
    board.forEach((col) => row.push(col[cellIndex]))

    let streak = 1
    let tmpRgIndex = colIndex + 1
    let tmpLfIndex = colIndex - 1
    while (tmpRgIndex <= MAX_COL_INDEX) {
      if (streak === 4) break

      const tmpCell = row[tmpRgIndex]

      if (tmpCell !== get().activeUser) break

      streak += 1
      tmpRgIndex += 1
    }
    while (tmpLfIndex >= 0) {
      if (streak === 4) break

      const tmpCell = row[tmpLfIndex]

      if (tmpCell !== get().activeUser) break

      streak += 1
      tmpLfIndex -= 1
    }

    if (streak === 4) get().winGame()
  },
  checkDiagonalWin: (colIndex, cellIndex) => {
    const board = get().board

    const diagonalRg: Array<TUsers | null> = []
    const diagonalLf: Array<TUsers | null> = []

    let middle = false
    board.forEach((col, i) => {
      if (i === colIndex) {
        diagonalRg.push(col[cellIndex])
        diagonalLf.push(col[cellIndex])
        middle = true
        return
      }

      if (!middle) {
        const tmpCol = colIndex - i
        const tmpCellRg = cellIndex - tmpCol
        const tmpCellLf = cellIndex + tmpCol
        if (tmpCellRg >= 0) {
          diagonalRg.push(col[tmpCellRg])
        } else {
          diagonalRg.push(null)
        }
        if (tmpCellLf <= MAX_ROW_INDEX) {
          diagonalLf.push(col[tmpCellLf])
        } else {
          diagonalLf.push(null)
        }
      } else {
        const tmpCol = i - colIndex
        const tmpCellRg = cellIndex + tmpCol
        const tmpCellLf = cellIndex - tmpCol
        if (tmpCellRg <= MAX_ROW_INDEX) {
          diagonalRg.push(col[tmpCellRg])
        } else {
          diagonalRg.push(null)
        }
        if (tmpCellLf >= 0) {
          diagonalLf.push(col[tmpCellLf])
        } else {
          diagonalLf.push(null)
        }
      }
    })

    let streakRg = 1
    let tmpRgRgIndex = colIndex + 1
    let tmpRgLfIndex = colIndex - 1
    while (tmpRgRgIndex <= MAX_COL_INDEX) {
      if (streakRg === 4) break

      const tmpCell = diagonalRg[tmpRgRgIndex]

      if (tmpCell !== get().activeUser) break

      streakRg += 1
      tmpRgRgIndex += 1
    }
    while (tmpRgLfIndex >= 0) {
      if (streakRg === 4) break

      const tmpCell = diagonalRg[tmpRgLfIndex]

      if (tmpCell !== get().activeUser) break

      streakRg += 1
      tmpRgLfIndex -= 1
    }

    let streakLf = 1
    let tmpLfRgIndex = colIndex + 1
    let tmpLfLfIndex = colIndex - 1
    while (tmpLfRgIndex <= MAX_COL_INDEX) {
      if (streakLf === 4 || streakRg === 4) break

      const tmpCell = diagonalLf[tmpLfRgIndex]

      if (tmpCell !== get().activeUser) break

      streakLf += 1
      tmpLfRgIndex += 1
    }
    while (tmpLfLfIndex >= 0) {
      if (streakLf === 4 || streakRg === 4) break

      const tmpCell = diagonalLf[tmpLfLfIndex]

      if (tmpCell !== get().activeUser) break

      streakLf += 1
      tmpLfLfIndex -= 1
    }

    if (streakRg === 4 || streakLf === 4) get().winGame()
  },
  checkAccessMove: (colIndex) => {
    return Boolean(!get().board[colIndex].at(0))
  },
  checkDeadend: () => {
    if (get().countOccupiedCells === QUANTITY_CELL) get().deadendGame()
  },

  startMoveTimer: () => {
    set(() => ({
      intervalId: setInterval(() => {
        set(state => ({ valueMoveTimer: state.valueMoveTimer - 1 }))
      }, 1000),
    }))

    set(state => ({
      timerId: setTimeout(() => {
        get().toggleActiveUser()
      }, state.valueMoveTimer * 1000),
    }))
  },
  pauseMoveTimer: () => {
    if (!get().intervalId || !get().timerId) return
    clearInterval(get().intervalId as number);
    clearTimeout(get().timerId as number)
    set(() => ({
      timerId: null,
      intervalId: null,
    }))
  },
  stopMoveTimer: () => {
    if (!get().intervalId || !get().timerId) return
    clearInterval(get().intervalId as number);
    clearTimeout(get().timerId as number)
    set(() => ({
      timerId: null,
      intervalId: null,
      valueMoveTimer: 30,
    }))
  },

  toggleGameRulesMode: () => {
    set(state => ({ isGameRulesMode: !state.isGameRulesMode }))
  },
}))