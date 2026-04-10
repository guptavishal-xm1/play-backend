type LogLevel = "INFO" | "WARN" | "ERROR";

type LogMeta = Record<string, unknown>;

function log(level: LogLevel, message: string, meta: LogMeta = {}): void {
  const line = {
    level,
    message,
    ...meta,
    ts: new Date().toISOString()
  };
  console.log(JSON.stringify(line));
}

export const logger = {
  info: (message: string, meta?: LogMeta): void => log("INFO", message, meta),
  warn: (message: string, meta?: LogMeta): void => log("WARN", message, meta),
  error: (message: string, meta?: LogMeta): void => log("ERROR", message, meta)
};
