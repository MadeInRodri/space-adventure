const SCORE_STORAGE_KEY = "space-adventure-high-scores";

function sortScores(scores) {
  return [...scores].sort(
    (first, second) =>
      second.score - first.score ||
      new Date(second.achievedAt).getTime() -
        new Date(first.achievedAt).getTime(),
  );
}

function isValidScoreEntry(entry) {
  return (
    Number.isSafeInteger(entry?.score) &&
    entry.score >= 0 &&
    typeof entry.achievedAt === "string" &&
    !Number.isNaN(Date.parse(entry.achievedAt))
  );
}

export function createScoreRepository(
  getStorage = () => globalThis.localStorage,
) {
  let savedScores = [];

  return {
    load() {
      try {
        const savedValue = getStorage().getItem(SCORE_STORAGE_KEY);
        if (!savedValue) {
          savedScores = [];
          return { scores: savedScores, error: null };
        }

        const parsedScores = JSON.parse(savedValue);
        if (!Array.isArray(parsedScores)) {
          throw new TypeError(
            "El formato guardado de puntuaciones no es una lista.",
          );
        }

        savedScores = sortScores(parsedScores.filter(isValidScoreEntry)).slice(
          0,
          5,
        );
        return { scores: savedScores, error: null };
      } catch (error) {
        console.error("No se pudieron cargar las puntuaciones guardadas.", error);
        savedScores = [];
        return { scores: savedScores, error };
      }
    },

    save(score) {
      const updatedScores = sortScores([
        ...savedScores,
        { score, achievedAt: new Date().toISOString() },
      ]).slice(0, 5);

      try {
        getStorage().setItem(SCORE_STORAGE_KEY, JSON.stringify(updatedScores));
        savedScores = updatedScores;
        return { scores: savedScores, error: null };
      } catch (error) {
        console.error(
          "No se pudo guardar la puntuación en el almacenamiento local.",
          error,
        );
        return { scores: savedScores, error };
      }
    },
  };
}
