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

export const loadAbort = () => {
  const controller = new AbortController();
  return controller;
};

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

interface EvaluatedStatus {
  [key: string]: string;
}

interface Errors {
  [key: string]: string;
}

export const stateValidator = (
  evaluatedStatus: EvaluatedStatus,
  validationRules: ValidationRules
): Errors => {
  const newErrors: Errors = Object.keys(evaluatedStatus).reduce((acc, key) => {
    if (!validationRules[key](evaluatedStatus[key])) {
      return {
        ...acc,
        [key]: `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`,
      };
    }
    return acc;
  }, {});

  return newErrors;
};

export const fileClon = (file: Blob, name: string, type?: string): File => {
  return new File([file], name, { type: type || file.type });
};
