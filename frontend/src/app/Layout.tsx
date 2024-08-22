import React, { useState, useEffect } from 'react';
import './globals.css';
import Sidebar from "@/components/Sidebar";

type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {

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