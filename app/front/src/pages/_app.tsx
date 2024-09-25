import '../app/globals.css';
import type {AppProps} from 'next/app';
import React from "react";
import RootLayout from "@/components/Layout";
import Installation from "@/components/installation/Installation";
import Loading from "@/components/Loading";
import {AppProvider, AppStatus, useAppContext} from "@/context/AppContext";

function MainContent({ Component, pageProps }: AppProps) {
    const { status } = useAppContext();

    if (status === AppStatus.NOT_INITIALIZED) {
        return <Loading />;
    } else if (status === AppStatus.ERROR) {
        return (
            <div className="flex h-screen bg-base-200">
                <main className="flex-1 p-[2em]">
                    <h1 className="text-2xl font-bold mb-4 text-center">Error</h1>
                    <p className="text-center">
                        It could happen because the server is not running or the database is not connected.
                    </p>
                </main>
            </div>
        );
    } else if (status === AppStatus.INSTALLATION) {
        return (
            <div className="flex h-screen bg-base-200 overflow-y-auto">
                <main className="flex-1 p-[2em]">
                    <Installation />
                </main>
            </div>
        );
    } else {
        return (
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        );
    }
}

function MyApp(props: AppProps) {
    return (
        <AppProvider>
            <MainContent {...props} />
        </AppProvider>
    );
}

export default MyApp;