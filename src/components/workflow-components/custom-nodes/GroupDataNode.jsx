import React, { memo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Handle, Position } from "@xyflow/react";
import { getCsvData, storeCsvData } from "../../../utils/indexDB";

const GroupDataNode = ({ id, data, isConnectable }) => {
    const [columns, setColumns] = useState([]);
    const [column, setColumn] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const connections = useSelector((state) => state.connections);
    const [sourceNode, setSourceNode] = useState('');


    useEffect(() => {

        const connection = connections.find((conn) => conn.target === id);

        if (connection) {
            setIsConnected(true);
            setSourceNode(connection.source)
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
        if (!column) {
            alert('Please complete all fields before running the filter.');
            return;
        }


        fetchDataForFilter(sourceNode);
    };

    const fetchDataForFilter = async (dataKey) => {
        const sourceData = await getCsvData(dataKey);
        if (Array.isArray(sourceData) && sourceData.length > 0) {
            let filtered = sourceData;
            let grouped = {};

            filtered.forEach((item) => {
                const groupValue = item[column];  // The value of the column to group by
                if (groupValue) {
                    if (!grouped[groupValue]) {
                        grouped[groupValue] = [];
                    }
                    grouped[groupValue].push(item);
                }
            });

            const groupedData = Object.keys(grouped).map(groupValue => ({
                group: groupValue,
                items: grouped[groupValue],
            }));

            setFilteredData(groupedData);
            storeCsvData(`${id}_data`, groupedData);
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

export default memo(GroupDataNode);