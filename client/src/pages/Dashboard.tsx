import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";

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

function Dashboard({ products, setProducts }: IProps) {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")!).user._id;
  const userProducts = products.filter((product) => userId === product.owner._id);
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem("user")!).token
      }`,
    },
  };


  const handleDelete = (deleteProduct: IProduct): void => {
    axios
      .delete(`/api/products/${deleteProduct._id}/delete`, headers)
      .then(() => {
        setProducts((prevState) => {
          return prevState.filter((product) => product?._id !== deleteProduct?._id);
        });
      })
      .catch((err) => console.log(err.response.data));
  };

  useEffect(() => {
    document.title = "Dashboard | PLM";
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center m-8">Dashboard</h1>
      <div className="flex flex-row flex-wrap justify-center items-center mx-8 lg:justify-start lg:items-start">
        {userProducts
          .slice(0)
          .reverse()
          .map((product: IProduct) => {
            return (
              <div
                className="border-2 m-3 p-2 sm:m-6 sm:p-4 rounded text-center hover:shadow-lg"
                key={product._id}
              >
                <Link to={`/products/${product._id}`}>
           
                
                <h2 className="text-1xl font-bold pt-2">{product.title}</h2></Link>
                <p className="text-sm py-2">
                  Published: {new Date(product.date).toLocaleString()}
                </p>
       
                <br />
                <div className="m-auto">
                  <button
                    onClick={() =>
                      navigate(`/products/${product._id}/update`, {
                        state: { ...product },
                      })
                    }
                    className="px-2 py-1 mt-2 rounded border border-purple-600 text-purple-600 duration-300 hover:text-white hover:bg-purple-600"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-2 py-1 mt-2 rounded border border-red-600 text-red-600 duration-300 hover:text-white hover:bg-red-600"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
