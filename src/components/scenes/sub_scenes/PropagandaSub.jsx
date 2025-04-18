// PropagandaSub.jsx - Modern implementation using import.meta.glob
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../../../assets/css/PropagandaSub.css';
import {
    extractMetadataFromFilename,
    generateRandomDate,
    extractUniqueTags,
    filterPropagandaItems,
    sortPropagandaItems
} from './PropagandaUtils';

// PropagandaSub component
const PropagandaSub = ({ isModern = false }) => {
    // State management
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedItem, setSelectedItem] = useState(null);
    const itemsPerPage = 6;

    // Load media files on component mount
    useEffect(() => {
        const loadMediaFiles = async () => {
            try {
                setLoading(true);

                // Use import.meta.glob to dynamically import all image files
                const images = import.meta.glob('/img/propaganda/*.{gif,jpg,jpeg,png}', {
                    eager: true,
                    import: 'default'
                });

                // Process each file to create metadata
                const mediaItems = Object.entries(images).map(([path, image], index) => {
                    // Get just the filename from the path
                    const filename = path.split('/').pop();

                    // Use the utility function to extract metadata from filename
                    const metadata = extractMetadataFromFilename(filename);

                    // Generate a random date for sorting
                    const date = generateRandomDate();

                    return {
                        id: `prop${(index + 1).toString().padStart(3, '0')}`,
                        filename,
                        date,
                        timestamp: new Date(date).getTime(),
                        imagePath: image,
                        ...metadata
                    };
                });

                setMediaFiles(mediaItems);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load propaganda media files:', err);
                setError(err.message || 'Failed to load propaganda media files');
                setLoading(false);
                // Fallback to empty array if we can't load files
                setMediaFiles([]);
            }
        };

        loadMediaFiles();
    }, []);

    // Extract all unique tags from the propaganda data
    const allTags = useMemo(() => {
        return extractUniqueTags(mediaFiles);
    }, [mediaFiles]);

    // Filter and sort the propaganda items
    const filteredItems = useMemo(() => {
        // First filter the items based on search term and active tag
        const filtered = filterPropagandaItems(mediaFiles, searchTerm, activeTag);
        // Then sort them by date
        return sortPropagandaItems(filtered, sortOrder);
    }, [mediaFiles, searchTerm, activeTag, sortOrder]);

    // Pagination
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTag, sortOrder]);

    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    // Handle tag selection
    const handleTagClick = useCallback((tag) => {
        setActiveTag(prev => prev === tag ? '' : tag);
    }, []);

    // Handle sort order change
    const handleSortChange = useCallback((e) => {
        setSortOrder(e.target.value);
    }, []);

    // Handle view mode change
    const handleViewModeChange = useCallback((mode) => {
        setViewMode(mode);
    }, []);

    // Handle pagination
    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            setCurrentPage(newPage);
        }
    }, [pageCount]);

    // Handle item selection for detail view
    const handleItemClick = useCallback((item) => {
        setSelectedItem(item);
    }, []);

    // Handle closing detail view
    const handleCloseDetail = useCallback(() => {
        setSelectedItem(null);
    }, []);

    // Render pagination controls
    const renderPagination = () => {
        if (pageCount <= 1) return null;

        return (
            <div className={`propaganda-pagination ${isModern ? 'modern' : 'retro'}`}>
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    &#171; First
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    &#8249; Prev
                </button>
                <span className="pagination-info">
                    Page {currentPage} of {pageCount}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    className={`pagination-button ${currentPage === pageCount ? 'disabled' : ''}`}
                >
                    Next &#8250;
                </button>
                <button
                    onClick={() => handlePageChange(pageCount)}
                    disabled={currentPage === pageCount}
                    className={`pagination-button ${currentPage === pageCount ? 'disabled' : ''}`}
                >
                    Last &#187;
                </button>
            </div>
        );
    };

    // Render item details modal
    const renderItemDetails = () => {
        if (!selectedItem) return null;

        return (
            <div className={`propaganda-detail-modal ${isModern ? 'modern' : 'retro'}`}>
                <div className="modal-content">
                    <button className="close-button" onClick={handleCloseDetail}>×</button>
                    <h2>{selectedItem.title}</h2>
                    <div className="detail-image-container">
                        <img
                            src={selectedItem.imagePath}
                            alt={selectedItem.title}
                            className={selectedItem.isGif ? 'gif-image' : 'static-image'}
                        />
                    </div>
                    <p className="detail-description">{selectedItem.description}</p>
                    <div className="detail-metadata">
                        <p>Date: {new Date(selectedItem.date).toLocaleDateString()}</p>
                        <div className="detail-tags">
                            {selectedItem.tags.map(tag => (
                                <span key={tag} className="detail-tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`propaganda-sub ${isModern ? 'modern-propaganda' : 'retro-propaganda'}`}>
            <div className="propaganda-header">
                <p className="propaganda-subtitle">
                    {isModern
                        ? 'Access citizen information materials authorized for public dissemination'
                        : 'PUBLIC MORALE ENHANCEMENT MEDIA ARCHIVE'}
                </p>
            </div>

            <div className="propaganda-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search propaganda materials..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={`search-input ${isModern ? 'modern-input' : 'retro-input'}`}
                    />
                    <div className={`search-icon ${isModern ? 'modern-icon' : 'retro-icon'}`}>
                        {isModern ? '🔍' : '⌕'}
                    </div>
                </div>

                <div className="control-options">
                    <div className="sort-control">
                        <label htmlFor="sort-select">Sort: </label>
                        <select
                            id="sort-select"
                            value={sortOrder}
                            onChange={handleSortChange}
                            className={isModern ? 'modern-select' : 'retro-select'}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button
                            onClick={() => handleViewModeChange('grid')}
                            className={`view-button ${viewMode === 'grid' ? 'active' : ''} ${isModern ? 'modern-button' : 'retro-button'}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => handleViewModeChange('list')}
                            className={`view-button ${viewMode === 'list' ? 'active' : ''} ${isModern ? 'modern-button' : 'retro-button'}`}
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>

            {allTags.length > 0 && (
                <div className="tag-filter">
                    <div className="tag-list">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`tag-button ${activeTag === tag ? 'active' : ''} ${isModern ? 'modern-tag' : 'retro-tag'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    {activeTag && (
                        <button
                            className={`clear-tag ${isModern ? 'modern-clear' : 'retro-clear'}`}
                            onClick={() => setActiveTag('')}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            )}

            {loading ? (
                <div className={`loading-indicator ${isModern ? 'modern-loading' : 'retro-loading'}`}>
                    <div className="spinner"></div>
                    <p>Loading propaganda materials...</p>
                </div>
            ) : error ? (
                <div className={`error-message ${isModern ? 'modern-error' : 'retro-error'}`}>
                    <p>Error loading propaganda materials. The System apologizes for the inconvenience.</p>
                    <p className="error-details">{error}</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className={`no-results ${isModern ? 'modern-no-results' : 'retro-no-results'}`}>
                    <p>No propaganda materials match your search criteria.</p>
                    <p>Adjust your search parameters or contact the Ministry of Information.</p>
                </div>
            ) : (
                <div className={`propaganda-gallery ${viewMode === 'grid' ? 'grid-view' : 'list-view'} ${isModern ? 'modern-gallery' : 'retro-gallery'}`}>
                    {currentItems.map(item => (
                        <div
                            key={item.id}
                            className={`propaganda-item ${isModern ? 'modern-item' : 'retro-item'} ${item.isGif ? 'gif-item' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="item-image-container">
                                <img
                                    src={item.imagePath}
                                    alt={item.title}
                                    className={`item-image ${item.isGif ? 'gif-image' : ''}`}
                                />
                                {item.isGif && <span className="gif-badge">GIF</span>}
                            </div>
                            <div className="item-details">
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-description">{item.description}</p>
                                <div className="item-metadata">
                                    <span className="item-date">{new Date(item.date).toLocaleDateString()}</span>
                                    <div className="item-tags">
                                        {item.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="item-tag">{tag}</span>
                                        ))}
                                        {item.tags.length > 3 && <span className="more-tags">+{item.tags.length - 3}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pageCount > 1 && renderPagination()}
            {selectedItem && renderItemDetails()}
        </div>
    );
};

export default PropagandaSub;