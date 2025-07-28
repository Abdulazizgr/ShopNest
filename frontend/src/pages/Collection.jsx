import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets/frontend_assets/assets";
import { ProductItem, Title } from "../components";
import Section from "../components/Section";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = React.useState(false);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [Category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (Category.includes(selectedCategory)) {
      setCategory((prev) => prev.filter((cat) => cat !== selectedCategory));
    } else {
      setCategory((prev) => [...prev, selectedCategory]);
    }
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    if (SubCategory.includes(selectedSubCategory)) {
      setSubCategory((prev) =>
        prev.filter((subCat) => subCat !== selectedSubCategory)
      );
    } else {
      setSubCategory((prev) => [...prev, selectedSubCategory]);
    }
  };

  const applyFilters = () => {
    let filtered = products.slice();

    if (showSearch && search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (Category.length > 0) {
      filtered = filtered.filter((product) =>
        Category.includes(product.category)
      );
    }

    if (SubCategory.length > 0) {
      filtered = filtered.filter((product) =>
        SubCategory.includes(product.subCategory)
      );
    }

    setFilteredProducts(filtered);
  };

  const sortProducts = () => {
    let sortedProducts = filteredProducts.slice();
    switch (sortOption) {
      case "low-to-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        setFilteredProducts(sortedProducts);
        break;
      case "high-to-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        setFilteredProducts(sortedProducts);
        break;
      default:
        applyFilters();
        break; // No sorting
    }
  };

  useEffect(() => {
    applyFilters();
  }, [Category, SubCategory, search, products, showSearch]);

  useEffect(() => {
    sortProducts();
  }, [sortOption]);

  return (
    <Section>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        {/* Filter Options */}

        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt="Dropdown Icon"
              className={`h-3  sm:hidden ${showFilter ? "rotate-90" : ""} `}
            />
          </p>

          {/* Category Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Men"}
                  onChange={handleCategoryChange}
                />{" "}
                <span>Men</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3 "
                  value={"Women"}
                  onChange={handleCategoryChange}
                />{" "}
                <span>Women</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Kids"}
                  onChange={handleCategoryChange}
                />{" "}
                <span>Kids</span>
              </p>
            </div>
          </div>
          {/* Subcategory Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"T-Shirts & Shirts"}
                  onChange={handleSubCategoryChange}
                />{" "}
                <span>T-Shirts & Shirts</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Hoodies & Sweatshirts"}
                  onChange={handleSubCategoryChange}
                />{" "}
                <span>Hoodies & Sweatshirts</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Jackets & Coats"}
                  onChange={handleSubCategoryChange}
                />{" "}
                <span>Jackets & Coats</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Pants & Jeans"}
                  onChange={handleSubCategoryChange}
                />{" "}
                <span>Pants & Jeans</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Shorts"}
                  onChange={handleSubCategoryChange}
                />{" "}
                <span>Shorts</span>
              </p>
              <p className=" flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Dresses & Skirts"}
                  onChange={handleSubCategoryChange}
                />{" "}
                <span>Dresses & Skirts</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1="ALL" text2="COLLECTION" />
            {/* Product Sort */}
            <select
              onChange={(e) => setSortOption(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2 outline-none"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-to-high">Sort by: Low to High </option>
              <option value="high-to-low">Sort by: High to Low </option>
            </select>
          </div>

          {/* Map filtered Products */}

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <img
                src={assets.empty}
                alt="No Products Found"
                className="w-1/2 md:w-1/3"
              />
              <p className="text-gray-500 mt-4 text-center">
                <b>No products</b> <br /> found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
              {filteredProducts.map((product, index) => (
                <ProductItem
                  key={index}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  averageRating={product.averageRating}
                  reviewLength={product.reviews.length}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Collection;
