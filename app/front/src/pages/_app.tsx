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
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        fetchIsAppInitialized().then((result) => {
            setIsAppInitialized(result);
            setLoading(false);
        });
    }, [updateEffect]);

    const triggerUpdate = () => {
        setUpdateEffect(prev => !prev);
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-base-200">
                <main className={`flex-1 p-[2em]`}>
                    <div className="flex items-center justify-center h-full">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                </main>
            </div>
        );
    } else if (!isAppInitialized) {
        return (
            <div className="flex h-screen bg-base-200">
                <main className={`flex-1 p-[2em]`}>
                    <Installation onInstalled={triggerUpdate}/>
                </main>
            </div>
        );
    }
    return (
        <SidebarProvider>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </SidebarProvider>
    );
}

export default MyApp;