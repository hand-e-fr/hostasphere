import '../app/globals.css';
import type {AppProps} from 'next/app';
import React, {useEffect} from "react";
import RootLayout from "@/components/Layout";
import {SidebarProvider} from "@/context/SidebarContext";
import {useAppController} from "@/hooks/useAppController";
import Installation from "@/components/installation/Installation";

function MyApp({ Component, pageProps }: AppProps) {
    const { fetchIsAppInitialized } = useAppController();
    const  [isAppInitialized, setIsAppInitialized] = React.useState(false);
    const [updateEffect, setUpdateEffect] = React.useState(false);

    useEffect(() => {
        fetchIsAppInitialized().then((result) => {
            setIsAppInitialized(result);
        });
    }, [updateEffect]);

    const triggerUpdate = () => {
        setUpdateEffect(prev => !prev);
    };

    return (
        <>
            {isAppInitialized ? (
                <SidebarProvider>
                    <RootLayout>
                        <Component {...pageProps} />
                    </RootLayout>
                </SidebarProvider>
            ) : (
                <div className="flex h-screen bg-base-200">
                    <main className={`flex-1 p-[2em]`}>
                        <Installation onInstalled={triggerUpdate}/>
                    </main>
                </div>
            )}
        </>
    );
}

export default MyApp;