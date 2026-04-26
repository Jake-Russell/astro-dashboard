import { LocationReverseResponse, LocationSearchResponse } from "api/location/types";

export const mockLat = 51.5074;
export const mockLng = -0.1278;

export const mockLocationSearchResponse: LocationSearchResponse = {
    lat: mockLat.toString(), // TODO: Do these need to be string?
    lon: mockLng.toString(),
    displayName: "London, UK",
};

export const mockLocationReverseResponse: LocationReverseResponse = {
    name: "London",
    displayName: "London, UK",
};
