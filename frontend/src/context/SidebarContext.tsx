import { createContext, useState, ReactNode } from "react";

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebarcollapse: () => void;
}

const initialValue: SidebarContextType = { 
    isCollapsed: false, 
    toggleSidebarcollapse: () => {} 
};

const SidebarContext = createContext<SidebarContextType>(initialValue);

interface SidebarProviderProps {
    children: ReactNode;
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
    const [isCollapsed, setCollapse] = useState<boolean>(false);

    const toggleSidebarcollapse = () => {
        setCollapse((prevState) => !prevState);
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebarcollapse }}>
            {children}
        </SidebarContext.Provider>
    );
};

export type { SidebarContextType };
export { SidebarContext, SidebarProvider };