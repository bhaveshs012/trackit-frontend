const convertInputStringToDate = (date: string): Date => {
  return new Date(date);
};

const convertDateToInputString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const convertISODateToString = (isoDate: string): string => {
  const date = new Date(isoDate);

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long", // Day of the week
    day: "2-digit", // Day with leading zero
    month: "2-digit", // Month with leading zero
    year: "numeric", // Full year
  });
  const parts = formatter.formatToParts(date);

  // Extract parts
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  const weekday = parts.find((part) => part.type === "weekday")?.value;

  // Combine into the desired format
  const formattedDate = `${day}-${month}-${year}, ${weekday}`;
  return formattedDate;
};

export {
  convertInputStringToDate,
  convertDateToInputString,
  convertISODateToString,
};
