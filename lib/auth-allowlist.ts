function normalizeAllowedDomains(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((domain) => domain.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEmailDomainAllowed(
  email: string | null | undefined,
  configuredDomains = process.env.ALLOWED_EMAIL_DOMAINS,
): boolean {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const separatorIndex = normalizedEmail.indexOf("@");

  if (
    separatorIndex <= 0 ||
    separatorIndex === normalizedEmail.length - 1 ||
    separatorIndex !== normalizedEmail.lastIndexOf("@")
  ) {
    return false;
  }

  const domain = normalizedEmail.slice(separatorIndex + 1);
  return normalizeAllowedDomains(configuredDomains).has(domain);
}
