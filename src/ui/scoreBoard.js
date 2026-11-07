export function createScoreBoard(root = document.querySelector("#app")) {
  const doc = root.ownerDocument;
  // Limita las consultas al elemento de esta aplicación.
  const scoresList = root.querySelector("#scores-list");
  const personalBestLabel = root.querySelector("#personal-best");
  const statsStatus = root.querySelector("#stats-status");

  function render(scores) {
    scoresList.replaceChildren();
    personalBestLabel.textContent = String(scores[0]?.score ?? 0).padStart(
      5,
      "0",
    );

    if (scores.length === 0) {
      // Informa el estado vacío sin dejar filas antiguas en la tabla.
      const row = doc.createElement("tr");
      const cell = doc.createElement("td");
      cell.colSpan = 3;
      cell.className = "empty-scores";
      cell.textContent = "AÚN NO HAY MISIONES REGISTRADAS";
      row.append(cell);
      scoresList.append(row);
      return;
    }

    const dateFormatter = new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    scores.forEach((entry, index) => {
      const row = doc.createElement("tr");
      const rank = doc.createElement("td");
      const score = doc.createElement("td");
      const date = doc.createElement("td");

      rank.textContent = String(index + 1).padStart(2, "0");
      score.textContent = String(entry.score).padStart(5, "0");
      date.textContent = dateFormatter.format(new Date(entry.achievedAt));
      score.className = "score-value";
      row.append(rank, score, date);
      scoresList.append(row);
    });
  }

  return {
    render,
    setStatus(message) {
      statsStatus.textContent = message;
    },
  };
}
