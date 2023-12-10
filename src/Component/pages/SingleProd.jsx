
import "./style.css";
import { cartContext } from "../../context/ContextPro";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const SingleProd = ({ item }) => {
  const {
    dispatch,
    state: { cart },
  } = useContext(cartContext);

  const getImageUrl = (imageName) => {
    // Assuming your server is running on http://localhost:8000
    return `http://localhost:8000${imageName}`;
  };
  // const parts = item.image_urls[0].split("/uploads");
  // const textAfterUploads = parts[1];
  return (
    <>
      <div className="product-card">
        <Link className="Link2" to={`/productdetail/${item.id}`}>
          <img
            src={getImageUrl(item.image_urls[0])}
            className="product-card__image"
            alt="Product"
          />
          <h5 className="product-card__title">{` ${item.company} ${item.name.substring(0, 30)}... `}</h5>
        </Link>
        <div className="product-card__price">{`₹ ${item.price} /-`} </div>
        {cart.some((p) => p.id === item.id) ? (
          <button

            className="product-card__button detail_button"
            onClick={() => {
              dispatch({
                type: "DECREMENT",
                playload: item,
              });
            }}
          >
            Remove from Cart
          </button>
        ) : (
          <button
            className="product-card__button detail_button"
            onClick={() => {
              dispatch({
                type: "INCREMENT",
                playload: item,
              });
              console.log(item.price+ " is type of "+typeof item.price)
            }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </>
  );
};

export default SingleProd;
