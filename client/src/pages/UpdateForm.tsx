import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  setProducts: any;
}

interface IOwner {
  _id: string;
  username: string;
}

function UpdateForm({
  _id,
  title,
  description,
  owner,
  date,


  setProducts,
}: IProduct) {
  const navigate = useNavigate();
  const [productTitle, setProductTitle] = useState<string>(title);
  const [productDescription, setProductDescription] = useState<string>(description);
  const [productOwner, setProductOwner] = useState<IOwner>(
    JSON.parse(localStorage.getItem("user")!).user
  );
  const [productDate, setProductDate] = useState<any>(new Date());

  const [price, setProductPrice] = useState<string>("");
  const [userLocation, setUserLocation] = useState({ country: "", currency: "" });
  useEffect(() => {
    document.title = "Update | PLM";
  
    // Fetch user's location information using ipinfo.io API
    axios
      .get(`https://ipinfo.io?token=${ipinfoToken}`) // Use the imported token
      .then((response) => {
        const { country } = response.data;
  
        // Use the user's country to fetch currency information from ip-api.com
        axios
          .get(`http://ip-api.com/json/${country}`)
          .then((currencyResponse) => {
            const currency = currencyResponse.data.currency || 'USD'; // Use USD as a default if currency is not available
        
  
            setUserLocation({ country, currency });
          })
          .catch((currencyError) => {
            console.error("Error fetching currency information:", currencyError);
          });
      })
      .catch((error) => {
        console.error("Error fetching user location:", error);
      });
  }, []);
  
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    title = productTitle;
    description = productDescription;
    owner = productOwner;
    date = productDate;
  


    let data = JSON.stringify({
      title,
      description,
      owner,
      date,
price,
      currency: userLocation.currency, 
      country: userLocation.country,
    
    });
    axios
      .put(`/api/products/${_id}/update`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${
            JSON.parse(localStorage.getItem("user")!).token
          }`,
        },
      })
      .then((res) => {
        setProducts((prevState: IProduct[]) => {
          return prevState.map((product: IProduct) =>
            _id === product._id ? res.data : product
          );
        });
        axios.get("/api/products").then((res) => {
          setProducts(res?.data);
        });
        navigate("/");
      })
      .catch((err) => console.log(err.response.data));
  };



  return (
    <>
      <div className="z-[-10] bg-black-500 w-4/5 md:w-1/2 mt-24 absolute left-1/2 -translate-x-1/2">
        <div className="border-2 p-10 shadow-xl rounded-md">
          <h1 className="text-purple-600 text-2xl md:text-3xl font-bold pb-4">
            Update product
          </h1>
          <form onSubmit={(e) => handleUpdate(e)}>
            {/* product title */}
            <label htmlFor="title" className="text-purple-700 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={productTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProductTitle(e.target.value)
              }
              className="w-full mb-2 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />
               {/* product price */}
               <label htmlFor="price" className="text-purple-700 font-semibold">Price</label>
            <input
              type="text"
              name="price"
              placeholder="price"
              value={price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProductPrice(e.target.value)
              }
              className="w-full mb-2 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
              required
            />

            {/* product description */}
            <label htmlFor="description" className="text-purple-700 font-semibold">Content</label>
            <textarea
              name="description"
              placeholder="Content"
              value={productDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setProductDescription(e.target.value)
              }
              className="w-full text-gray-900 text-base leading-5 h-40
                rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm
                outline-0 focus:border-purple-400 resize-none"
              required
            ></textarea>

        
            <div>
              <button className="px-4 sm:px-8 py-1 mt-2 rounded border-2 border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateForm;
