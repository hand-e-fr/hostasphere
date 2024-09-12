import React, {useState} from "react";
import { ProfilerData } from "@/types/ProfilerData";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

const FuncCalls: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    const [targetFunction, setTargetFunction] = useState<ProfilerData | null>(null);

    if (profilerData.length === 0) {
        return <div>No data</div>;
    }

    profilerData.sort((a, b) => a.starttime - b.starttime);
    const start = profilerData[0].starttime;

    return (
        <>
            <div className="flex justify-start mt-10">
                <div>
                    <ul className="steps steps-vertical">
                        {profilerData.map((data, index) => (
                            <li key={index} data-content={``} className={`step ${targetFunction === data ? 'step-error' : 'step-accent'}`}
                                onClick={() => setTargetFunction(data)}>
                                <div className="flex items-center">
                                    <div className="badge">{data.starttime - start}ms</div>
                                    <p className="m-2">-</p>
                                    <div className="badge">{data.functionname}</div>
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
                                <h1 className="text-center text-l underline bold">{targetFunction.functionname}:</h1>
                                <ul className="steps steps-vertical">
                                    {targetFunction.functioncallers && targetFunction.functioncallers.map((data, index) => (
                                        <li key={index} className={`step step-warning`} data-content={``}>
                                            <div className="flex items-center">
                                                <div className="badge">{data.caller}</div>
                                                <p className="m-2">-</p>
                                                <div className="badge">{data.callerfile}:{data.callerline}</div>
                                            </div>
                                        </li>
                                    ))}
                                    <li className={`step step-accent`} data-content={``}>
                                        <div className="flex items-center">
                                            <div className="badge">{targetFunction.starttime - start}ms</div>
                                            <p className="m-2">-</p>
                                            <div className="badge">{targetFunction.functionname}</div>
                                        </div>
                                    </li>
                                    <li className={`step step-info`} data-content={``}>
                                        <div className="flex items-center">
                                            <div className="badge">{targetFunction.returnedvalue.type}</div>
                                            <p className="m-2">-</p>
                                            <div className="badge">{targetFunction.returnedvalue.value}</div>
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