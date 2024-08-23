import React, {useContext, useEffect} from 'react';
import '../app/globals.css';
import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/router";
import {SidebarContext, SidebarContextType} from "@/context/SidebarContext";
import {UserContext, UserContextType} from "@/context/UserContext";

type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const {setSidebarCollapsed} = useContext<SidebarContextType>(SidebarContext);
    const {refreshAccount, isAuth} = useContext<UserContextType>(UserContext);

    useEffect(() => {
        if (setSidebarCollapsed && localStorage.getItem('sidebarCollapsed')) {
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                setSidebarCollapsed(true);
            } else if (localStorage.getItem('sidebarCollapsed') === 'false') {
                setSidebarCollapsed(false);
            }
        }
    });

    useEffect(() => {
        refreshAccount().then(valid => {
            if (!valid && router.pathname !== '/login' && router.pathname !== '/register') {
                router.push('/login').then();
            }
        });
    }, [isAuth(), router]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            <Sidebar />
            <main
                className={`flex-1 p-[2em]`}>
                {children}
            </main>
        </div>
    );
};

export default Layout;