import React, {useState} from 'react';
import {ProfilerData} from "@/types/ProfilerData";
import Tree from "react-d3-tree";
import {CodeBlock} from "react-code-blocks";

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

    const buildTree = (nodeId: string, visited: Set<string>): TreeNode | null => {
        if (visited.has(nodeId)) {
            return null;
        }

        const node = map.get(nodeId);
        if (!node) {
            return null;
        }

        visited.add(nodeId);

        links.forEach((link) => {
            if (link.input === nodeId) {
                const childNode = buildTree(link.output, new Set(visited)); // Pass a copy of visited set
                if (childNode) {
                    node.children.push(childNode);
                }
            }
        });

        return node;
    };

    const highestNodesMap = new Map<string, TreeNode>();

    highestNodes.forEach((node) => {
        const tree = buildTree(node, new Set());
        if (tree) {
            highestNodesMap.set(node, tree);
        }
    });

    const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
        <g
            onClick={() => {
                if (!nodeDatum.attributes.customData) {
                    setIsSideBoardActive(false);
                    setHoveredNode(null);
                    return;
                }
                if (nodeDatum.name === hoveredNode?.name) {
                    setIsSideBoardActive(!isSideBoardActive);
                }
                setHoveredNode(nodeDatum);
            }}
            style={{ cursor: 'pointer' }}
        >
            <circle r={15} fill={isSideBoardActive && nodeDatum.name === hoveredNode?.name ? 'green' : nodeDatum.attributes.color} />
            <rect x="18" y="-10" width={nodeDatum.name.length * 10} height="20" fill="white" stroke="none" />
            <text fill="black" strokeWidth="1" x="20" dy=".35em">
                {nodeDatum.name}
            </text>
        </g>
    );

    return (
        <div className="h-full w-full flex flex-col" id="execution-diagram">
            <div id="treeWrapper" className={`relative ${isSideBoardActive ? 'h-2/3' : 'h-full'}`}>
                {Array.from(highestNodesMap.entries()).map(([key, treeData]) => (
                    <Tree
                        key={key}
                        data={treeData}
                        orientation="horizontal"
                        pathFunc="diagonal"
                        nodeSize={{x: 420, y: 200}}
                        renderCustomNodeElement={renderCustomNode}
                    />
                ))}
            </div>
            <div className={`${isSideBoardActive ? 'h-1/3' : 'hidden'} overflow-y-auto border-t border-base-200 p-4`}>
                {isSideBoardActive && hoveredNode && hoveredNode.attributes.customData && (
                    <>
                        <h2 className="text-lg font-bold">{hoveredNode.name}:</h2>
                        <p className="text-sm">Function Prototype:</p>
                        <div className={`w-[calc(100%-2rem)]`}>
                            <CodeBlock text={
                                `@profiler.track()\ndef ${hoveredNode.name}(${
                                    hoveredNode.attributes.customData.funcparams &&
                                    hoveredNode.attributes.customData.funcparams.map((param: any) => {
                                        return param.argname + (param.type ? ': ' + param.type : '');
                                    }).join(', ')
                                    || ''
                                })${hoveredNode.attributes.customData.returnedvalue && ' -> ' + hoveredNode.attributes.customData.returnedvalue.type + ':' || ':'}\n    #...\n    return ${
                                    hoveredNode.attributes.customData.returnedvalue &&
                                    hoveredNode.attributes.customData.returnedvalue.value
                                    || ''
                                }`
                            } language="Python" showLineNumbers={false}/>
                        </div>
                        <p className="text-sm">Execution Time: {hoveredNode.attributes.customData.executiontime}ms</p>
                        <p className="text-sm">Execution
                            Timeline: {new Date(hoveredNode.attributes.customData.starttime * 1000).toLocaleString() + ' => ' + new Date(hoveredNode.attributes.customData.endtime * 1000).toLocaleString()}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExecutionDiagram;