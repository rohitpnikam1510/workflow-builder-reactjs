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
            <div className="overflow-auto max-w-full scrollbar-thin">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr>
                            {headers.map((key) => (
                                <th
                                    key={key}
                                    className="bg-[--lavender] border border-[--primary] p-2 text-left text-[--primary]"
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
                                    <td key={key} className="px-4 py-2 border border-[--primary]">
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
        <div className="bg-output p-4 rounded-md shadow-md h-40">
            <div className="flex items-center justify-between mt-4 mb-4 border-b-2 border-[--primary]">
                <h2 className="text-xl font-bold text-[--primary]">
                    Output Panel
                </h2>
                <div className="export-actions space-x-4">
                    <button
                        onClick={exportToJSON}
                        className="bg-sidebarButton text-sidebarButtonText border border-sidebarButtonBorder px-4 py-2 rounded-md
        hover:bg-sidebarButtonHoverBg hover:border-sidebarButtonHoverBorder rounded hover:bg-opacity-90"
                    >
                        Export to JSON
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="bg-sidebarButton text-sidebarButtonText border border-sidebarButtonBorder px-4 py-2 rounded-md
        hover:bg-sidebarButtonHoverBg hover:border-sidebarButtonHoverBorder rounded hover:bg-opacity-90"
                    >
                        Export to CSV
                    </button>
                </div>
            </div>

            <hr className="bg-[--primary]" />

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
                                ? 'bg-[--secondary] cursor-not-allowed'
                                : 'bg-[--primary] text-white hover:bg-[--secondary]'
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
                                ? 'bg-[--secondary] cursor-not-allowed'
                                : 'bg-[--primary] text-white hover:bg-[--secondary]'
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
