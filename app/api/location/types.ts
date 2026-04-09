export type NominatimSearchResponse = {
    lat: string;
    lon: string;
    name: string;
    display_name: string;
}[];

export type NominatimReverseResponse = {
    name: string;
    display_name: string;
    address: {
        village?: string;
        suburb?: string;
        town?: string;
        city?: string;
        county?: string;
        country: string;
        country_code: string;
    };
};

export type LocationSearchResponse = {
    lat: string;
    lon: string;
    displayName: string;
    error?: string;
};

export type LocationReverseResponse = {
    name: string;
    displayName: string;
    error?: string;
};
