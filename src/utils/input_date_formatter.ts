const convertInputStringToDate = (date: string): Date => {
  return new Date(date);
};

const convertDateToInputString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export { convertInputStringToDate, convertDateToInputString };
