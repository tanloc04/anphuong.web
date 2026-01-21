import type { ReactNode } from "react";

export interface ManagementLayoutProps {
    title: string,
    children: ReactNode,
    searchTerm?: string,
    onSearchChange?: (val: string) => void,
    onCreate?: () => void,
    createButtonLabel?: string
}