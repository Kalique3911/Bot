Telegram bot for getting weather, created with Telegraf.

## Features

+ The bot uses **Puppeteer** to open a weather forecast site and parse html
+ The bot supports data caching using the **node-cache** library
+ Commands for interacting with the user: /weather, /forecast, /city \*city in English*, /change, /start, /help
+ The bot uses **https://yandex.ru/pogoda** as the weather site
+ For the selected city, you can request the current weather forecast using the /weather command, after which the temperature, weather conditions, wind, humidity, pressure will be displayed
+ The city can be changed by calling the /city command again and specifying its name in English
+ The /change command changes units of measurement from metric to imperial and vice versa
+ After the /start command, the user is asked to share his geolocation, on the basis of which, if received, the weather forecast will be built
