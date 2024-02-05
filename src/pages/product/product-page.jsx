import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct, getSizes } from "../../services/api";

import { Carousel } from "./carousel";

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
    const [color, size] = e.target;
    handleAddToCart({ sizeId: String(size.value), colorId: String(color.value) });
  };

  return (
    <section>
      <Carousel images={selectedColor?.images} />

      <div>
        <h3>{title}</h3>

        <p>{selectedColor?.price} $</p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit">Добавить в корзину</button>
        </form>

        <details>
          <summary>Описание</summary>
          <p>{selectedColor?.description}</p>
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
