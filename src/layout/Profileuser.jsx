import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import ProductContext from "../contexts/ProductContext";

export default function Profileuser() {
  const [subscriptions, setSubscriptions] = useState(null);
  const {user} = useContext(AuthContext);
  // console.log(product);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          "http://localhost:8889/book/subscriptions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubscriptions(response.data.subscriptions);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchSubscriptions();
  }, []);

  // console.log(user);
  // const username = subscriptions?.find((el) => el)
  // console.log(username);

  return (
    <div>
      <div className="hero min-h-screen bg-rose-900 flex justify-center items-center">
        <div className="tap2">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-pink-60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่ชำระ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมดชำระ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID user
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {subscriptions && user &&
                  subscriptions.map((item) => (
                    <Subscriptions
                      key={item.id}
                      subscriptions={item}
                      user={user}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Subscriptions({ subscriptions, user}) {

  const {product} = useContext(ProductContext)

  const {title, volume} = product?.find(el => el.id === subscriptions.bookId)
  // const name = findProduct.title



  return (
    <tr className="hover :bg-gray-100">
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {subscriptions.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {subscriptions.start}
      </td>
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {subscriptions.end}
      </td>
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {user.username}
      </td>
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {volume}
      </td>
    </tr>
  );
}
