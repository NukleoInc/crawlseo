import { describe, expect, it } from "vitest";
import { isEmailDomainAllowed } from "./auth-allowlist";

describe("isEmailDomainAllowed", () => {
  const allowedDomains = "example.com, second.example";

  it.each([
    "person@example.com",
    "person@second.example",
    "PERSON@EXAMPLE.COM",
    " person@second.example ",
  ])("allows an exact configured domain: %s", (email) => {
    expect(isEmailDomainAllowed(email, allowedDomains)).toBe(true);
  });

  it("normalizes whitespace and case in the configured domains", () => {
    expect(
      isEmailDomainAllowed("person@example.com", " SECOND.EXAMPLE, Example.COM "),
    ).toBe(true);
  });

  it.each([
    "person@unlisted.example",
    "person@sub.example.com",
    "person@notexample.com",
    "person@example.com.attacker.test",
  ])("rejects an unconfigured or lookalike domain: %s", (email) => {
    expect(isEmailDomainAllowed(email, allowedDomains)).toBe(false);
  });

  it.each([undefined, null, "", "person", "@example.com", "person@", "a@b@example.com"])(
    "rejects a missing or malformed email: %s",
    (email) => {
      expect(isEmailDomainAllowed(email, allowedDomains)).toBe(false);
    },
  );

  it.each([undefined, "", " , "])(
    "fails closed when ALLOWED_EMAIL_DOMAINS is missing or empty: %s",
    (configuredDomains) => {
      expect(isEmailDomainAllowed("person@example.com", configuredDomains)).toBe(false);
    },
  );
});
