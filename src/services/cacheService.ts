import NodeCache from "node-cache"
const cache = new NodeCache({ stdTTL: 600 }) // Кэшируем на 10 минут

export const get = (key: string): string | undefined => cache.get(key)

export const set = (key: string, value: string) => cache.set(key, value)
