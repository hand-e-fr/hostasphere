import '../app/globals.css';
import React, {useContext, useEffect} from 'react';
import {useRouter} from "next/router";
import {SidebarContext, SidebarContextType} from "@/context/SidebarContext";
import Sidebar from "@/components/Sidebar";

type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const {setSidebarCollapsed} = useContext<SidebarContextType>(SidebarContext);

    useEffect(() => {
        if (setSidebarCollapsed && localStorage.getItem('sidebarCollapsed')) {
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                setSidebarCollapsed(true);
            } else if (localStorage.getItem('sidebarCollapsed') === 'false') {
                setSidebarCollapsed(false);
            }
        }
    });

    return (
        <div className="flex h-screen bg-base-200">
            <Sidebar />
            <main
                className={`flex-1 p-[2em]`}>
                {children}
            </main>
        </div>
    );
};

export default Layout;