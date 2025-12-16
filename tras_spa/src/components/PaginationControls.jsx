// reusable pagination controls component
function PaginationControls(props) {
  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const onNext = props.onNext;
  const onPrevious = props.onPrevious;
  const itemsCount = props.itemsCount;
  const itemsPerPage = props.itemsPerPage;

  // hide if not needed
  if (itemsCount <= itemsPerPage) {
    return null;
  }

  return (
    <div className="pagination-controls">
      <button 
        className="pagination-btn prev-btn"
        onClick={onPrevious}
        disabled={currentPage === 0}
      >
        ← Poprzednie
      </button>
      <span className="pagination-text">
        {currentPage + 1} / {totalPages}
      </span>
      <button 
        className="pagination-btn next-btn"
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
      >
        Następne →
      </button>
    </div>
  );
}

export default PaginationControls;
