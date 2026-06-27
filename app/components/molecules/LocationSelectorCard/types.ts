export type LocationSelectorCardProps = {
    isWeatherDataLoading: boolean;
    weatherDataError?: string;
    setLatitude: (lat: number) => void;
    setLongitude: (long: number) => void;
    setWeatherLoading: (loading: boolean) => void;
};
