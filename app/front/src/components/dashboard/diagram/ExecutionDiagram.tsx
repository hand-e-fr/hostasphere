import React from 'react';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { ProfilerData } from "@/types/ProfilerData";

interface ExecutionDiagramProps {
    functions: ProfilerData[];
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ functions }) => {
    const nodes: any = Array.from(new Set(functions.map(func => ({
        id: func.functionid,
        content: func.functionname,
        coordinates: [Math.random() * 500, Math.random() * 500] // Randomize for better spread
    }))));

    const links = functions.flatMap((func) =>
        func.functioncallers.map((caller) => ({
            input: functions.find(f => f.functionname === caller.caller)?.functionid || 'unknown',
            output: func.functionid
        }))
    ).filter(link => link.input !== 'unknown');

    const initialSchema = createSchema({ nodes, links });

    const [schema, { onChange }] = useSchema(initialSchema);

    return (
        <div className="h-full">
            <Diagram schema={schema} onChange={onChange} />
        </div>
    );
};

export default ExecutionDiagram;