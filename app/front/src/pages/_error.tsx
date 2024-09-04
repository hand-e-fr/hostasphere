import React from 'react';
import {NextPageContext} from 'next';
import {useRouter} from "next/router";

interface ErrorProps {
    statusCode: number;
}

const Error = ({statusCode}: ErrorProps) => {
    const router = useRouter();

    const goBackHome = () => {
        router.push("/").then();
    }

    return (
        <div className="flex justify-center flex-col items-center px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-primary">
                {statusCode ? `Error ${statusCode}` : 'An error occurred'}
            </h1>
            <p className="mt-4 text-lg text-secondary">An error occurred on client</p>
            <button className="btn btn-link mt-6 text-blue-500" onClick={goBackHome}>Go back home</button>
        </div>
    );
};

Error.getInitialProps = ({res, err}: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return {statusCode};
};

export default Error;