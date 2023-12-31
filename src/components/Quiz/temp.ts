export interface Puzzle {
  id: number;
  puzzle: number[][];
  solution: number[][];
}
export const TEMP: Puzzle[] = [
  {
    id: 1,
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
  {
    id: 2,
    puzzle: [
      [0, 0, 0, 0, 0, 7, 6, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 9, 0],
      [5, 2, 3, 0, 9, 0, 0, 4, 0],
      [2, 3, 1, 0, 8, 9, 4, 0, 7],
      [7, 0, 0, 4, 0, 1, 3, 0, 9],
      [0, 0, 5, 0, 6, 0, 1, 8, 2],
      [0, 8, 0, 0, 7, 2, 0, 0, 0],
      [3, 0, 0, 8, 1, 4, 0, 0, 0],
      [9, 0, 7, 6, 0, 5, 8, 2, 4],
    ],
    solution: [
      [8, 4, 9, 2, 5, 7, 6, 1, 3],
      [1, 7, 6, 3, 4, 8, 2, 9, 5],
      [5, 2, 3, 1, 9, 6, 7, 4, 8],
      [2, 3, 1, 5, 8, 9, 4, 6, 7],
      [7, 6, 8, 4, 2, 1, 3, 5, 9],
      [4, 9, 5, 7, 6, 3, 1, 8, 2],
      [6, 8, 4, 9, 7, 2, 5, 3, 1],
      [3, 5, 2, 8, 1, 4, 9, 7, 6],
      [9, 1, 7, 6, 3, 5, 8, 2, 4],
    ],
  },
];
