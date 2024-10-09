import { handleError } from "../utils/errorHandling"

export const getCoordinates = async (city: string) => {
    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`)
        let json = await response.json()
        if (json.length === 0) {
            throw new Error(`failed to fetch this city: ${city}`)
        }
        return { lat: json[0].lat, lon: json[0].lon }
    } catch (error) {
        handleError(error as Error)
        return null
    }
}
