import { fectProducts } from "@/api/analize";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react"

const ProductOverview = () => {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const result = await fectProducts(
          {
            keyword: "", status: "", isDelete: "false"
          },
          {
            pageNum: 1,
            pageSize: 0,
            totalPages: 0,
            totalItems: 0
          }
        );

        

        const productList = result?.data?.pageData || [];

        setTotalProducts(productList.length);
      } catch (err) {
        console.log('Failed to fetch products with error: ', err);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, [])

  return (
    <div className="p-6 border rounded-xl dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FontAwesomeIcon 
            icon={faBox}           
            className="text-violet-500 text-lg" 
          />
          Product Overview
        </h2>
        <span className="text-sm text-zinc-500">
          {!loading ? "Loading..." : "Updated just now"}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 dark:bg-violet-800/30 rounded-full">
          <FontAwesomeIcon
            icon={faBox}
            className="text-violet-500 text-xl"
          />
        </div>
        <div>
          <p className="text-sm text-zinc-500">Total Products</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : totalProducts.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductOverview
