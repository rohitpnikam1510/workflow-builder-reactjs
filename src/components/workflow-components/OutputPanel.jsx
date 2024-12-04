import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCsvData } from '../../utils/indexDB'; // Import IndexedDB utility
import { saveAs } from 'file-saver'; // To export files
import Papa from 'papaparse'; // For CSV export

const OutputPanel = () => {
    const selectedNodeId = useSelector((state) => state.selectedNode.nodeId); // Get selected node ID from Redux
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 10; // Rows per page

    // Fetch data whenever selected node changes
    useEffect(() => {
        if (selectedNodeId) {
            fetchData();
        }
    }, [selectedNodeId]);

    const fetchData = async () => {
        setLoading(true);
        const fetchedData = await getCsvData(selectedNodeId);
        setData(fetchedData || []);
        setLoading(false);
    };

    const exportToJSON = () => {
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        saveAs(jsonBlob, `${selectedNodeId}_data.json`);
    };

    const flattenData = (data) => {
        const flattenObject = (obj, prefix = '') => {
            let result = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    const newKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof value === 'object' && value !== null) {
                        Object.assign(result, flattenObject(value, newKey)); // Recursively flatten
                    } else {
                        result[newKey] = value;
                    }
                }
            }
            return result;
        };

        return data.map(item => flattenObject(item)); // Flatten all items
    };

    const exportToCSV = () => {
        const flattenedData = flattenData(data);
        const csv = Papa.unparse(flattenedData);
        const csvBlob = new Blob([csv], { type: 'text/csv' });
        saveAs(csvBlob, `${selectedNodeId}_data.csv`);
    };

    // Pagination helpers
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);  // Decrease currentPage
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);  // Increase currentPage
        }
    };


    const renderTable = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return <div>No data available</div>;
        }

        const headers = Object.keys(data[0]);

        return (
            <div className="overflow-auto max-w-full">
                <table className="table-auto w-full border-collapse border border-black">
                    <thead>
                        <tr>
                            {headers.map((key) => (
                                <th
                                    key={key}
                                    className="border border-skyblue p-2 text-left bg-saffron text-white"
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx}>
                                {headers.map((key) => (
                                    <td key={key} className="px-4 py-2 border border-skyblue">
                                        {Array.isArray(row[key]) ? (
                                            <div className="p-2">
                                                {renderTable(row[key])} {/* Nested table */}
                                            </div>
                                        ) : typeof row[key] === 'object' && row[key] !== null ? (
                                            <div className="p-2">
                                                {renderTable([row[key]])} {/* Single object as table */}
                                            </div>
                                        ) : (
                                            row[key]?.toString() || 'N/A'
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };


    return (
        <div className="surface-3 m-2 rounded-md p-4 shadow-md">
            <div className="flex space-x-4 items-center justify-between mb-2">
                <h2 className=" text-1 text-xl font-bold text-[#220F01]">
                    Output Panel
                </h2>
                <div className="export-actions space-x-4">
                    <button
                        onClick={exportToJSON}
                        className="surface-1 font-medium text-1 shadow-lg text-white px-4 py-2 rounded-md hover:bg-[#220F01] transition"
                    >
                        Export to JSON
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="surface-1 surface-1 font-medium text-1 shadow-lg text-white px-4 py-2 rounded-md hover:bg-[#220F01] transition"
                    >
                        Export to CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-[#220F01]">Loading data...</p>
            ) : data.length > 0 ? (
                <>
                    {/* Responsive Table */}
                    <div className="overflow-x-auto">
                        {renderTable(paginatedData)}
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                            className={`px-4 py-2 rounded-md ${currentPage === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-[#E03E0B] text-white hover:bg-[#220F01]'
                                }`}
                        >
                            Previous
                        </button>
                        <span className="text-[#220F01]">
                            Page {currentPage + 1} of {totalPages} {/* Display currentPage + 1 to show page numbers starting from 1 */}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages - 1
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-[#E03E0B] text-white hover:bg-[#220F01]'
                                }`}
                        >
                            Next
                        </button>
                    </div>

                </>
            ) : (
                <p className="text-[#220F01]">
                    No data available for the selected node.
                </p>
            )}
        </div>
    );
};

export default OutputPanel;
