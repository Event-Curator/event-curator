import { createLogger, transports, format } from 'winston';

const log = createLogger({
    transports: [new transports.Console()],
    level: "debug",
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    )
})

export { log }