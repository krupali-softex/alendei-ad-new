import React from "react";
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Calculate the 3-page window: center on current page
  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(totalPages, startPage + 2);
  const visiblePages = [];
  for (let p = startPage; p <= endPage; p++) visiblePages.push(p);

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  const canSkipBack = page > 10;
  const canSkipForward = page <= totalPages - 10;

  return (
    <nav>
      <ul className="pagination mb-0 justify-content-center">

        {/* << Skip Back 10 */}
        <li className={`page-item ${!canSkipBack ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(Math.max(1, page - 10))}
            disabled={!canSkipBack}
          >
            <i className="bi bi-chevron-double-left" />
          </button>
        </li>

        {/* < Prev */}
        <li className={`page-item ${!canGoBack ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoBack}
          >
            <i className="bi bi-chevron-left" />
          </button>
        </li>

        {/* Page Numbers */}
        {visiblePages.map((p) => (
          <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>
              {p}
            </button>
          </li>
        ))}

        {/* > Next */}
        <li className={`page-item ${!canGoForward ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoForward}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </li>

        {/* >> Skip Forward 10 */}
        <li className={`page-item ${!canSkipForward ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(Math.min(totalPages, page + 10))}
            disabled={!canSkipForward}
          >
            <i className="bi bi-chevron-double-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
