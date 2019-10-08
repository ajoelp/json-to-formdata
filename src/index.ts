import isObject from 'lodash/isObject';
import {Options} from "./models/Options";

const isBlob = value => value instanceof Blob;
const isFile = value => value instanceof File;
const isBoolean = value => typeof value === 'boolean';
const isArray = value => Array.isArray(value);
const isNull = value => value === null;
const isUndefined = value => value === undefined;

const processData = (value: any, options: Options, formData: FormData, parent?: string) => {
    const processedKey = parent ? parent : '';

    if (isNull(value) || isUndefined(value)) {
        if(!options.excludeNull){
            formData.append(processedKey, value);
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

    if (isObject(value)) {
        Object.entries(value).forEach(([key, data]) => {
            const computedKey = parent ? `${parent}[${key}]` : key;
            processData(data, options, formData, computedKey);
        });
        return;
    }

    if (isBoolean(value)) {
        formData.append(processedKey, value ? 'true' : 'false');
        return;
    }

    if (isArray(value)) {
        value.forEach((item, index) => {
            const computedKey = `${processedKey}[${options.arrayIndexes ? index : ''}]`;
            processData(item, options, formData, computedKey);
        });
        return;
    }

    formData.append(processedKey, value);
};

const defaultOptions: Options = {
    arrayIndexes: true,
    excludeNull: true,
};

export const objectToFormData = (payload: any, options: Partial<Options> = {}, formData: FormData = new FormData) => {

    if (!payload) return formData;

    options = Object.assign(options, defaultOptions);

    return processData(payload, options as Options, formData);

};
