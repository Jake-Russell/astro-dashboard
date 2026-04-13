export type LocationSelectorCardProps = {
    isWeatherDataLoading: boolean;
    weatherDataError?: string;
    setLatitude: (lat: string) => void;
    setLongitude: (long: string) => void;
    resetWeatherData: () => void;
};
