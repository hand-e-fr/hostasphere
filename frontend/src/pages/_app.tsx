import '../app/globals.css';
import type { AppProps } from 'next/app';
import React, { useEffect } from "react";
import RootLayout from "@/app/Layout";
import {SidebarProvider} from "@/context/SidebarContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SidebarProvider>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </SidebarProvider>
    );
}

export default MyApp;