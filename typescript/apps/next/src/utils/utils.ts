export function getRequiredEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable "${name}" is not defined.`);
  }
  return value;
}
