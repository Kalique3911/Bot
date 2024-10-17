import puppeteer from "puppeteer"
import { getCoordinates } from "./locationService"

export const getWeather = async (city: string, units: string, geolocation: { lat: string; lon: string } | null) => {
    let browser = await puppeteer.launch({
        headless: true,
    })
    let page = await browser.newPage()
    let res = geolocation ? geolocation : await getCoordinates(city)
    let lat, lon
    if (res) {
        lat = res.lat
        lon = res.lon
    } else {
        return null
    }

    await page.goto(`https://yandex.ru/pogoda?lat=${lat}&lon=${lon}`)

    await page.waitForSelector(".temp__value, .link__condition, .title, .wind-speed, .term.term_orient_v.fact__humidity, .term.term_orient_v.fact__pressure ")
    let tempElement = await page.$(".temp__value")
    let condElement = await page.$(".link__condition")
    let locElement = await page.$(".title")
    let windElement = await page.$(".wind-speed")
    let humidElement = await page.$(".term.term_orient_v.fact__humidity")
    let pressElement = await page.$(".term.term_orient_v.fact__pressure")

    let temperature = await page.evaluate((tempElement) => tempElement?.textContent, tempElement)
    temperature = units === "F" ? Math.round((Number(temperature) * 9) / 5 + 32).toString() : temperature
    let condition = await page.evaluate((condElement) => condElement?.textContent, condElement)
    let location = await page.evaluate((locElement) => locElement?.textContent, locElement)
    let wind = await page.evaluate((windElement) => windElement?.textContent, windElement)

    wind =
        units === "F"
            ? Math.round(
                  Number(
                      wind
                          ?.split("")
                          .map((el) => {
                              if (el === ",") {
                                  return "."
                              } else {
                                  return el
                              }
                          })
                          .join("")
                  ) * 1.94
              ).toString() + " узлов"
            : wind + " м/c"
    let humidity = await page.evaluate((humidElement) => humidElement?.textContent, humidElement)
    let pressure = await page.evaluate((pressElement) => pressElement?.textContent, pressElement)
    pressure = units === "F" ? (Math.round((Number(pressure?.slice(0, 3)) / 25.4) * 100) / 100).toString() + " дюймов рт. ст." : pressure?.slice(0, 3) + " мм рт. ст."

    return `${location}: ${temperature}°${units}, ${condition}
ветер: ${wind}, влажность: ${humidity?.slice(humidity.length - 5, humidity.length - 2)}%, давление: ${pressure}`
}

export const getForecast = async (city: string, units: string, geolocation: { lat: string; lon: string } | null) => {
    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    let res = geolocation ? geolocation : await getCoordinates(city)
    let lat, lon
    if (res) {
        lat = res.lat
        lon = res.lon
    } else {
        return null
    }

    await page.goto(`https://yandex.ru/pogoda?lat=${lat}&lon=${lon}`)

    await page.waitForSelector(".link.link_theme_normal.text.forecast-briefly__day-link.i-bem.link_js_inited, .title ")
    let forecastElements = await page.$$(".link.link_theme_normal.text.forecast-briefly__day-link.i-bem")
    let locElement = await page.$(".title")
    let forecast = forecastElements.map(async (el) => await page.evaluate((el) => el?.textContent, el))
    let location = await page.evaluate((locElement) => locElement?.textContent, locElement)

    let aka = await Promise.all(forecast.slice(2, 7)).then((values) => {
        return values
    })
    // console.log(aka)
    let ok = aka.map((el, ind) => {
        let arr = el?.split("")

        if (units === "F") {
            let firstTemp = ""
            let firstTempInd = { start: 0, end: 0 }
            let secondTemp = ""
            let secondTempInd = { start: 0, end: 0 }
            let cond = false
            if (ind === 4) console.log(arr)
            for (let i = 0; i < arr!.length; i++) {
                if ((!Number.isNaN(Number(arr![i])) || arr![i] === "+" || arr![i] === "-") && i > 6) {
                    if (!cond) {
                        if ((arr![i] === "+" || arr![i] === "-") && firstTemp) {
                            secondTemp = secondTemp.concat("", arr![i])
                            firstTempInd.end = i - 1
                            secondTempInd.start = i
                            cond = true
                        } else {
                            if (!firstTemp) {
                                firstTempInd.start = i
                            }
                            firstTemp = firstTemp.concat("", arr![i])
                        }
                    } else {
                        secondTemp = secondTemp.concat("", arr![i])
                    }
                } else {
                    if (secondTempInd.end) {
                        break
                    } else if (secondTemp) {
                        secondTempInd.end = i - 1
                    }
                }
            }

            if (ind === 4) console.log(firstTemp)
            if (ind === 4) console.log(firstTempInd.end.toString() + " " + firstTempInd.start.toString())
            if (ind === 4) console.log(secondTemp)
            if (ind === 4) console.log(secondTempInd.end.toString() + " " + secondTempInd.start.toString())
            let firstExp = Math.round((Number(firstTemp) * 9) / 5 + 32)
            if (ind === 4) console.log(firstExp)
            let secondExp = Math.round((Number(secondTemp) * 9) / 5 + 32)
            let diff = (firstExp > 0 ? firstExp.toString().length + 1 : firstExp.toString().length) + firstTempInd.start - firstTempInd.end - 1
            console.log(diff)
            arr?.splice(firstTempInd.start, firstTempInd.end - firstTempInd.start + 1, firstExp > 0 ? "+" + firstExp.toString() : firstExp.toString())
            if (ind === 4) console.log(arr)
            arr = arr?.join("").split("")
            if (ind === 4) console.log(arr)
            arr?.splice(secondTempInd.start + diff, secondTempInd.end - secondTempInd.start + 1, secondExp > 0 ? "+" + secondExp.toString() : secondExp.toString())
            arr = arr?.join("").split("")
            if (ind === 4) console.log(arr)
        }

        let marr = arr?.map((e, i) => {
            if ((!Number.isNaN(Number(e)) || e === "+" || e === "-") && e !== " ") {
                let prev = arr[i - 1]
                let next = arr[i + 1]

                if (Number.isNaN(Number(prev)) && prev !== "+" && prev !== "-") {
                    e = " " + e
                }
                if (!Number.isNaN(Number(e)) && e !== " " && Number.isNaN(Number(next)) && i > 6) {
                    e = e + `°${units} `
                }
                if (Number.isNaN(Number(next)) && next !== "+" && next !== "-") {
                    e = e + " "
                }
            }
            return e
        })
        return marr?.join("")
    })
    // console.log(ok)
    return `${location}: 
    ${ok[0]} 
    ${ok[1]} 
    ${ok[2]} 
    ${ok[3]} 
    ${ok[4]}`
}
