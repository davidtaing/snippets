export function getRequiredEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable "${name}" is not defined.`);
  }
  return value;
}

import { expect, test } from "vitest";

const envBackup = process.env;

// cleans up env variables after test
function cleanup() {
  process.env = envBackup;
}

function setup(key: string, value: string) {
  process.env[key] = value;
}

test("returns string if environment variable is defined", () => {
  const name = "DEFINED_TEST_ENV";
  const testValue = "test";

  setup(name, testValue);

  expect(getRequiredEnvVariable(name)).toEqual("test");

  cleanup();
});

test("throws error if environment variable is not defined", () => {
  const name = "UNDEFINED_TEST_ENV_VAR";

  expect(() => getRequiredEnvVariable(name)).toThrowError(
    `Required environment variable "${name}" is not defined.`
  );
});
