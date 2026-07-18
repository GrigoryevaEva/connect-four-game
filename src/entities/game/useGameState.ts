import { create } from "zustand";

import type { TActions, TCell, TGameState, TUsers } from "./types";
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
  winnerCells: [],

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
        winnerCells: [],
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
        winnerCells: [],
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
    if (get().isWin) return
    get().checkHorizontalWin(colIndex, cellIndex)
    if (get().isWin) return
    get().checkDiagonalWin(colIndex, cellIndex)
  },
  checkVerticalWin: (colIndex, cellIndex) => {
    if (cellIndex === MAX_ROW_INDEX || cellIndex > MIN_ROW_WIN_INDEX) return

    const board = get().board

    const winnerCells: TCell[] = [{
      colIndex: colIndex,
      cellIndex: cellIndex,
    }]

    let streak = 1
    let tmpIndex = cellIndex + 1
    while (tmpIndex <= MAX_ROW_INDEX) {
      if (streak === 4) break

      const tmpCell = board[colIndex][tmpIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: colIndex,
        cellIndex: tmpIndex,
      })
      streak += 1
      tmpIndex += 1
    }

    if (streak === 4) {
      get().winGame()
      set(() => ({ winnerCells: winnerCells }))
    }
  },
  checkHorizontalWin: (colIndex, cellIndex) => {
    const board = get().board

    const row: Array<TUsers | null> = []
    board.forEach((col) => row.push(col[cellIndex]))

    const winnerCells: TCell[] = [{
      colIndex: colIndex,
      cellIndex: cellIndex,
    }]

    let streak = 1
    let tmpRgIndex = colIndex + 1
    while (tmpRgIndex <= MAX_COL_INDEX) {
      if (streak === 4) break

      const tmpCell = row[tmpRgIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: tmpRgIndex,
        cellIndex: cellIndex,
      })
      streak += 1
      tmpRgIndex += 1
    }

    let tmpLfIndex = colIndex - 1
    while (tmpLfIndex >= 0) {
      if (streak === 4) break

      const tmpCell = row[tmpLfIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: tmpLfIndex,
        cellIndex: cellIndex,
      })
      streak += 1
      tmpLfIndex -= 1
    }

    if (streak === 4) {
      get().winGame()
      set(() => ({ winnerCells: winnerCells }))    
    }
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

    let winnerCells: TCell[] = [{
      colIndex: colIndex,
      cellIndex: cellIndex,
    }]

    let streakRg = 1
    let tmpRgRgColIndex = colIndex + 1
    let tmpRgRgCellIndex = cellIndex + 1
    while (tmpRgRgColIndex <= MAX_COL_INDEX) {
      if (streakRg === 4) break

      const tmpCell = diagonalRg[tmpRgRgColIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: tmpRgRgColIndex,
        cellIndex: tmpRgRgCellIndex,
      })
      streakRg += 1
      tmpRgRgColIndex += 1
      tmpRgRgCellIndex += 1
    }

    let tmpRgLfColIndex = colIndex - 1
    let tmpRgLfCellIndex = cellIndex - 1
    while (tmpRgLfColIndex >= 0) {
      if (streakRg === 4) break

      const tmpCell = diagonalRg[tmpRgLfColIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: tmpRgLfColIndex,
        cellIndex: tmpRgLfCellIndex,
      })
      streakRg += 1
      tmpRgLfColIndex -= 1
      tmpRgLfCellIndex -= 1
    }

    if (streakRg === 4) {
      get().winGame()
      set(() => ({ winnerCells: winnerCells }))
      return   
    } else {
      winnerCells = [{
        colIndex: colIndex,
        cellIndex: cellIndex,
      }]
    }

    let streakLf = 1
    let tmpLfRgIndex = colIndex + 1
    let tmpLfRgCellIndex = cellIndex - 1
    while (tmpLfRgIndex <= MAX_COL_INDEX) {
      if (streakLf === 4 || streakRg === 4) break

      const tmpCell = diagonalLf[tmpLfRgIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: tmpLfRgIndex,
        cellIndex: tmpLfRgCellIndex,
      })
      streakLf += 1
      tmpLfRgIndex += 1
      tmpLfRgCellIndex -= 1
    }

    let tmpLfLfIndex = colIndex - 1
    let tmpLfLfCellIndex = cellIndex + 1
    while (tmpLfLfIndex >= 0) {
      if (streakLf === 4 || streakRg === 4) break

      const tmpCell = diagonalLf[tmpLfLfIndex]

      if (tmpCell !== get().activeUser) break

      winnerCells.push({
        colIndex: tmpLfLfIndex,
        cellIndex: tmpLfLfCellIndex,
      })
      streakLf += 1
      tmpLfLfIndex -= 1
      tmpLfLfCellIndex += 1
    }

    if (streakLf === 4) {
      get().winGame()
      set(() => ({ winnerCells: winnerCells }))
    }
  },
  checkAccessMove: (colIndex) => {
    return Boolean(!get().board[colIndex].at(0))
  },
  checkDeadend: () => {
    if (get().countOccupiedCells === QUANTITY_CELL) get().deadendGame()
  },

  checkCellIsWin: (colIndex, cellIndex) => {
    return get().winnerCells.some(cell => (
      cell.colIndex === colIndex && cell.cellIndex === cellIndex
    ));
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