export const getDateMinutesAgo = (minutes: number) => {
  const newDate = new Date();
  newDate.setUTCSeconds(newDate.getUTCSeconds() - (minutes * 60));
  return newDate;
};
