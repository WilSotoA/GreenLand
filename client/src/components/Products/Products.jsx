import style from "./Products.module.css";
import loader from "../../assets/loaderGif.gif"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getAllCategories } from "../../redux/action";
import { Product } from "../Product/Product";
import { Pagination } from "../Paginate/Paginate";
import { Filters } from "../Filters/Filters";

export const Products = () => {
  const dispatch              = useDispatch();
  const [loading, setLoading] = useState(true);
  const numPageState          = useSelector((state) => state.numPageState);
  const filterProducts        = useSelector((state) => state.filterProducts);

  const cantProdcutsForPage = 12;
  let start                 = (numPageState - 1) * cantProdcutsForPage;
  let end                   = numPageState * cantProdcutsForPage;
  let cantPages             = Math.ceil((filterProducts.filteredProducts ? filterProducts.filteredProducts.length : filterProducts.length) / cantProdcutsForPage);
  const dataSlice           = filterProducts.filteredProducts ? filterProducts.filteredProducts.slice(start, end) : filterProducts.slice(start, end);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());

    const searchParams     = new URLSearchParams(window.location.search);
    const collectionStatus = searchParams.get('collection_status');

    collectionStatus === 'approved' && localStorage.clear();

    if (filterProducts.length > 0 && loading === true) {
      setLoading(false);
    }
  }, [dispatch, filterProducts.length, loading]);

  return (
    <>
      {
        loading === true 
        ?
        <div className={style.prodsContLoader}>
          <img src={loader} alt="Loader"></img>
        </div>
        :
        <>
          <main className={style.prodsParent}>
            <Filters />
            <section className={`${style.prodsDivProducts} ${style.prodsGrid}`}>
              {dataSlice.map((product) => product.active === true && (
                    <Product
                      key         = {product.id}
                      id          = {product.id}
                      name        = {product.name}
                      rating      = {product.rating}
                      description = {product.description}
                      price       = {product.price}
                      image       = {product.image}
                    />
                  )
              )}
            </section>
          </main>
          <div className={style.paginate}>
            <Pagination numPage={numPageState} cantPage={cantPages} />
          </div>
        </>
      }
    </>
  );
};
