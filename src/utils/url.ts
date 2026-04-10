import { HttpError } from "../middleware/errorHandler.js";

export function ensureAllowedRedirectUrl(url: string, allowedHosts: string[]): string {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new HttpError(400, "Invalid redirect URL format");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new HttpError(400, "Redirect URL must be http or https");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!allowedHosts.includes(hostname)) {
    throw new HttpError(400, "Redirect URL host is not allowlisted");
  }

  return parsed.toString();
}
