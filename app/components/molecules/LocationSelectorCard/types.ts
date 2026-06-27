export type LocationSelectorCardProps = {
    isWeatherDataLoading: boolean;
    weatherDataError?: string;
    setLatitude: (latitude: number) => void;
    setLongitude: (longitude: number) => void;
    setWeatherLoading: (loading: boolean) => void;
};
