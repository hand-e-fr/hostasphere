import '../app/globals.css';
import type {AppProps} from 'next/app';
import React, {useEffect} from "react";
import RootLayout from "@/components/Layout";
import {SidebarProvider} from "@/context/SidebarContext";
import {useAppController} from "@/hooks/useAppController";
import Installation from "@/components/installation/Installation";
import Loading from "@/components/Loading";

function MyApp({Component, pageProps}: AppProps) {
    const {fetchIsAppInitialized, error} = useAppController();
    const [isAppInitialized, setIsAppInitialized] = React.useState(false);
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
        return <Loading/>;
    } else if (!isAppInitialized) {
        if (error) {
            return (
                <div className="flex h-screen bg-base-200">
                    <main className={`flex-1 p-[2em]`}>
                        <h1 className="text-2xl font-bold mb-4 text-center">Error</h1>
                        <p className="text-red-500 mb-4 text-center">{error}</p>
                        <p className="text-center">It could happen because the server is not running or the database is
                            not connected.</p>
                    </main>
                </div>
            );
        }
        return (
            <div className="flex h-screen bg-base-200 overflow-y-auto max-h-[calc(100vh-4rem)]">
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