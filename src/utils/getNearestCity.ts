const nearbyCities: any = require('nearby-cities');

export function getCityFromGeoLocation(geolocation?: string): string {
    if (!geolocation) return 'no location';

    const [latitude, longitude] = geolocation
        .replace(/[()]/g, '')
        .split(',')
        .map((s) => parseFloat(s.trim()));

    console.log(latitude, longitude);

    const query = { latitude, longitude };
    const cities = nearbyCities(query);
    return cities && cities[0] ? cities[0].name : 'no location';
}
