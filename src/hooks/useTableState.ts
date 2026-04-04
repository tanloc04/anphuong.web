import { useState } from "react";

export const useTableState = (defaultRows: number = 10) => {
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: defaultRows,
    page: 0,
    sortField: null as string | null,
    sortOrder: null as 1 | -1 | null,
  });

  const onPage = (event: any) => {
    setLazyParams((prev) => ({
      ...prev,
      first: event.first,
      rows: event.rows,
      page: event.page ?? 0,
    }));
  };

  const onSort = (event: any) => {
    setLazyParams((prev) => ({
      ...prev,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    }));
  };

  const resetPage = () => {
    setLazyParams((prev) => ({
      ...prev,
      first: 0,
      page: 0,
    }));
  };

  return {
    lazyParams,
    setLazyParams,
    onPage,
    onSort,
    resetPage,
  };
};