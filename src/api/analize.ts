import type { SearchCondition, CustomersPageInfo, ProductsPageInfo } from "@/pages/admin/Analize/types";

export async function fetchCustomers(searchCondition: SearchCondition, pageInfo: CustomersPageInfo) {
  const response = await fetch('http://localhost:5273/api/Customer/search', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify({ searchCondition, pageInfo })
  });

  if (!response.ok) {
    throw new Error ("Failed to fetch users!");
  }

  return response.json();
}

export async function fectProducts(searchCondition: SearchCondition, pageInfo: ProductsPageInfo) {
  const response = await fetch ('http://localhost:5273/api/Product/search', {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },

    body: JSON.stringify({ searchCondition, pageInfo })
  });

  if (!response.ok) {
    throw new Error("Failed to fecth products");
  }

  return response.json();
}