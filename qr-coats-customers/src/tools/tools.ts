export const formattedDate = (dateTimeString: string) => {
  const formattedDate = new Date(dateTimeString).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formattedDate;
};


export const loadAbort=()=>{
  const controller = new AbortController();
  return controller;
}