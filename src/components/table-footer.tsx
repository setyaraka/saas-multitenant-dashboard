import { Pagination } from "@heroui/pagination";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";
import RowsPerPage from "@/components/rows-per-page";

type TableFooterProps = {
  totalItems: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  pageSizeOptions?: number[];
  showRange?: boolean;
  className?: string;
};

export default function TableFooter({
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  showRange = false,
  className = "",
}: TableFooterProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);

  return (
    <Row className={`items-center mt-5 ${className}`}>
      <Col xs={4}>
        <span className="text-sm text-gray-500">
          {showRange
            ? totalItems === 0
              ? "0 of 0"
              : `${start}–${end} of ${totalItems}`
            : `Total Item: ${totalItems}`}
        </span>
      </Col>

      <Col className="flex justify-center" xs={4}>
        <Pagination
          page={safePage}
          total={totalPages}
          onChange={onPageChange}
        />
      </Col>

      <Col className="flex justify-end" xs={4}>
        <RowsPerPage
          options={pageSizeOptions}
          value={pageSize}
          onChange={(n) => {
            onPageSizeChange(n);
            if (safePage !== 1) onPageChange(1);
          }}
        />
      </Col>
    </Row>
  );
}
