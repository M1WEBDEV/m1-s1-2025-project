import { Breadcrumb } from "antd";
import type { BreadcrumbProps } from "antd";
import { Link } from "@tanstack/react-router";

export interface CrumbItem {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

interface BreadcrumbsProps {
  items: CrumbItem[];
  breadcrumbProps?: BreadcrumbProps;
}

export const Breadcrumbs = ({ items, breadcrumbProps }: BreadcrumbsProps) => {
  return (
    <Breadcrumb
      style={{ marginBottom: 16 }}
      items={items.map((item) => ({
        title: item.to ? (
          <Link to={item.to} params={item.params}>
            {item.label}
          </Link>
        ) : (
          item.label
        ),
      }))}
      {...breadcrumbProps}
    />
  );
};


