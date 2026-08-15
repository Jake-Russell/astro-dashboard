export type GeoPosition = {
    latitude: number;
    longitude: number;
};

export type GeolocationErrorCode =
    "UNSUPPORTED" | "PERMISSION_DENIED" | "POSITION_UNAVAILABLE" | "TIMEOUT";

export type GeolocationError = {
    code: GeolocationErrorCode;
    message: string;
};

export const getCurrentPosition = (): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                code: "UNSUPPORTED",
                message: "Your browser does not support device location.",
            } satisfies GeolocationError);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: Number(position.coords.latitude.toFixed(5)),
                    longitude: Number(position.coords.longitude.toFixed(5)),
                });
            },
            (error: GeolocationPositionError) => {
                let geolocationError: GeolocationError;

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        geolocationError = {
                            code: "PERMISSION_DENIED",
                            message:
                                "Location permission was denied. You can enable location access in your browser settings, or search for a location instead.",
                        };
                        break;

                    case error.POSITION_UNAVAILABLE:
                        geolocationError = {
                            code: "POSITION_UNAVAILABLE",
                            message:
                                "Your device's location could not be determined. Please try again or search for a location instead.",
                        };
                        break;

                    case error.TIMEOUT:
                        geolocationError = {
                            code: "TIMEOUT",
                            message:
                                "We couldn't get your location in time. Please try again or search for a location instead.",
                        };
                        break;

                    default:
                        geolocationError = {
                            code: "POSITION_UNAVAILABLE",
                            message:
                                "Unable to retrieve your location. Please try again or search for a location instead.",
                        };
                }

                reject(geolocationError);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
            },
        );
    });
};
