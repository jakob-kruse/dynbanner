/* eslint-disable @typescript-eslint/no-explicit-any */
let mockEnv: Record<string, string> = {};
let getEnv: jest.SpyInstance;

import * as config from '../src/config';

describe('Config Service', () => {
    beforeAll(() => {
        getEnv = jest.fn((key) => {
            return mockEnv[key];
        })
    })
    
    beforeEach(() => {
        mockEnv = {};
    });

    describe('ensureEnv', () => {
        it('should find the correct value', () => {
            const configKey = 'test-config-key';
            const envKey = 'test-env-key';
            const envValue = 'test-env-value';

            mockEnv[envKey] = envValue;

            const result = config.ensureEnv({
                [configKey]: envKey,
            }, getEnv as any);

            expect(result).toHaveProperty(configKey, envValue);
            expect(getEnv).toHaveBeenCalledWith(envKey);
        });

        it('should throw if the env key does not exist', () => {
            const envKey = 'test-env-key';

            mockEnv.wrongKey = 'test-env-value';

            expect(() =>
                config.ensureEnv({
                    'corre-config-key': envKey,
                }, getEnv as any),
            ).toThrowError(`Missing environment variable ${envKey}`);
        });

        it('should not throw and use the default value if provided', () => {
            const configKey = 'test-config-key';
            const envKey = 'test-env-key';

            const result = config.ensureEnv({
                [configKey]: {
                    key: envKey,
                    type: 'string',
                    defaultValue: 'default-value',
                },
            }, getEnv as any);

            expect(result).toHaveProperty(configKey, 'default-value');
            expect(getEnv).toHaveBeenCalledWith(envKey);
        });

        it('should work with string and object data', () => {
            const configKeyString = 'config-key-string';
            const envKeyString = 'env-key-string';
            const envValueString = 'env-value-string';

            const configKeyObject = 'config-key-object';
            const envKeyObject = 'env-key-object';
            const envValueObject = 'env-value-object';

            mockEnv = {
                [envKeyString]: envValueString,
                [envKeyObject]: envValueObject,
            };

            const result = config.ensureEnv({
                [configKeyString]: envKeyString,
                [configKeyObject]: {
                    key: envKeyObject,
                    type: 'string',
                },
            }, getEnv as any);

            expect(result).toHaveProperty(configKeyString, envValueString);
            expect(result).toHaveProperty(configKeyObject, envValueObject);
        });
    });
});
