export const calculateLevelAndProgress = (xp?: number) => {
  if (!xp)
    return {
      level: 0,
      progress: 0,
      accumulatedXP: 0,
      xpForCurrentLevel: 0,
    };

  let level = 1;
  let xpForCurrentLevel = 100; // XP necessário para o nível atual
  let accumulatedXP = 0; // XP acumulado para níveis anteriores

  while (xp >= xpForCurrentLevel) {
    xp -= xpForCurrentLevel;
    accumulatedXP += xpForCurrentLevel;
    level++;
    xpForCurrentLevel = level * 100; // XP necessário para o próximo nível
  }

  const progress = (xp / xpForCurrentLevel) * 100;

  return { level, progress, accumulatedXP, xpForCurrentLevel };
};
