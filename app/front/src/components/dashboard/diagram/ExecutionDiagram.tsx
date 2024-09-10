import React, { useState } from 'react';
import 'beautiful-react-diagrams/styles.css';
import { ProfilerData } from "@/types/ProfilerData";
import Tree from "react-d3-tree";

interface ExecutionDiagramProps {
    profilerData: ProfilerData[];
}

interface Attributes {
    color: string;
    customData: ProfilerData | null;
}

class Node {
    constructor(
        public id: string,
        public attributes: Attributes = { color: 'red', customData: null }
    ) {}
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
    const [isSideBoardActive, setIsSideBoardActive] = useState<boolean>(false);

    let nodes: Node[] = [];
    let links: any[] = [];
    let highestNodes: string[] = [];

    profilerData.forEach((data) => {
        nodes.push({ id: data.functionname, attributes: { color: 'red', customData: data }});
        data.functioncallers.forEach((caller, index) => {
            nodes.push({ id: caller.caller, attributes: { color: 'blue', customData: null }});
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

    const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
        <g
            onClick={() => {
                toggleNode();
                setHoveredNode(null); // Ensure tooltip is hidden when toggling
            }}
            onMouseEnter={() => setHoveredNode(nodeDatum)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: 'pointer' }}
        >
            <circle r={15} fill={nodeDatum.attributes.color} />
            <rect x="18" y="-10" width={nodeDatum.name.length * 10} height="20" fill="white" stroke="none" />
            <text fill="black" strokeWidth="1" x="20" dy=".35em">
                {nodeDatum.name}
            </text>
        </g>
    );

    const renderTooltip = () => {
        if (!hoveredNode) return null;
        return (
            <div style={{
                position: 'absolute',
                backgroundColor: 'white',
                border: '1px solid black',
                padding: '5px',
                pointerEvents: 'none',
                left: '10px',
                top: '10px',
            }}>
                <strong>{hoveredNode.name}</strong>
                <div>Attributes:</div>
                <pre>{JSON.stringify(hoveredNode.attributes, (key, value) => {
                    if (key === 'functioncallers') {
                        return undefined;
                    }
                    return value;
                }, 2)}</pre>
            </div>
        );
    };

    return (
        <div id="treeWrapper" className="h-[1000px] w-full" style={{ position: 'relative' }}>
            {Array.from(highestNodesMap.entries()).map(([key, treeData]) => (
                <Tree
                    key={key}
                    data={treeData}
                    orientation="horizontal"
                    pathFunc="diagonal"
                    nodeSize={{ x: 420, y: 200 }}
                    renderCustomNodeElement={renderCustomNode}
                />
            ))}
            {renderTooltip()}
        </div>
    );
};

export default ExecutionDiagram;