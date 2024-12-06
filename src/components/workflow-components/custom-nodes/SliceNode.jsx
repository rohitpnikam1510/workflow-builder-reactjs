import React, { memo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Handle, Position } from "@xyflow/react";
import { getCsvData, storeCsvData } from "../../../utils/indexDB";

const SliceNode = ({ id, data, isConnectable }) => {
    const [columns, setColumns] = useState([]);
    const [column, setColumn] = useState('');
    const [minValue, setMinvalue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const connections = useSelector((state) => state.connections);
    const [sourceNode, setSourceNode] = useState('');

    useEffect(() => {

        const connection = connections.find((conn) => conn.target === id);

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
        fetchDataForFilter(sourceNode);
    };

    const fetchDataForFilter = async (dataKey) => {
        const sourceData = await getCsvData(dataKey);
        if (Array.isArray(sourceData) && sourceData.length > 0) {
            let filtered = sourceData;

            if (minValue !== undefined && maxValue !== undefined) {
                // Assuming minValue and maxValue are string indices that need to be converted to integers
                const minIndex = parseInt(minValue, 10);
                const maxIndex = parseInt(maxValue, 10);

                // Perform the slicing operation
                filtered = filtered.slice(minIndex, maxIndex + 1);
            }

            setFilteredData(filtered); // Use filtered data as needed
            storeCsvData(`${id}_data`, filtered);
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
                className="bg-[--secondary] w-[250px] rounded-lg shadow-lg border border-black"
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
                                <label className="block text-sm">From Index</label>
                                <input
                                    type="text"
                                    value={minValue}
                                    onChange={(e) => setMinvalue(e.target.value)}
                                    className="w-full p-2 border rounded mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm">To Index</label>
                                <input
                                    type="text"
                                    value={maxValue}
                                    onChange={(e) => setMaxValue(e.target.value)}
                                    className="w-full p-2 border rounded mt-2"
                                />
                            </div>
                        </>
                    )}

                    <div className="mt-4">
                        <button
                            onClick={handleRun}
                            className="bg-[--primary] p-2 rounded mt-2"
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