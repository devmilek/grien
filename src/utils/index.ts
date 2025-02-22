export const formatDifficulty = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "Łatwy";
    case "medium":
      return "Średniy";
    case "hard":
      return "Trudny";
    default:
      return difficulty;
  }
};

// function to format min to hours and minutes

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  const hoursText =
    hours === 0
      ? ""
      : hours === 1
      ? "1 godzina "
      : hours < 5
      ? `${hours} godziny `
      : `${hours} godzin `;

  const minutesText =
    minutes === 0
      ? hours === 0
        ? "0 minut"
        : ""
      : minutes === 1
      ? "1 minuta"
      : minutes < 5
      ? `${minutes} minuty`
      : `${minutes} minut`;

  return (hoursText + minutesText).trim();
};
