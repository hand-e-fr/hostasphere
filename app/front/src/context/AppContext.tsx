import {createContext, ReactNode, useEffect, useState} from "react";
import {SidebarProvider} from "@/context/SidebarContext";
import {getRestApiUrl} from "@/utils/apiUrl";

interface AppContextType {
    restUrl: string;
}

const initialValue: AppContextType = {
    restUrl: 'http://localhost:8080'
};

const AppContext = createContext<AppContextType>(initialValue);

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
    const [restUrl, setRestUrl] = useState<string>('http://localhost:8080');

    useEffect(() => {
        getRestApiUrl().then((url) => {
            setRestUrl(url);
        });
    }, []);

    return (
        <AppContext.Provider value={{ restUrl }}>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </AppContext.Provider>
    );
};

export type { AppContextType };
export { AppContext, AppProvider };