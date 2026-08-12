const getRequiredEnv = (key: string): string => {
    const value = process.env[key]?.trim();

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${key}. Add it to your .env file or deployment environment before starting the app.`,
        );
    }

    return value;
};

export const getEnv = () => ({
    nodeEnv: process.env.NODE_ENV ?? "development",
    weatherApiKey: getRequiredEnv("OPEN_WEATHER_MAP_APP_ID"),
});

export const env = new Proxy({} as ReturnType<typeof getEnv>, {
    get(_target, property) {
        const values = getEnv();
        const key = property as keyof ReturnType<typeof getEnv>;
        return values[key];
    },
});
