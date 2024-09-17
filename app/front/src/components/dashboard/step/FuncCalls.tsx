import React, {useState} from "react";
import { ProfilerData } from "@/types/ProfilerData";
import {CodeBlock, CopyBlock} from "react-code-blocks";
import {SessionData} from "@/types/SessionData";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
    session: SessionData;
}

const FuncCalls: React.FC<ExecutionDiagramProps> = ({ profilerData, session }) => {
    const [targetFunction, setTargetFunction] = useState<ProfilerData | null>(profilerData.length > 0 ? profilerData[0] : null);

    if (profilerData.length === 0) {
        return <div>No data</div>;
    }

    profilerData.sort((a, b) => a.starttime - b.starttime);
    const start = session.starttime;

    return (
        <>
            <div className="flex justify-start mt-10 flex-col-reverse lg:flex-row">
                <div className="min-w-[30%] max-w-[50%] mt-6">
                    <ul className="steps steps-vertical">
                        {profilerData.map((data, index) => (
                            <li key={index}
                                className={`step cursor-pointer hover:bg-gray-100 p-2 ${targetFunction?._id === data._id ? 'step-error bg-gray-100' : 'step-accent'}`}
                                onClick={() => setTargetFunction(data)}>
                                <div className="flex items-start justify-start flex-col">
                                    <p>{data.functionname}</p>
                                    <p className="text-left">t+ {data.starttime - start}ms</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div id="func-calls" className="sticky top-0">
                    {
                        targetFunction ? (
                            <div>
                                <h1 className="text-center text-l bold">{targetFunction.functionname}:</h1>
                                <ul className="steps steps-vertical">
                                    {targetFunction.functioncallers && targetFunction.functioncallers.map((data, index) => (
                                        <li key={index} className={`step step-warning`}>
                                            <div className="flex items-start justify-start flex-col">
                                                <p>{data.caller}</p>
                                                <p>{data.callerfile}:{data.callerline}</p>
                                            </div>
                                        </li>
                                    ))}
                                    { targetFunction.funcparams && (
                                        <>
                                            <li className={`step step-accent`}>
                                                <button className="btn" onClick={() => {
                                                    const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
                                                    if (modal) modal.showModal();
                                                }}>
                                                    Show Params
                                                </button>
                                                <dialog id="my_modal_2" className="modal">
                                                    <div className="modal-box text-left">
                                                        <h3 className="font-bold text-lg">
                                                            {targetFunction.functionname} params
                                                        </h3>
                                                        {targetFunction.funcparams.map((param, index) => (
                                                            <div key={index}>
                                                                <div className="bold">{param.argname} ({param.type}):
                                                                </div>
                                                                <div className="ml-4 max-w-[50em] overflow-x-auto">
                                                                    <div>
                                                                        {param.arg}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <form method="dialog" className="modal-backdrop">
                                                        <button>close</button>
                                                    </form>
                                                </dialog>
                                            </li>
                                        </>
                                    )}
                                    <li className={`step step-accent`}>
                                    <div className="flex items-start justify-start flex-col">
                                            <p>{targetFunction.functionname}</p>
                                            <p>t+ {targetFunction.starttime - start}ms</p>
                                        </div>
                                    </li>
                                    <li className={`step step-info`}>
                                        <div className="flex items-start justify-start flex-col">
                                            <button className="btn" onClick={() => {
                                                const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null;
                                                if (modal) modal.showModal();
                                            }}>
                                                Show Returned Value
                                            </button>
                                            <dialog id="my_modal_3" className="modal">
                                                <div className="modal-box text-left">
                                                    <h3 className="font-bold text-lg">
                                                        {targetFunction.functionname} returned value
                                                    </h3>
                                                    <div
                                                        className="bold">type: {targetFunction.returnedvalue.type}</div>
                                                    <div className="ml-4 max-w-[50em] overflow-x-auto">
                                                        <div>
                                                            {targetFunction.returnedvalue.value}
                                                        </div>
                                                    </div>
                                                </div>
                                                <form method="dialog" className="modal-backdrop">
                                                    <button>close</button>
                                                </form>
                                            </dialog>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-gray-100 border rounded-lg m-4 h-full w-full">
                                <div className="flex justify-center mt-72">
                                    <h1>Click on a function to see its calls</h1>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default FuncCalls;