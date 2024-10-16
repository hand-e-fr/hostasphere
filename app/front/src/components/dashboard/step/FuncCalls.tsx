import React, {useState} from "react";
import {ProfilerData} from "@/types/ProfilerData";
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
            <div className="flex justify-start flex-col-reverse lg:flex-row">
                <div className="w-1/5 mt-6">
                    <ul className="steps steps-vertical">
                        {profilerData.map((data, index) => (
                            <li key={index} data-content=""
                                className={`step cursor-pointer hover:bg-gray-100 p-2 ${targetFunction?._id === data._id ? 'step-primary bg-gray-100' : 'step-neutral'}`}
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
                <div id="func-calls" className="w-4/5 mt-6">
                    {targetFunction ? (
                        <div>
                            <div className="mb-2">
                                <div className="badge badge-outline badge-lg">{targetFunction.functionname}</div>
                            </div>
                            {targetFunction.funcparams && targetFunction.funcparams.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        {/* head */}
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Value</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {targetFunction.funcparams.map((param, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{param.argname}</td>
                                                <td>{param.type}</td>
                                                <td>{param.arg}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-100 border rounded-lg m-4 h-full w-full">
                            <div className="flex justify-center mt-72">
                                <h1>Click on a function to see its calls</h1>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FuncCalls;
