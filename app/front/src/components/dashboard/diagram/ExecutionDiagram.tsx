import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CanvasWidget = dynamic(
    () => import('@projectstorm/react-canvas-core').then(mod => mod.CanvasWidget),
    { ssr: false }
);

const Diagram: React.FC<{ functionCallers: string[] }> = ({ functionCallers }) => {
    const [engine, setEngine] = useState<any>(null);

    useEffect(() => {
        const createEngine = require('@projectstorm/react-diagrams').default;
        const DiagramModel = require('@projectstorm/react-diagrams').DiagramModel;
        const DefaultNodeModel = require('@projectstorm/react-diagrams').DefaultNodeModel;
        const DefaultLinkModel = require('@projectstorm/react-diagrams').DefaultLinkModel;

        const newEngine = createEngine();
        const model = new DiagramModel();

        const nodesMap = new Map<string, typeof DefaultNodeModel>();

        functionCallers.forEach((caller, index) => {
            const color = getColorForIndex(index);
            const node = new DefaultNodeModel(caller, color);
            nodesMap.set(caller, node);

            if (index > 0) {
                const prevCaller = functionCallers[index - 1];
                const prevNode = nodesMap.get(prevCaller);
                if (prevNode) {
                    const link = new DefaultLinkModel();
                    link.setSourcePort(prevNode.addOutPort('Out'));
                    link.setTargetPort(node.addInPort('In'));
                    model.addLink(link);
                }
            }

            node.setPosition(100 + index * 150, 100);
            model.addNode(node);
        });

        newEngine.setModel(model);
        setEngine(newEngine);
    }, [functionCallers]);

    // Helper function to generate a color based on the index
    const getColorForIndex = (index: number) => {
        const colors = [
            'rgb(0,192,255)',
            'rgb(192,255,0)',
            'rgb(255,0,192)',
            'rgb(255,192,0)',
            'rgb(0,255,192)',
            'rgb(192,0,255)',
            'rgb(255,128,0)',
            'rgb(0,128,255)',
            'rgb(128,255,0)',
            'rgb(255,0,128)',
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="w-full h-full bg-gray-100">
            {engine && <CanvasWidget className="w-full h-full" engine={engine} />}
        </div>
    );
};

export default Diagram;