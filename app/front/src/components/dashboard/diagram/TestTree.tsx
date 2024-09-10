import React from 'react';
import Tree from 'react-d3-tree';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const orgChart = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            children: [
                {
                    name: 'Foreman',
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};

export default function OrgChartTree() {
    return (
        <div id="treeWrapper" className="h-[1000px] w-[1000px]">
            <Tree data={orgChart}/>
        </div>
    );
}