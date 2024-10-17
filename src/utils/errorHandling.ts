import { logger } from "../../logger"

export const handleError = (err: Error) => {
    console.log(err?.message)
    logger.error(err?.message)
}
