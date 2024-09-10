import React from 'react';
import 'beautiful-react-diagrams/styles.css';
import { ProfilerData } from "@/types/ProfilerData";
import Tree from "react-d3-tree";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    let nodes: any[] = [];
    let links: any[] = [];
    let highestNodes: string[] = [];

    profilerData.forEach((data) => {
        nodes.push({ id: data.functionname, content: data.functionname, coordinates: [0, 0], attributes: { color: 'red' } });
        data.functioncallers.forEach((caller, index) => {
            nodes.push({ id: caller.caller, content: caller.caller, coordinates: [0, 0], attributes: { color: 'blue' } });
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

    class TreeNode {
        constructor(public name: string, public attributes: any = {}, public children: TreeNode[] = []) {}
    }

    const map = new Map<string, TreeNode>();

    nodes.forEach((node) => {
        map.set(node.id, new TreeNode(node.id, node.attributes));
    });

    links.forEach((link) => {
        const parent = map.get(link.input);
        const child = map.get(link.output);
        if (parent && child) {
            parent.children.push(child);
        }
    });

    const highestNodesMap = new Map<string, TreeNode>();

    highestNodes.forEach((node) => {
        highestNodesMap.set(node, map.get(node) as TreeNode);
    });

    return (
        <div id="treeWrapper" className="h-[1000px] w-full">
            {Array.from(highestNodesMap.entries()).map(([key, treeData]) => (
                <Tree
                    key={key}
                    data={treeData}
                    orientation="horizontal"
                    pathFunc="elbow"
                    nodeSize={{ x: 420, y: 200 }}
                />
            ))}
        </div>
    );
};

export default ExecutionDiagram;
