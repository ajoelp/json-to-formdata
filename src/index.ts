import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import Options from './models/Options';

const isBlob = (value) => value instanceof Blob;
const isFile = (value) => value instanceof File;
const isBoolean = (value) => typeof value === 'boolean';
const isNull = (value) => value === null;
const isUndefined = (value) => value === undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processData = (value: any, options: Options, formData: FormData, parent?: string) => {
  const processedKey = parent || '';

  if (isNull(value) || isUndefined(value)) {
    if (!options.excludeNull) {
      formData.append(processedKey, '');
    }
    return;
  }

  if (isFile(value)) {
    formData.append(processedKey, value);
    return;
  }

  if (isBlob(value)) {
    formData.append(processedKey, value);
    return;
  }

  if (isArray(value)) {
    value.forEach((item, index) => {
      const computedKey = `${processedKey}[${options.arrayIndexes ? index : ''}]`;
      processData(item, options, formData, computedKey);
    });
    return;
  }

  if (isObject(value)) {
    Object.entries(value).forEach(([key, data]) => {
      let computedKey = key;
      if (parent) {
        computedKey = options.useDotSeparator
          ? `${parent}.${key}`
          : `${parent}[${key}]`;
      }
      processData(data, options, formData, computedKey);
    });
    return;
  }

  if (isBoolean(value)) {
    formData.append(processedKey, value ? 'true' : 'false');
    return;
  }

  formData.append(processedKey, value);
};

const defaultOptions: Options = {
  arrayIndexes: true,
  excludeNull: true,
  useDotSeparator: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectToFormData = (payload: any, options: Partial<Options> = {}, formData: FormData = new FormData()) => {
  if (!payload) return formData;

  options = Object.assign({}, defaultOptions, options);

  processData(payload, options as Options, formData);

  return formData;
};

export default objectToFormData;
