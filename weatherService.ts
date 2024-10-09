import puppeteer from "puppeteer"

const getCoordinates = async (city: string) => {
    let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1&countrycodes=ru`)
    let json = await response.json()
    return { lat: json[0].lat, lon: json[0].lon }
}

export const getWeather = async (city: string, units: string, geolocation: { lat: string; lon: string } | null) => {
    let browser = await puppeteer.launch({
        headless: true,
    })
    let page = await browser.newPage()
    let { lat, lon } = geolocation ? geolocation : await getCoordinates(city)

    await page.goto(`https://yandex.ru/pogoda?lat=${lat}&lon=${lon}`)

    await page.waitForSelector(".temp__value, .link__condition, .title ")
    let tempElement = await page.$(".temp__value")
    let condElement = await page.$(".link__condition")
    let locElement = await page.$(".title")

    let temperature = await page.evaluate((tempElement) => tempElement?.textContent, tempElement)
    temperature = units === "F" ? Math.round(((Number(temperature) - 32) * 5) / 9).toString() : temperature

    let condition = await page.evaluate((condElement) => condElement?.textContent, condElement)
    let location = await page.evaluate((locElement) => locElement?.textContent, locElement)

    return `${location}: ${temperature}°${units}, ${condition}`
}

export const getForecast = async (city: string, units: string, geolocation: { lat: string; lon: string } | null) => {
    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    let { lat, lon } = geolocation ? geolocation : await getCoordinates(city)

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
            let diff = Math.round(((Number(firstTemp) - 32) * 5) / 9).toString().length + firstTempInd.start - firstTempInd.end - 1
            if (ind === 4) console.log(firstTemp)
            if (ind === 4) console.log(firstTempInd.end.toString() + " " + firstTempInd.start.toString())
            if (ind === 4) console.log(secondTemp)
            if (ind === 4) console.log(secondTempInd.end.toString() + " " + secondTempInd.start.toString())
            arr?.splice(firstTempInd.start, firstTempInd.end - firstTempInd.start + 1, Math.round(((Number(firstTemp) - 32) * 5) / 9).toString())
            if (ind === 4) console.log(arr)
            arr = arr?.join("").split("")
            if (ind === 4) console.log(arr)
            arr?.splice(secondTempInd.start + diff, secondTempInd.end - secondTempInd.start + 1, Math.round(((Number(secondTemp) - 32) * 5) / 9).toString())
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
