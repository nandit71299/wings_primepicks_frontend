import React, { useState, useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { getAllCategories, getAllProducts } from "../apiUtil";

function AllProducts() {
  const { id } = useParams(); // This will give you the product ID from the URL
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = queryParams.get("page") || 1;
  const initialPageSize = queryParams.get("page_size") || 5;
  const initialCategory = queryParams.get("category") || "";
  const initialSearch = queryParams.get("search") || "";
  const initialSortBy = queryParams.get("sort_by_price") || "asc"; // Default to "asc"

  const [currentPage, setCurrentPage] = useState(Number(initialPage));
  const [productsPerPage] = useState(Number(initialPageSize));
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const { productsData, categoriesData } = useLoaderData();
  const { totalPages } = productsData;
  const { products } = productsData;
  const { categories } = categoriesData;

  // Handle category change
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    updateUrl({ category: newCategory, page: 1 }); // Reset to page 1 when category changes
  };

  // Handle sorting change (using sort_by_price)
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    updateUrl({ page: 1, sort_by_price: newSortBy }); // Reset to page 1 when sorting changes
  };

  // Update URL query parameters
  const updateUrl = (newParams) => {
    const url = new URL(window.location.href);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        url.searchParams.set(key, newParams[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    navigate(url.pathname + url.search);
  };

  // Filter unique categories
  const uniqueCategories = categories
    .map((category) => category)
    .filter(
      (category, index, self) =>
        index === self.findIndex((cat) => cat.id === category.id)
    );

  // Loader check
  if (!products) return <div>Loading...</div>;

  return (
    <div>
      {/* Render filters and products only if no 'id' */}

      {!id && (
        <>
          {/* Filters and Sorting Options */}
          <div className="flex p-4 justify-evenly">
            <select
              name="category"
              id="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                name="name"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => updateUrl({ search, page: 1 })}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Search
              </button>
            </div>

            <select
              name="sort_by_price"
              id="sort_by_price"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="asc">Sort by Price: Low to High</option>
              <option value="desc">Sort by Price: High to Low</option>
            </select>
          </div>

          {/* Products List */}
          <div className="p-5 flex gap-10 flex-wrap">
            {products.map((product, index) => (
              <div key={index} className="flex h-[330px] w-[330px]">
                <ProductCard
                  product={product}
                  productUrl={`/products/${product.id}`}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 my-4">
            <button
              onClick={() => {
                const prevPage = currentPage - 1;
                setCurrentPage(prevPage);
                updateUrl({ page: prevPage });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Prev
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => {
                const nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                updateUrl({ page: nextPage });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
      {/* If 'id' is present, only render the Outlet */}
      {id && <Outlet />}
    </div>
  );
}

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.search);

  const page = queryParams.get("page") || 1;
  const pageSize = queryParams.get("page_size") || 5;
  const category = queryParams.get("category") || "";
  const search = queryParams.get("search") || "";
  const sortByPrice = queryParams.get("sort_by_price") || "asc";

  const productsResponse = await getAllProducts(
    page,
    pageSize,
    category,
    search,
    sortByPrice
  );
  const categoriesResponse = await getAllCategories();

  if (!productsResponse.success || !categoriesResponse.success) {
    throw new Error(
      productsResponse.message ||
        categoriesResponse.message ||
        "Error Fetching Products"
    );
  } else {
    return {
      productsData: productsResponse,
      categoriesData: categoriesResponse,
    };
  }
};

export default AllProducts;
