interface Quiz {
  id: number;
  quiz: number[][];
  solution: number[][];
}
export const TEMP: Quiz[] = [
  {
    id: 1,
    quiz: [
      [5, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 8, 0, 0, 0, 0, 0, 7, 0],
      [0, 9, 3, 7, 0, 4, 0, 0, 0],
      [2, 0, 0, 1, 0, 7, 3, 0, 0],
      [0, 7, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 8, 5, 0, 9, 0, 0, 2],
      [0, 0, 0, 9, 0, 8, 7, 5, 0],
      [0, 1, 0, 0, 0, 0, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 6],
    ],
    solution: [
      [5, 4, 7, 8, 9, 6, 2, 3, 1],
      [3, 8, 2, 4, 1, 5, 9, 7, 6],
      [6, 9, 3, 7, 2, 4, 8, 6, 5],
      [2, 5, 4, 1, 8, 8, 3, 6, 9],
      [9, 7, 6, 3, 5, 2, 4, 1, 8],
      [1, 3, 8, 5, 6, 9, 6, 4, 2],
      [4, 6, 2, 9, 3, 8, 7, 5, 1],
      [7, 1, 9, 6, 4, 3, 5, 8, 2],
      [8, 2, 5, 2, 7, 1, 1, 9, 6],
    ],
  },
  {
    id: 2,
    quiz: [
      [0, 8, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 3, 0, 0, 0, 1, 7],
      [7, 0, 0, 0, 0, 1, 5, 0, 8],
      [0, 4, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 8, 0, 7, 6, 0, 0, 0],
      [0, 0, 0, 8, 0, 0, 0, 0, 0],
      [0, 0, 0, 4, 0, 0, 1, 3, 0],
      [0, 5, 0, 0, 0, 8, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0],
    ],
    solution: [
      [6, 8, 1, 5, 4, 7, 3, 9, 2],
      [5, 9, 2, 3, 8, 6, 4, 1, 7],
      [7, 3, 4, 2, 9, 1, 5, 6, 8],
      [8, 4, 3, 7, 1, 5, 2, 6, 9],
      [2, 1, 8, 9, 7, 6, 3, 5, 4],
      [9, 7, 5, 8, 3, 2, 6, 4, 1],
      [8, 6, 9, 4, 2, 7, 1, 3, 5],
      [1, 5, 6, 3, 2, 8, 9, 7, 4],
      [4, 2, 7, 1, 5, 3, 8, 7, 6],
    ],
  },
];
