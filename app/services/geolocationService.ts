export type GeoPosition = {
    latitude: string;
    longitude: string;
};

export type GeoError = {
    code?: number;
    message: string;
};

export const getCurrentPosition = (): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                message: "Geolocation is not supported by your browser.",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const response: GeoPosition = {
                    latitude: position.coords.latitude.toFixed(5),
                    longitude: position.coords.longitude.toFixed(5),
                };
                resolve(response);
            },
            (error: GeolocationPositionError) => {
                const errorResponse: GeoError = {
                    code: error.code,
                    message: error.message,
                };
                reject(errorResponse);
            },
        );
    });
};
