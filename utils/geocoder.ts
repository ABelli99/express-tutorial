import NodeGeocoder, { Geocoder } from 'node-geocoder';

const options: NodeGeocoder.Options = {
    provider: process.env.GEOCODER_PROVIDER as NodeGeocoder.Providers,
    //httpAdapter: 'https',             // didn't found any info regarding this missing variable
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder: Geocoder = NodeGeocoder(options);

export default geocoder;