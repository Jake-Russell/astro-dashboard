import { LocationReverseResponse, LocationSearchResponse } from "api/location/types";

export const mockLat = 51.5074;
export const mockLng = -0.1278;

export const mockLocationSearchResponse: LocationSearchResponse = {
    latitude: mockLat,
    longitude: mockLng,
    displayName: "London, UK",
};

export const mockLocationReverseResponse: LocationReverseResponse = {
    name: "London",
    displayName: "London, UK",
};
