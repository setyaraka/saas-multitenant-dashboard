import { Select, SelectItem } from "@heroui/select";

export default function RowsPerPage() {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Row per page</span>
        <Select
          size="sm"
          defaultSelectedKeys={["10"]}
          className="w-20"
          aria-label="Row per page"
        >
          <SelectItem key="5">5</SelectItem>  
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="25">25</SelectItem>
          <SelectItem key="50">50</SelectItem>
        </Select>
      </div>
    );
}