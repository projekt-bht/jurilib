type AzureMapResult = {
  address: {
    municipality?: string;
    countrySubdivision?: string;
  };
  position: { lat: number; lon: number };
};

type AzureMapResponse = {
  results: AzureMapResult[];
};

const radiusDefaultValue = process.env.NEXT_PUBLIC_AZURE_MAPS_RADIUS_DEFAULT;
const MAX_RADIUS_METERS = 50_000;
const azureMapConfig = {
  key: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY ?? '',
  baseUrl: process.env.NEXT_PUBLIC_AZURE_MAPS_BASE_URL ?? '',
  radiusDefault: radiusDefaultValue
    ? Math.min(Number.parseInt(radiusDefaultValue, 10), MAX_RADIUS_METERS)
    : 10000,
  clientId: process.env.NEXT_PUBLIC_AZURE_MAPS_CLIENT_ID ?? '',
};
export const getCityByName = async (cityName: string) => {
  if (cityName.trim() === '') {
    return;
  }
  const url = new URL(azureMapConfig.baseUrl);
  url.searchParams.append('api-version', '1.0');
  url.searchParams.append('query', cityName);
  url.searchParams.append('subscription-key', azureMapConfig.key);
  url.searchParams.append('entityType', 'Municipality');
  url.searchParams.append('countrySet', 'DE');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Azure Maps API request failed with status ${response.status}`);
  }
  const data = (await response.json()) as AzureMapResponse;
  return data.results.map((item) => {
    const municipality = item.address.municipality ?? '';
    const countrySubdivision = item.address.countrySubdivision ?? '';
    return {
      name: municipality,
      country: countrySubdivision,
      position: item.position,
      label: `${municipality}, ${countrySubdivision}`,
    };
  });
};

export const getCityByRadius = async (lat: number, lon: number, cityName: string) => {
  if (cityName.trim() === '') {
    return;
  }
  const url = new URL(azureMapConfig.baseUrl);
  url.searchParams.append('api-version', '1.0');
  url.searchParams.append('lat', lat.toString());
  url.searchParams.append('lon', lon.toString());
  url.searchParams.append('subscription-key', azureMapConfig.key);
  url.searchParams.append('entityType', 'Municipality');
  url.searchParams.append('countrySet', 'DE');
  url.searchParams.append('radius', azureMapConfig.radiusDefault.toString());
  url.searchParams.append('query', cityName); //query '' dosent work here

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Azure Maps API request failed with status ${response.status}`);
  }
  const data = (await response.json()) as AzureMapResponse;
  return data.results.map((item) => {
    const municipality = item.address.municipality ?? '';
    const countrySubdivision = item.address.countrySubdivision ?? '';
    return {
      name: municipality,
      country: countrySubdivision,
      position: item.position,
      label: `${municipality}, ${countrySubdivision}`,
    };
  });
};
