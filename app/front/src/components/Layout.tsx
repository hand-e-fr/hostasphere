import '../app/globals.css';
import React, {useContext, useEffect} from 'react';
import {SidebarContext, SidebarContextType} from "@/context/SidebarContext";
import Sidebar from "@/components/Sidebar";
import {Bounce, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type LayoutProps = React.PropsWithChildren<{}>;

const contextClass = {
    success: "bg-blue-600",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
};

const Layout: React.FC<LayoutProps> = ({children}) => {
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
        <>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false}
                            pauseOnHover={false}
                            theme="dark" transition={Bounce}
            />
            <div className="flex h-screen bg-base-200">
                <Sidebar/>
                <main
                    className={`flex-1 p-4 pt-3 pb-3 min-h-[calc(100vh)]`}>
                    <div className="bg-base-100 overflow-y-auto shadow-lg rounded-lg p-6 h-full">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Layout;