import React from "react";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-8em)]">
            <main className={`flex-1 p-[2em]`}>
                <div className="flex items-center justify-center h-full">
                    <span className="loading loading-ring loading-lg"></span>
                </div>
            </main>
        </div>
    );
}