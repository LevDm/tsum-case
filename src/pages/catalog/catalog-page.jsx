import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/api";

import "../../styles/catalog-product-card.css";

export function CatalogPage({}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  return (
    <section>
      {products.map((el) => (
        <ProductCard key={`product-id-${el.id}`} data={el} />
      ))}
    </section>
  );
}

function ProductCard({ data }) {
  const { id, name, colors } = data;

  return (
    <article>
      <Link to={`/product/${id}`}>
        <h3>{name}</h3>
        <div className="img-container">
          {colors.map(
            (color, index) =>
              (index < 5 && <img key={`product-image-${index}`} src={color.images[0]}></img>) ||
              null
          )}
        </div>
      </Link>
    </article>
  );
}
