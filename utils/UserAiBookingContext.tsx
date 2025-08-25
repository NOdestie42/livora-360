import React, { createContext, useContext, useState } from "react";

interface UserAnswers {
    propertyName: string;
    propertyType: string;
    beds: number;
    baths: number;
    rentalRate: number;
    maxPersons: number;
    size: number;
}

interface UserContextType {
    userAnswers: UserAnswers;
    updateUserAnswers: (newAnswers: Partial<UserAnswers>) => void;
}

// Context initialized with null as the default value
const UserAiBookingContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const context = useContext(UserAiBookingContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

const UserAiBookingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({
        propertyName: "",
        propertyType: "",
        size: 0,
        beds: 0,
        baths: 0,
        rentalRate: 0,
        maxPersons: 0,
    });

    const updateUserAnswers = (newAnswers: Partial<UserAnswers>) => {
        setUserAnswers((prev) => ({ ...prev, ...newAnswers }));
    };

    return (
        <UserAiBookingContext.Provider value={{ userAnswers, updateUserAnswers }
        }>
            {children}
        </UserAiBookingContext.Provider>
    );
};

export default UserAiBookingContextProvider;
