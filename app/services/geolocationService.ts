export type GeoPosition = {
    latitude: number;
    longitude: number;
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
                resolve({
                    latitude: Number(position.coords.latitude.toFixed(5)),
                    longitude: Number(position.coords.longitude.toFixed(5)),
                });
            },
            (error: GeolocationPositionError) => {
                let message = "Unable to retrieve your location.";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location permission was denied.";
                        break;

                    case error.POSITION_UNAVAILABLE:
                        message = "Your location could not be determined.";
                        break;

                    case error.TIMEOUT:
                        message =
                            "We couldn't get your location in time. Please try again or search for a location instead.";
                        break;
                }

                reject({
                    code: error.code,
                    message,
                });
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
            },
        );
    });
};
