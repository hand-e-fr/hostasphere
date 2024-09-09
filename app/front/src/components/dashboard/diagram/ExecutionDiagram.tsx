import React from 'react';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { ProfilerData } from "@/types/ProfilerData";

/*

export interface FunctionCall {
    callerfile: string;
    callerline: number;
    caller: string;
}

export interface ProfilerData {
    ...,
    functioncallers: FunctionCall[];
    ...,
    functionname: string;
 */

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    // create node for all functionname and each caller of functioncallers


    const initialSchema = createSchema({
        nodes: [
            { id: 'node-1', content: 'Node 1', coordinates: [250, 250] },
            { id: 'node-2', content: 'Node 2', coordinates: [100, 100] },
            { id: 'node-3', content: 'Node 3', coordinates: [400, 100] },
            { id: 'node-4', content: 'Node 4', coordinates: [250, 400] },
        ],
        links: [
            { input: 'node-1',  output: 'node-2', label: 'Link 1', readonly: true },
            { input: 'node-1',  output: 'node-3', label: 'Link 2', readonly: true },
            { input: 'node-1',  output: 'node-4', label: 'Link 3', readonly: true },
        ]
    });


    const [schema, { onChange }] = useSchema(initialSchema);

    return (
        <div className="h-[1000px]">
            <Diagram schema={schema} onChange={onChange}/>
        </div>
    );
};

export default ExecutionDiagram;