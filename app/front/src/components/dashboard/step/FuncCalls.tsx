import React from "react";
import { ProfilerData } from "@/types/ProfilerData";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

const colors: string[] = [
    'step-accent',
    'step-info',
    'step-warning',
    'step-error'
]

const FuncCalls: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    return (
        <>
            <div className="flex justify-center">
                <ul className="steps steps-vertical">
                    {profilerData.map((data, index) => (
                        <li key={index} className={`step ${colors[index % 4]}`}>
                            {data.functionname}
                        </li>
                    ))}
                </ul>
                <div>
                    <ul className="">
                        {profilerData.map((data, index) => (
                            <li key={index} className={`mt-8`}>
                                <button className="btn btn-sm btn-primary">
                                    {data.functionname}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default FuncCalls;