"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAstronomyData } from "../utils/getAstronomyData";
import type { AstronomyData } from "./MoonPhaseTile";

export type AstronomyContextType = {
    latitude: string;
    longitude: string;
    setLatitude: (lat: string) => void;
    setLongitude: (lng: string) => void;
    astronomyData?: AstronomyData;
    astronomyLoading: boolean;
};

const AstronomyContext = createContext<AstronomyContextType | undefined>(undefined);

export const useAstronomy = () => {
    const ctx = useContext(AstronomyContext);
    if (!ctx) throw new Error("useAstronomy must be used within an AstronomyProvider");
    return ctx;
};

export const AstronomyProvider = ({ children }: { children: React.ReactNode }) => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [astronomyData, setAstronomyData] = useState<AstronomyData>();
    const [astronomyLoading, setAstronomyLoading] = useState(false);

    useEffect(() => {
        if (!latitude || !longitude) return;
        setAstronomyLoading(true);
        getAstronomyData(latitude, longitude)
            .then((data) => {
                setAstronomyData(data);
                setAstronomyLoading(false);
            })
            .catch(() => setAstronomyLoading(false));
    }, [latitude, longitude]);

    return (
        <AstronomyContext.Provider
            value={{
                latitude,
                longitude,
                setLatitude,
                setLongitude,
                astronomyData,
                astronomyLoading,
            }}
        >
            {children}
        </AstronomyContext.Provider>
    );
};
