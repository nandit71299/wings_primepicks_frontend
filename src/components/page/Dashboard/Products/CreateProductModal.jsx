import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllCategories, createProduct } from "../../../../apiUtil";

const CreateProductModal = ({ closeModal, setFetchProducts }) => {
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // To show the image preview
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    available_quantity: "",
    image: null, // Will store the file here
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the image file in state
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        image: file,
      }));

      // Set the image preview (for displaying the image thumbnail)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("available_quantity", newProduct.available_quantity);
    formData.append("image", newProduct.image);

    const response = await createProduct(formData);
    if (response.success) {
      setSubmitting(false);
      toast.success("Product created successfully!");
      setFetchProducts(true);
      closeModal();
    } else {
      toast.error(response.message || "Failed to create product");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-scroll">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Create New Product</h3>
        <form onSubmit={handleCreateProduct}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Available Quantity
            </label>
            <input
              type="number"
              name="available_quantity"
              value={newProduct.available_quantity}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {/* Preview the image once selected */}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={submitting}
            >
              {submitting ? "Submitting" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
