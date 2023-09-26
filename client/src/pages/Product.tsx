import axios from "axios";
import { useEffect, useState } from "react";
import { ipinfoToken } from "../config/config";
interface IProps {
  _id: string;
  title: string;
  description: string;
  owner: {
    [key: string]: any;
  };
  date: Date;
  user: any;
}

function Product({
  _id,
  title,
  description,
  owner,
  date,
  user,
}: IProps) {
  const [productInfo, setProductInfo] = useState<any>({});
  const [userCurrencyInfo, setUserCurrencyInfo] = useState<any>({});
  const productID = _id;

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

  useEffect(() => {
    // Fetch the product information by making an API request
    axios.get(`/api/products/${productID}`)
      .then((response) => {
        setProductInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product information:", error);
      });

    // Fetch user's currency information when the component mounts
    getUserCurrencyInfo();
  }, [productID]);

  // Function to calculate the displayed price based on the user's currency
  const calculateDisplayedPrice = () => {
    if (productInfo.countryPricing && userCurrencyInfo.currency) {
      if (productInfo.countryPricing.currency === userCurrencyInfo.currency) {
        return productInfo.countryPricing.price;
      } else {
        return productInfo.countryPricing.price * userCurrencyInfo.rate;
      }
    }
    return "Loading price...";
  };

  return (
    <div className="flex items-center justify-center bg-purple-100">
      <div className="min-h-screen w-10/12 m-auto sm:w-3/4 x-10 bg-white">
        <div className="my-8 w-10/12 m-auto">
          <h1 className="font-semibold text-3xl md:text-4xl">Title: {title}</h1>
          <div className="text-sm">
            <p className="my-2">
              By <em className="text-slate-500 ">{owner.username}</em>
            </p>
            <p>Published on {new Date(date).toLocaleString()}</p>
            <p>Price: {calculateDisplayedPrice()} {userCurrencyInfo.currency}</p>
          </div>
        </div>
        <p className="text-left mt-8 w-10/12 m-auto sm:w-4/5">Description: {description}</p>
      </div>
    </div>
  );
}

export default Product;
