require("dotenv").config()
import { Markup, Telegraf } from "telegraf"
import { getWeather, getForecast } from "./services/weatherService"
import { get, set } from "./services/cacheService"
import { handleError } from "./utils/errorHandling"

let bot = new Telegraf(process.env.token!)

let currentCity = "moscow"
let units: "C" | "F" = "C"
let userGeolocation: { lat: string; lon: string } | null

bot.start((ctx) => {
    ctx.reply("Привет!", Markup.keyboard([Markup.button.locationRequest("Поделиться своей геопозицией")]).resize())
    ctx.reply("Я помогу тебе узнать текущий прогноз погоды. Используй команды /weather, /city, /forecast, /change для прогноза или /help для полуения справки по командам")
    let cacheKey = `${currentCity}_${units}_weather`
    set(cacheKey, "")
    cacheKey = `${currentCity}_${units}_forecast`
    set(cacheKey, "")
})

bot.command("weather", async (ctx) => {
    try {
        let city = currentCity
        let cacheKey = `${city}_${units}_weather`
        let cachedData = get(cacheKey)

        if (cachedData) {
            ctx.reply(cachedData)
        } else {
            let weatherData = await getWeather(city, units, userGeolocation)
            if (!weatherData) {
                ctx.reply("Невозможно получить данные по указанному городу")
                return
            }
            set(cacheKey, weatherData)
            ctx.reply(weatherData)
        }
    } catch (error) {
        handleError(error as Error)
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("city", (ctx) => {
    try {
        let newCity = ctx.message.text.split(" ")[1]
        let regEx = /^[a-z]+$/gi
        if (regEx.test(newCity) && newCity) {
            currentCity = newCity
            userGeolocation = null
            ctx.reply(`Город изменен на ${currentCity}`)
        } else {
            ctx.reply("Пожалуйста, корректно укажите город после команды на английском")
        }
    } catch (error) {
        handleError(error as Error)
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("forecast", async (ctx) => {
    try {
        let city = currentCity
        let cacheKey = `${city}_${units}_forecast`
        let cachedData = get(cacheKey)
        if (cachedData) {
            ctx.reply(cachedData)
        } else {
            let weatherForecast = await getForecast(city, units, userGeolocation)
            if (!weatherForecast) {
                ctx.reply("Невозможно получить данные по указанному городу")
                return
            }
            set(cacheKey, weatherForecast)
            ctx.reply(weatherForecast)
        }
    } catch (error) {
        handleError(error as Error)
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("change", (ctx) => {
    try {
        units = units === "C" ? "F" : "C"
        ctx.reply(`Единицы измерения изменены на ${units === "F" ? "имперские" : "метрические"}`)
    } catch (error) {
        handleError(error as Error)
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("help", (ctx) => {
    try {
        ctx.reply(`Справка по командам:
    /weather - даёт прогноз погоды на один день
    /forecast - даёт прогноз погоды на пять дней
    /city *город на английском* - меняет город, для которого даётся прогноз погоды
    /change - меняет единицы измерения с метрических на имперские и наоборот
    /start - сбрасывает кэш и позволяет указать геолокацию`)
    } catch (error) {
        handleError(error as Error)
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command(/.+/, (ctx) => ctx.reply("Некорректная команда, воспользуетесь /help для получения списка команд"))

bot.on("message", (msg) => {
    try {
        userGeolocation = (msg.update.message as any).location
    } catch (error) {
        handleError(error as Error)
        msg.reply("Возникла какая-то ошибка")
    }
})

bot.launch()
