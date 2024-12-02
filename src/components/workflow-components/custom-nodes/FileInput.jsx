import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import Papa from 'papaparse';
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { storeCsvData } from "../../../utils/indexDB";
import { clearSelectedNode, setSelectedNode } from "../../../store/selectedNodeSlice";

const FileInput = ({ id, data, isConnectable }) => {
    const dispatch = useDispatch();
    const [csvData, setCsvData] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [datasetCount, setDatasetCount] = useState(0);
    const { updateNodeData } = useReactFlow();

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (file) {
            setUploadedFileName(file.name);
            Papa.parse(file, {
                complete: async (result) => {
                    const parsedData = result.data;
                    updateNodeData(id, { fileData: parsedData })
                    setCsvData(parsedData);
                    setDatasetCount(parsedData.length);
                    dispatch(clearSelectedNode());
                    await storeCsvData(`${id}_data`, parsedData);
                    dispatch(setSelectedNode(id));
                },
                header: true,
            });
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
                className="bg-skyblue rounded-lg shadow-lg border border-black"
            >
                <div className="p-2 border-b-2 border-black">
                    <h4 className="font-bold text-black">{data.label}</h4>
                </div>
                <div className="p-2">
                    <input
                        type="file"
                        accept=".csv"
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                        onChange={handleFileChange}
                    />
                </div>


                {uploadedFileName && (
                    <div className="m-2">
                        <h5 className="semi-bold">Uploaded File: {uploadedFileName}</h5>
                        <h6 className="text-sm text-gray-700">Dataset Rows: {datasetCount}</h6>
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
}

export default memo(FileInput);