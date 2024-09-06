// components/Diagram.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CanvasWidget to ensure it's only loaded on the client side
const CanvasWidget = dynamic(
    () => import('@projectstorm/react-canvas-core').then(mod => mod.CanvasWidget),
    { ssr: false }
);

const Diagram: React.FC = () => {
    const [engine, setEngine] = useState<any>(null);

    useEffect(() => {
        const createEngine = require('@projectstorm/react-diagrams').default;
        const DiagramModel = require('@projectstorm/react-diagrams').DiagramModel;
        const DefaultNodeModel = require('@projectstorm/react-diagrams').DefaultNodeModel;

        // Create the engine and model
        const newEngine = createEngine();
        const model = new DiagramModel();

        // Define nodes and links
        const node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
        const port1 = node1.addOutPort('Out');
        node1.setPosition(100, 100);

        const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
        const port2 = node2.addInPort('In');
        node2.setPosition(400, 100);

        const link1 = port1.link(port2);

        model.addAll(node1, node2, link1);

        // Additional nodes and links
        const node3 = new DefaultNodeModel('Node 3', 'rgb(0,192,255)');
        const port3 = node3.addOutPort('Out');
        node3.setPosition(100, 250);

        const node4 = new DefaultNodeModel('Node 4', 'rgb(192,255,0)');
        const port4 = node4.addInPort('In');
        node4.setPosition(400, 250);

        const link2 = port3.link(port4);

        link2.point(350, 225);
        link2.point(200, 225);

        model.addAll(node3, node4, link2);

        // Lock the model to prevent interaction
        model.setLocked(true);

        // Set the model to the engine
        newEngine.setModel(model);

        // Update state with the initialized engine
        setEngine(newEngine);
    }, []);

    return (
        <div className="w-full h-full bg-gray-100">
            {engine && <CanvasWidget className="w-full h-full" engine={engine} />}
        </div>
    );
};

export default Diagram;