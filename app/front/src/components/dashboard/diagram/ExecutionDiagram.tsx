import React, {useState} from 'react';
import {ProfilerData} from "@/types/ProfilerData";
import Tree from "react-d3-tree";
import {CodeBlock} from "react-code-blocks";
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {useRouter} from "next/router";

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
        public attributes: Attributes = { color: '#2e6bda', customData: null }
    ) {}
}

const ExecutionDiagram: React.FC<ExecutionDiagramProps> = ({ profilerData }) => {
    const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
    const [isSideBoardActive, setIsSideBoardActive] = useState<boolean>(false);
    const router = useRouter();

    let nodes: Node[] = [];
    let links: any[] = [];
    let highestNodes: string[] = [];

    profilerData.forEach((data) => {
        nodes.push({ id: data.functionname, attributes: { color: '#2e6bda', customData: data }});
        data.functioncallers.forEach((caller, index) => {
            nodes.push({ id: caller.caller, attributes: { color: '#66cc8a', customData: null }});
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
            <circle r={15} fill={isSideBoardActive && nodeDatum.name === hoveredNode?.name ? '#1d4da1' : nodeDatum.attributes.color} />
            <rect x="18" y="-10" width={nodeDatum.name.length * 14} height="20" fill="white" stroke="none" />
            <text fill="#333c4d" strokeWidth="1" x="20" dy=".35em" fontFamily="Courier New, monospace" fontSize="22">
                {nodeDatum.name}
            </text>
        </g>
    );

    return (
        <div id="execution-diagram" className="h-full w-full flex flex-col justify-between p-4 bg-white shadow rounded-lg mt-3">
            <div id="treeWrapper" className={`${isSideBoardActive ? 'h-1/2 ' : 'h-full'} w-full`}>
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
            <div className={`${isSideBoardActive ? 'h-1/2 ' : 'hidden'} overflow-y-auto border-t border-base-200`}>
                {isSideBoardActive && hoveredNode && hoveredNode.attributes.customData && (
                    <div className="p-4">
                        <div>
                            <button className="btn btn-error btn-sm float-right" onClick={() => {
                                setHoveredNode(null);
                                setIsSideBoardActive(false);
                            }}>
                                <CloseIcon sx={{color: "white"}}/>
                            </button>
                            <button className="btn btn-primary btn-sm float-right mr-2" onClick={() => {
                                router.push(`/dashboard/${router.query.tokenId}/session/${router.query.sessionId}/${hoveredNode.attributes.customData._id}/experiments`);
                            }}>
                                <PlayArrowIcon sx={{color: "white"}}/>
                            </button>
                        </div>
                        <h2 className="text-lg font-bold">{hoveredNode.name}:</h2>
                        <p className="text-sm">Function Prototype:</p>
                        <div className={`w-[calc(100%-2rem)]`}>
                            <CodeBlock text={hoveredNode.attributes.customData.sourcecode} language="Python"
                                       showLineNumbers={false}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExecutionDiagram;