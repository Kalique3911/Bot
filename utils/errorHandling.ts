import { logger } from "../logger/logger"

export const handleError = (err: Error) => {
    console.log(err?.message)
    logger.error(err?.message)
}
