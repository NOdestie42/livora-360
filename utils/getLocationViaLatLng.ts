import axios from "axios";

interface GeocodeResult {
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

async function getCityName(lat: number, lng: number) {
  const apiKey = "AIzaSyCXxbFkHoYq3Gvtc-ZtuavaKlhblCsrscY";
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get<GeocodeResponse>(geocodeUrl);

    if (response.data.results.length > 0) {
      const addressComponents = response.data.results[0].address_components;
      const cityComponent = addressComponents.find((component) =>
        component.types.includes("locality")
      );

      if (cityComponent) {
        return cityComponent.long_name;
      } else {
        return null;
      }
    } else {
      console.log("No results found for the given coordinates");
    }
  } catch (error) {
    console.error("Error getting city name:", error);
    throw error;
  }
}

export default getCityName;
