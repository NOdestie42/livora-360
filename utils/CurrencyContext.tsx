// CurrencyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type Currency = "USD" | "EUR";

interface CurrencyContextType {
    currency: Currency;
    setCurrencyToEuro: () => void;
    setCurrencyToUSD: () => void;
    formatPrice: (amountUSD: number) => string;
}
// CurrencyContext.tsx
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyContextType {
    currency: "USD" | "EUR";
    setCurrencyToUSD: () => void;
    setCurrencyToEuro: () => void;
    formatPrice: (amountUSD: number) => string;
}

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<"USD" | "EUR">("USD");

    const setCurrencyToUSD = () => setCurrency("USD");
    const setCurrencyToEuro = () => setCurrency("EUR");

    const formatPrice = (amountUSD: number) => {
        const rate = 0.92; // USD → EUR
        const value = currency === "USD" ? amountUSD : amountUSD * rate;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(value);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrencyToUSD, setCurrencyToEuro, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};


export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
    return context;
};
