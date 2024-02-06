import { Link, useLocation } from "react-router-dom";

import "../styles/pages-header.css";

const Pages = [
  {
    title: "Товар",
    path: "/product/",
  },
  {
    title: "Корзина",
    path: "/cart",
  },
  // !
  {
    title: "Каталог",
    path: "/",
  },
];

export function PagesHeader(props) {
  const { cartItemsCount } = props;

  const pathname = useLocation().pathname;
  const { title, path } = Pages.find((el) => pathname.includes(el.path));

  return (
    <header className="general-header">
      <div>
        <h1>ЦУМ</h1>
        <nav>
          <Link to="/">Каталог</Link>
          <Link to="/cart">{`Корзина [${cartItemsCount}]`}</Link>
        </nav>
      </div>
      <header className="sub-header">
        {(path == "/cart" && <Link to={-1}>Назад</Link>) || <h2>{title}</h2>}
      </header>
    </header>
  );
}
