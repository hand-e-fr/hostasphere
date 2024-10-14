import React from 'react';
import {NextPage} from 'next';
import {useRouter} from "next/router";

const Custom404: NextPage = () => {
    const router = useRouter();

    const goBackHome = () => {
        router.push("/").then();
    }

    return (
        <div className="flex justify-center flex-col items-center px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-primary">404 - Page Not Found</h1>
            <p className="mt-4 text-lg text-primary">Sorry, the page you are looking for does not exist.</p>
            <button className="btn btn-link mt-6 text-blue-500" onClick={goBackHome}>Go back home</button>
        </div>
    );
};

export default Custom404;