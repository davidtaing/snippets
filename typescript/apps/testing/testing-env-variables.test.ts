import { expect, test } from "vitest";

export function getRequiredEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable "${name}" is not defined.`);
  }
  return value;
}

// cleans up env variables after test
function cleanup(env: NodeJS.ProcessEnv) {
  process.env = { ...env };
}

test("returns string if environment variable is defined", () => {
  const envBackup = process.env;
  process.env.DEFINED_TEST_ENV = "test";
  const name = "DEFINED_TEST_ENV";

  expect(getRequiredEnvVariable(name)).toEqual("test");

  cleanup(envBackup);
});

test("throws error if environment variable is not defined", () => {
  const name = "UNDEFINED_TEST_ENV_VAR";

  expect(() => getRequiredEnvVariable(name)).toThrowError(
    `Required environment variable "${name}" is not defined.`
  );
});
