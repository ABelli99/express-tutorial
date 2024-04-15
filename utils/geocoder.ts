import NodeGeocoder, { GeocoderOptions, Geocoder } from 'node-geocoder';

const options: GeocoderOptions = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder: Geocoder = NodeGeocoder(options);

export default geocoder;