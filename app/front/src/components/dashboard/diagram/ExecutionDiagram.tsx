import React from 'react';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { ProfilerData } from "@/types/ProfilerData";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    var nodes: any[] = [];
    var links: any[] = [];
    profilerData.forEach((data) => {
        nodes.push({ id: data.functionname, content: data.functionname, coordinates: [0, 0] });
        data.functioncallers.forEach((caller, index) => {
            nodes.push({ id: caller.caller, content: caller.caller, coordinates: [0, 0] });
            if (index > 0) {
                links.push({ input: data.functioncallers[index - 1].caller, output: caller.caller });
            }
        });
        if (data.functioncallers.length > 0) {
            links.push({ input: data.functionname, output: data.functioncallers[data.functioncallers.length - 1].caller });
        }
    });

    nodes = nodes.filter((node, index, self) => self.findIndex((t) => t.id === node.id) === index);
    links = links.filter((link, index, self) => self.findIndex((t) => t.input === link.input && t.output === link.output) === index);

    const initialSchema = createSchema({
        nodes: [
            ...nodes
        ],
        links: [
            ...links
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