import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct, getSizes } from "../../services/api";

import { Carousel } from "./carousel";

import "../../styles/product-page-card.css";

export function ProductPage({ cartListHandler }) {
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const product = await getProduct(productId);
      setProduct(product);
    })();
  }, [productId]);

  const handleAddToCart = (colorSizeId) => {
    const ids = {
      ...colorSizeId, //{colorId, sizeId}
      productId: productId,
    };
    cartListHandler({ id: Object.values(ids).join("-"), ids: ids });
  };

  return (
    <>
      {(product && (
        <ProductCard
          title={product.name}
          colors={product.colors}
          handleAddToCart={handleAddToCart}
        />
      )) || <p>Загрузка</p>}
    </>
  );
}

const ProductCard = (props) => {
  const { title, colors, handleAddToCart } = props;

  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleColor = (id) => {
    const newColor = colors.find((color) => color.id == id);
    setSelectedColor(newColor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [submitButton, colorSelector, sizeSelector] = e.target;
    handleAddToCart({ sizeId: String(sizeSelector.value), colorId: String(colorSelector.value) });
  };

  return (
    <section className="product-card">
      <Carousel images={selectedColor?.images} />

      <div className="info-select-area">
        <h3>{title}</h3>

        <form onSubmit={handleSubmit}>
          <div className="to-cart-submit-area">
            <h4>{selectedColor?.price} $</h4>
            <button type="submit">Добавить в корзину</button>
          </div>

          <label>
            Цвет: &nbsp;
            <select
              id="color-selector"
              value={selectedColor?.id ?? ""}
              onChange={(e) => handleColor(e.target.value)}
              required
            >
              <option key="color-opt-0" value="" disabled>
                ---
              </option>
              {colors.map((color) => (
                <option key={`color-opt-${color.id}`} value={color.id}>{`${color.name}`}</option>
              ))}
            </select>
          </label>

          <SizeSelector accessSizes={selectedColor?.sizes} />
        </form>

        <details>
          <summary>Описание</summary>
          <div>
            <p>{selectedColor?.description}</p>
          </div>
        </details>
      </div>
    </section>
  );
};

function SizeSelector({ accessSizes }) {
  const [selectedSizeId, setSelectedSize] = useState(accessSizes[0]);

  useEffect(() => {
    if (!accessSizes.includes(Number(selectedSizeId))) setSelectedSize(accessSizes[0] ?? "");
  }, [accessSizes]);

  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    (async () => {
      const sizes = await getSizes();
      setSizes(sizes);
    })();
  }, []);

  return (
    <label>
      Размер: &nbsp;
      <select
        id="size-selector"
        value={selectedSizeId}
        onChange={(e) => setSelectedSize(e.target.value)}
        required
      >
        <option key="size-opt-0" value="" disabled>
          ---
        </option>
        {sizes.map((size) => (
          <option
            disabled={!accessSizes.includes(size.id)}
            key={`size-opt-${size.id}`}
            value={size.id}
          >{`${size.number} (${size.label})`}</option>
        ))}
      </select>
    </label>
  );
}
