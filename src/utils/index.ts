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

export const getR2ImageSrc = (id: string) => {
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

  return `${r2PublicUrl}/${id}.webp`;
};

export const getDomainFromUrl = (url: string) => {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch {
    return url;
  }
};

export function getInitials(value: string) {
  const words = value
    .trim()
    .split(/[\s-]+/)
    .filter((word) => word.length > 0);

  const initials = words
    .slice(0, 2)
    .map((word, index, array) =>
      array.length === 1 ? word.slice(0, 2) : word[0]
    )
    .join("")
    .toUpperCase();

  return initials;
}
