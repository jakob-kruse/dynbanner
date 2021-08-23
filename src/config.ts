export type EnvKeyType = 'string' | 'number' | 'boolean';
export type EnvConfigValue = string | number | boolean;
export type EnvData =
  | { key: string; type?: EnvKeyType; defaultValue?: EnvConfigValue }
  | string;

export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

export function ensureEnv<Target>(
  template: Record<keyof Target, EnvData>,
  envFn: typeof getEnv = getEnv,
): Target {
  const result: Record<string, EnvConfigValue> = {};

  const transforms: Record<EnvKeyType, (v: string) => EnvConfigValue> = {
    string: (v: string) => v.trim(),
    number: (v: string) => parseInt(v, 10),
    boolean: (v: string) => v.toLowerCase() === 'true',
  };

  for (const [configKey, _envData] of Object.entries(template)) {
    const envData = _envData as EnvData;

    let transform = transforms['string'];
    let envKey;
    let envValue: string | undefined = undefined;

    if (typeof envData === 'string') {
      envKey = envData;
      envValue = envFn(envKey);
    } else {
      envKey = envData.key;
      envValue = envFn(envKey);

      if (envValue === undefined && envData.defaultValue !== undefined) {
        result[configKey] = envData.defaultValue;
        continue;
      }
      transform = transforms[envData.type ?? 'string'];
    }

    if (envValue === undefined) {
      throw new Error(`Missing environment variable ${envKey}`);
    }

    result[configKey] = transform(envValue);
  }

  return result as unknown as Target;
}
