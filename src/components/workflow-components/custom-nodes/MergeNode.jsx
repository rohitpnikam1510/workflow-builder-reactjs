import React, { memo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Handle, Position } from "@xyflow/react";
import { getCsvData } from "../../../utils/indexDB";

const SliceNode = ({ id, data, isConnectable }) => {
    const [columns, setColumns] = useState([]);
    const [column, setColumn] = useState('');
    const [columntwo, setColumnTwo] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const connections = useSelector((state) => state.connections);
    const [sourceNode, setSourceNode] = useState('');

    useEffect(() => {

        const connection = connections.filter((conn) => conn.target === id);

        if (connection) {
            setIsConnected(true);
            setSourceNode(connection.source);
            fetchColumnsFromSource(connection.source);
        } else {
            setIsConnected(false);
            setColumns([]);
        }
    }, [connections]);

    const fetchColumnsFromSource = async (dataKey) => {

        const sourceData = await getCsvData(dataKey);

        if (sourceData && sourceData.length > 0) {
            const keys = Object.keys(sourceData[0]);
            setColumns(keys);
        } else {
            console.error("Invalid sourceData or data is empty.");
            setColumns([]);
        }
    }

    const handleRun = async () => {
        if (!column || !columntwo) {
            alert('Please complete all fields before running the filter.');
            return;
        }

        fetchDataForFilter(sourceNode);
    };

    const fetchDataForFilter = async (dataKey) => {
        const sourceData = await getCsvData(dataKey);
        if (Array.isArray(sourceData) && sourceData.length > 0) {
            let dataArray = sourceData;

            let mergedData = dataArray.map((item1, index, arr) => {
                // Find a matching item based on column and columnTwo
                const match = arr.find((item2, idx) =>
                    idx !== index && // Avoid matching the same item with itself
                    item1[column] === item2[column] &&
                    item1[columntwo] === item2[columntwo]
                );

                // If a match is found, merge the items; otherwise, return the item as is
                if (match) {
                    return {
                        ...item1,
                        ...match,  // Merge properties from both items
                    };
                } else {
                    return item1;  // If no match, keep the original item
                }
            });

            setFilteredData(mergedData);
        } else {
            console.error("Invalid sourceData or data is empty.");
        }
    };

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div
                id={id}
                className="w-[250px] bg-skyblue rounded-lg shadow-lg border border-black"
            >
                <div className="p-2 border-b-2 border-black">
                    <h4 className="font-bold text-black">{data.label}</h4>
                </div>
                <div className="p-2">
                    {!isConnected ? (
                        <div>
                            <label className="block text-sm">Select Column</label>
                            <select
                                value={column}
                                onChange={(e) => setColumn(e.target.value)}
                                className="w-full p-2 border rounded mt-2"
                            >
                                <option value="">--connect dataset--</option>
                            </select>
                        </div>
                    ) : (
                        <>
                            <div className="mt-4">
                                <label className="block text-sm">Select Column</label>
                                <select
                                    value={column}
                                    onChange={(e) => {
                                        setColumn(e.target.value);
                                        // onColumnChange(e.target.value); // Pass the selected column to parent component
                                    }}
                                    className="w-full p-2 border rounded mt-2"
                                >
                                    <option value="">Select Column</option>
                                    {columns.map((col) => (
                                        <option key={col} value={col}>
                                            {col}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm">Select Column</label>
                                <select
                                    value={columntwo}
                                    onChange={(e) => {
                                        setColumnTwo(e.target.value);
                                        // onColumnChange(e.target.value); // Pass the selected column to parent component
                                    }}
                                    className="w-full p-2 border rounded mt-2"
                                >
                                    <option value="">Select Column</option>
                                    {columns.map((col) => (
                                        <option key={col} value={col}>
                                            {col}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="mt-4">
                        <button
                            onClick={handleRun}
                            className="bg-[#E03E0B] text-white p-2 rounded mt-2"
                        >
                            Run
                        </button>
                    </div>

                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
}

export default memo(SliceNode);