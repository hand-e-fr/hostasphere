import React from 'react';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { ProfilerData } from "@/types/ProfilerData";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    let nodes: any[] = [];
    let links: any[] = [];
    let highestNodes: string[] = [];

    profilerData.forEach((data) => {
        nodes.push({ id: data.functionname, content: data.functionname, coordinates: [0, 0] });
        data.functioncallers.forEach((caller, index) => {
            nodes.push({ id: caller.caller, content: caller.caller, coordinates: [0, 0] });
            if (data.functioncallers.length === 0) {
                highestNodes.push(data.functionname);
            } else {
                highestNodes.push(data.functioncallers[0].caller);
            }
            if (index > 0) {
                links.push({ input: data.functioncallers[index - 1].caller, output: caller.caller, readonly: true });
            }
        });
        if (data.functioncallers.length > 0) {
            links.push({ input: data.functioncallers[data.functioncallers.length - 1].caller, output: data.functionname, readonly: true });
        }
    });

    // Remove duplicate nodes and links
    nodes = nodes.filter((node, index, self) => self.findIndex((t) => t.id === node.id) === index);
    links = links.filter((link, index, self) => self.findIndex((t) => t.input === link.input && t.output === link.output) === index);
    highestNodes = highestNodes.filter((node, index, self) => self.findIndex((t) => t === node) === index);

    console.log(highestNodes);

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