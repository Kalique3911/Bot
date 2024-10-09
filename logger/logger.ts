import pino from "pino"

const fileTransport = pino.transport({
    target: "pino/file",
    options: { destination: `${__dirname}/app.log` },
})

export const logger = pino(
    {
        formatters: {
            level: (label) => {
                return { level: label.toUpperCase() }
            },
        },
        base: undefined,
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    fileTransport
)
