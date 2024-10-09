require("dotenv").config()
import { Markup, Telegraf } from "telegraf"
import { getWeather, getForecast } from "./weatherService"
import { get, set } from "./cacheService"
// import  from "./locationService"

const bot = new Telegraf(process.env.token!)

// Начальные данные
let currentCity = "moscow" // Город по умолчанию
let units: "C" | "F" = "C" // Единицы измерения по умолчанию
let userGeolocation: { lat: string; lon: string } | null

// Команда старт
bot.start((ctx) => {
    ctx.reply("Привет!", Markup.keyboard([Markup.button.locationRequest("Поделиться своей геопозицией")]).resize())
    ctx.reply("Я помогу тебе узнать текущий прогноз погоды. Используй команды /weather, /city, /forecast, /change для прогноза или /help для полуения документации по командам")
    let cacheKey = `${currentCity}_${units}_weather`
    set(cacheKey, "")
    cacheKey = `${currentCity}_${units}_forecast`
    set(cacheKey, "")
})

// Команда погоды
bot.command("weather", async (ctx) => {
    try {
        const city = currentCity
        const cacheKey = `${city}_${units}_weather`
        const cachedData = get(cacheKey)

        if (cachedData) {
            ctx.reply(cachedData)
        } else {
            const weatherData = await getWeather(city, units, userGeolocation)
            set(cacheKey, weatherData)
            ctx.reply(weatherData)
        }
    } catch (error) {
        ctx.reply("Возникла какая-то ошибка")
    }
})

// Команда изменения города
bot.command("city", (ctx) => {
    try {
        const newCity = ctx.message.text.split(" ")[1]
        let regEx = /^[a-zA-Z]$/
        if (regEx.test(newCity)) {
            currentCity = newCity
            userGeolocation = null
            ctx.reply(`Город изменен на ${currentCity}.`)
        } else {
            ctx.reply("Пожалуйста, корректно укажите город после команды на английском")
        }
    } catch (error) {
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("forecast", async (ctx) => {
    try {
        const city = currentCity
        const cacheKey = `${city}_${units}_forecast`
        const cachedData = get(cacheKey)
        if (cachedData) {
            ctx.reply(cachedData)
        } else {
            const weatherForecast = await getForecast(city, units, userGeolocation)
            set(cacheKey, weatherForecast)
            ctx.reply(weatherForecast)
        }
    } catch (error) {
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("change", (ctx) => {
    try {
        units = units === "C" ? "F" : "C"
        ctx.reply(`Единица измерения изменена на ${units}°.`)
    } catch (error) {
        ctx.reply("Возникла какая-то ошибка")
    }
})

bot.command("help", (ctx) => {
    ctx.reply(`Справка по командам:
    /weather - даёт прогноз погоды на один день
    /forecast - даёт прогноз погоды на пять дней
    /city *город на английском* - меняет город, для которого даётся прогноз погоды
    /change - меняет единицы измерения температуры с цельсия на фаренгейт или наоборот
    /start - сбрасывает кэш и позволяет указать геолокацию`)
})

bot.on("message", (msg) => {
    try {
        userGeolocation = (msg.update.message as any).location
    } catch (error) {
        msg.reply("Возникла какая-то ошибка")
    }
})

bot.launch()
