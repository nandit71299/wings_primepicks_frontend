import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteProduct, getAllProducts, getSellerProducts } from "../apiUtil";
import { toast } from "react-toastify";
import CreateProductModal from "../components/page/Dashboard/Products/CreateProductModal";
import ChangeStatusModal from "../components/page/Dashboard/Products/ChangeStatusModal";

function Products() {
  const user = useSelector((state) => state.user.user);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false);
  const [fetchProducts, setFetchProducts] = useState(true);

  useEffect(() => {
    if (user.role === "admin" && fetchProducts === true) {
      const getAllProductsFromApi = async () => {
        const response = await getAllProducts();
        if (response.success) {
          setProducts(response.products);
        } else {
          toast.error("Failed to get products");
        }
        setFetchProducts(false);
      };
      getAllProductsFromApi();
    } else if (user.role === "seller" && fetchProducts === true) {
      const getSellerProductsFromApi = async () => {
        const response = await getSellerProducts(user.id);
        if (response.success) {
          setProducts(response.products);
        } else {
          toast.error("Failed to get products");
        }
        setFetchProducts(false);
      };
      getSellerProductsFromApi();
    }
  }, [user.role, fetchProducts]);

  const openCreateProductModal = () => {
    setCreateProductModalOpen(true);
  };

  const closeCreateProductModal = () => {
    setCreateProductModalOpen(false);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmation) {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("Product deleted successfully");
        setFetchProducts(true);
      } else {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold ">
          All {user.role === "admin" ? "Platform Products" : "Products"}
        </h1>
        <div>
          {user.role === "seller" && (
            <button
              onClick={openCreateProductModal}
              className="text-white hover:text-blue-700 bg-blue-500 p-2 rounded-sm"
            >
              Create New
            </button>
          )}
        </div>
      </div>
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Product ID</th>
            <th className="px-4 py-2 text-left font-semibold">Image</th>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Description</th>
            <th className="px-4 py-2 text-left font-semibold">Price</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            {user.role === "admin" && (
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">
                  <img src={product.img} className="h-[50px] w-auto" alt="" />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.description}</td>
                <td className="px-4 py-2">${product.price}</td>
                <td className="px-4 py-2">{product.status}</td>
                {user.role === "admin" && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openModal(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Change Status
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={user.role === "admin" ? 6 : 5}
                className="px-4 py-2 text-center text-gray-500"
              >
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {createProductModalOpen && (
        <CreateProductModal
          closeModal={closeCreateProductModal}
          setFetchProducts={setFetchProducts}
        />
      )}

      {isModalOpen && selectedProduct && (
        <ChangeStatusModal
          product={selectedProduct}
          closeModal={closeModal}
          setFetchProducts={setFetchProducts}
        />
      )}
    </div>
  );
}

export default Products;
