import '../app/globals.css';
import type {AppProps} from 'next/app';
import React from "react";
import RootLayout from "@/components/Layout";
import {SidebarProvider} from "@/context/SidebarContext";
import {UserProvider} from "@/context/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <SidebarProvider>
                <RootLayout>
                    <Component {...pageProps} />
                </RootLayout>
            </SidebarProvider>
        </UserProvider>
    );
}

export default MyApp;