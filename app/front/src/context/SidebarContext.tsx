import {createContext, ReactNode, useState} from "react";

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebarcollapse: () => void;
    setSidebarCollapsed?: (collapsed: boolean) => void;
}

const initialValue: SidebarContextType = {
    isCollapsed: false,
    toggleSidebarcollapse: () => {
    },
    setSidebarCollapsed: () => {
    }
};

const SidebarContext = createContext<SidebarContextType>(initialValue);

interface SidebarProviderProps {
    children: ReactNode;
}

const SidebarProvider = ({children}: SidebarProviderProps) => {
    const [isCollapsed, setCollapse] = useState<boolean>(false);

    const setSidebarCollapsed = (collapsed: boolean) => {
        setCollapse(collapsed);
        localStorage.setItem('sidebarCollapsed', collapsed.toString());
    }

    const toggleSidebarcollapse = () => {
        setSidebarCollapsed(!isCollapsed);
    };

    return (
        <SidebarContext.Provider value={{isCollapsed, toggleSidebarcollapse, setSidebarCollapsed}}>
            {children}
        </SidebarContext.Provider>
    );
};

export type {SidebarContextType};
export {SidebarContext, SidebarProvider};