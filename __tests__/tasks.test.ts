import { getCoordinates } from "../services/locationService"
import { getForecast, getWeather } from "../services/weatherService"
import { get, set } from "../services/cacheService"

describe("weather service", () => {
    let regEx = /^(?=.*°)[a-zA-Zа-яА-ЯёЁ0-9\s\+\-\:°,F\.\n]+$/m
    describe("get weather", () => {
        test("should return string with numbers", async () => {
            let res = await getWeather("moscow", "C", null)
            expect(regEx.test(res as string)).toBe(true)
        }, 30000)
    })
    describe("get weather", () => {
        test("should return string", async () => {
            let res = await getForecast("moscow", "C", null)
            expect(regEx.test(res as string)).toBe(true)
        }, 30000)
    })
})

describe("location service", () => {
    describe("get weather", () => {
        test("should return moscow coordinates", async () => {
            let res = await getCoordinates("moscow")
            expect(60 > res?.lat && res?.lat > 50).toBe(true)
            expect(42 > res?.lon && res?.lon > 32).toBe(true)
        }, 30000)
    })
})

describe("location service", () => {
    describe("set weather", () => {
        test("should return string with numbers", async () => {
            let res = set("cacheKey", "weather")
            expect(res).toBe(true)
        }, 30000)
    })
    describe("get weather", () => {
        test("should return string", async () => {
            let res = get("cacheKey")
            expect(res).toBe("weather")
        }, 30000)
    })
})
