import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/api";

import "../../styles/catalog-page.css";

import basename from "../../services/basename";

export function CatalogPage({}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  return (
    <section className="catalog-container">
      {products.map((el) => (
        <ProductCard key={`product-id-${el.id}`} data={el} />
      ))}
    </section>
  );
}

function ProductCard({ data }) {
  const { id, name, colors } = data;

  return (
    <article className="catalog-item">
      <Link to={`/product/${id}`}>
        <div className="img-container">
          {colors.map(
            (color, index) =>
              (index < 5 && (
                <img key={`product-image-${index}`} src={basename + color.images[0]}></img>
              )) ||
              null
          )}
        </div>
        <h3>{name}</h3>
      </Link>
    </article>
  );
}
