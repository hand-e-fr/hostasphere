import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {SidebarProvider} from "@/context/SidebarContext";
import {getRestApiUrl} from "@/utils/apiUrl";
import { useAppController } from "@/hooks/useAppController";

enum AppStatus {
    NOT_INITIALIZED = 'NOT_INITIALIZED',
    ERROR = 'ERROR',
    INSTALLATION = 'INSTALLATION',
    INITIALIZED = 'INIT',
}

interface AppContextType {
    restUrl: string;
    status?: AppStatus;
}

const initialValue: AppContextType = {
    restUrl: 'http://localhost:8080',
    status: AppStatus.NOT_INITIALIZED,
};

const AppContext = createContext<AppContextType>(initialValue);

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
    const [restUrl, setRestUrl] = useState<string>('http://localhost:8080');
    const [status, setStatus] = useState<AppStatus>(AppStatus.NOT_INITIALIZED);

    const {fetchIsAppInitialized, error} = useAppController();

    useEffect(() => {
        getRestApiUrl().then((url) => {
            setRestUrl(url);
            fetchIsAppInitialized(url).then((result) => {
                if (result) {
                    setStatus(AppStatus.INITIALIZED);
                } else {
                    if (error) {
                        setStatus(AppStatus.ERROR);
                    } else {
                        setStatus(AppStatus.INSTALLATION);
                    }
                }
            }).catch(() => {
                setStatus(AppStatus.ERROR);
            });
        });
    }, []);

    return (
        <AppContext.Provider value={{ restUrl, status }}>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </AppContext.Provider>
    );
};

const useAppContext = (): AppContextType => {
    const context = useContext<AppContextType>(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within the AppProvider');
    }
    return context;
};

export { useAppContext, AppProvider, AppStatus };