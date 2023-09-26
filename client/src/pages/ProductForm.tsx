import axios from "axios";
import { useState, useEffect } from "react";
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
}

interface IProps {
  products: IProduct[];
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

interface IOwner {
  _id: string;
  username: string;
}

function ProductForm({ products, setProducts }: IProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [owner, setOwner] = useState<IOwner>(
    JSON.parse(localStorage.getItem("user")!).user
  );
  const [date, setDate] = useState<string>();

  const [price, setPrice] = useState<string>("");
  const [userLocation, setUserLocation] = useState({ country: "", currency: "" });

  const [formValid, setFormValid] = useState<boolean>(false); 

  useEffect(() => {
    document.title = "Create | PLM";
  
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


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

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
      .post("/api/products/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${
            JSON.parse(localStorage.getItem("user")!).token
          }`,
        },
      })
      .then((res) => {
        setProducts([...products, res.data]);
        axios.get("/api/products").then((res) => {
          setProducts(res?.data);
        });
        navigate("/");
      })
      .catch((err) => console.error("Error in Axios request:", err));
      ;
  };



  useEffect(() => {
    setFormValid(title.trim() !== "" && description.trim() !== "");
  }, [title, description]);
  return (
    <>
      <div className="z-[-10] bg-black-500 w-4/5 md:w-1/2 mt-24 absolute left-1/2 -translate-x-1/2">
        <div className="border-2 p-10 shadow-xl rounded-md">
          <h1 className="text-purple-600 text-xl sm:text-2xl md:text-3xl font-bold pb-4">
           Create your product
          </h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              {/* product title */}
              <label htmlFor="title" className="text-purple-700 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                className="w-full mb-5 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 my-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
                required
              
              /> 

                {/* product price */}

                <label htmlFor="price" className="text-purple-700 font-semibold" >Price</label>
              <input
                type="text"
                name="price"
                placeholder="Price"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPrice(e.target.value)
                }
                className="w-full mb-5 text-gray-900 text-base leading-5 h-8 rounded bg-gray-100 py-1 my-1 px-2 duration-100 border-2 shadow-sm outline-0 focus:border-purple-400"
                required
              
              /> 

              {/* product description */}
              <label htmlFor="description" className="text-purple-700 font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                className="w-full text-gray-900 text-base leading-5 h-40
                rounded bg-gray-100 py-1 px-2 duration-100 border-2 shadow-sm
                outline-0 focus:border-purple-400 resize-none"
                required
          
              ></textarea>
            
              <div>
              <button
  className={`px-4 sm:px-8 py-1 mt-2 rounded border-2 border-purple-600 text-purple-600 duration-300 ${
    formValid ? "hover:text-white hover:bg-purple-600" : ""
  }`}
  disabled={!formValid}
>
  Create
</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProductForm;
     