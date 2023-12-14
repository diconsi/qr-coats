
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
