const azureMapConfig = {
  key: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY || '',
  baseUrl: process.env.NEXT_PUBLIC_AZURE_MAPS_BASE_URL || '',
  radiusDefault: process.env.NEXT_PUBLIC_AZURE_MAPS_RADIUS_DEFAULT
    ? parseInt(process.env.NEXT_PUBLIC_AZURE_MAPS_RADIUS_DEFAULT)
    : 10000,
  clientId: process.env.NEXT_PUBLIC_AZURE_MAPS_CLIENT_ID || '',
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
  const data = await response.json();
  return data.results.map((item: any) => {
    return {
      name: item.address.municipality,
      country: item.address.countrySubdivision,
      position: item.position,
      label: item.address.municipality + ', ' + item.address.countrySubdivision,
    };
  });
};
