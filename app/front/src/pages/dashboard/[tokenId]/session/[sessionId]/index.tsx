import { useRouter } from "next/router";

const Function: React.FC = () => {
    const router = useRouter();
    const { tokenId } = router.query;

    return (
        <>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Session - {tokenId}
                </h1>
            </div>

            <div className="divider"></div>
            <div>
            </div>
        </>
    );
};

export default Function;