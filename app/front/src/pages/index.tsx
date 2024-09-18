import Link from "next/link";

export default function Home() {
    return (
        <>
            <h1 className="text-2xl">Hostasphere</h1>
            <p>
                How use hostasphere profiler:
            </p>
            <p className="flex items-center gap-2">
                Go to <Link href={"settings/tokens"} passHref className="text-blue-500">Settings</Link> and create a new token.
            </p>
        </>
    );
}