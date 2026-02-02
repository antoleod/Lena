import { possessivesGame } from './games/possessives';
import { problemsGame } from './games/problems';
import { fractionsGame } from './games/fractions';
import { dicteeGame } from './games/dictee';
import { mathBlitzGame } from './games/mathblitz';
import { repartisGame } from './games/repartis';
import { tempsGame } from './games/tempshorloges';
import { tablesGame } from './games/tables';
import { seriesGame } from './games/series';
import { mesuresGame } from './games/mesures';
import { logicGame } from './games/logic';
import { lectureGame } from './games/lecture';
import { motsOutilsGame } from './games/mots-outils';
import { sequencesGame } from './games/sequences';
import { puzzleGame } from './games/puzzle';

export const games = [
  possessivesGame,
  problemsGame,
  fractionsGame,
  dicteeGame,
  mathBlitzGame,
  repartisGame,
  tempsGame,
  tablesGame,
  seriesGame,
  mesuresGame,
  logicGame,
  lectureGame,
  motsOutilsGame,
  sequencesGame,
  puzzleGame
];

export function gamesByGrade(grade) {
  return games.filter(game => game.levels.some(level => level.grade === grade));
}

export function getGame(id) {
  return games.find(game => game.id === id) || null;
}
