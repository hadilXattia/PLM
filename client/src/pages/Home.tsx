import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ipinfoToken } from "../config/config";

interface IProduct {
  _id: string;
  title: string;
  description: string;
  owner: {
    [key: string]: any;
  };
  date: Date;
  countryPricing: any[];
}

interface IProps {
  user: any;
  products: IProduct[];
}

function Home({ user, products }: IProps) {
  const [userCurrencyInfo, setUserCurrencyInfo] = useState<any>({});

  useEffect(() => {
    document.title = "Home | PLM";
  }, []);

  // Function to get user's currency and rate based on their IP address
  const getUserCurrencyInfo = () => {
    axios
      .get(`https://ipinfo.io?token=${ipinfoToken}`)
      .then((response) => {
        const { country } = response.data;
        axios
          .get(`http://ip-api.com/json/${country}`)
          .then((currencyResponse) => {
            const currency = currencyResponse.data.currency || 'USD'; // Use USD as a default if currency is not available
            const rate = 1; // You may set a default rate here if needed
            setUserCurrencyInfo({ currency, rate });
          })
          .catch((currencyError) => {
            console.error("Error fetching user's currency information:", currencyError);
          });
      })
      .catch((error) => {
        console.error("Error fetching user location:", error);
      });
  };

  // Call the function to get user's currency information when the component mounts
  useEffect(() => {
    getUserCurrencyInfo();
  }, []);

  return (
    <div>
      <div className="bg-gray-300 py-20 px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Welcome to PLM
        </h1>
        <p className="pt-4 w-60 sm:w-72 md:w-96 leading-6">
          Hi there! Welcome to PLM, where anyone can find different kinds of products and information about them. PLM stands for Product Listing Manager.
        </p>
        {!user ? (
          <div>
            <Link to="/signup">
              <button className="px-8 py-1 mt-4 rounded border-2 border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600">
                Sign up
              </button>
            </Link>
          </div>
        ) : null}
      </div>
      <h2 className="text-3xl mt-12 px-12 font-semibold">Products</h2>
      <div className="flex items-center justify-center flex-wrap mx-8 lg:justify-start lg:items-start">
        {products && products.length === 0 ? (
          <p className="text-2xl text-center m-auto mt-4">Coming Soon</p>
        ) : (
          products
            .slice(0)
            .reverse()
            .map((product: IProduct) => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="m-4 p-4 text-center border-2 rounded hover:shadow-lg">
                  <h2 className="text-1xl font-bold pt-2">{product.title}</h2>
                  <div className="flex">
                    <p className="text-sm m-5">
                      By{" "}
                      <em className="text-slate-500">{product.owner?.username}</em>
                    </p>
                    <p className="text-sm m-5">
                Price:{" "}
                {product.countryPricing ? (
                  product.countryPricing.map((cp: any) => (
                    <span key={cp._id}>
                      {userCurrencyInfo.currency === cp.currency
                        ? `${cp.price} ${cp.currency}`
                        : `${cp.price * userCurrencyInfo.rate} ${userCurrencyInfo.currency}`}
                      <br />
                    </span>
                  ))
                ) : (
                  "Price not available"
                )}
              </p>

                  </div>
                  <p className="text-sm">
                    Published: {new Date(product.date).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))
        )}
      </div>
    </div>
  );
  
}

export default Home;