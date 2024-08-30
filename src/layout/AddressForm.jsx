import React, { useState } from "react";
import addressAuth from "../hooks/addressAuth"; // Adjust the path as necessary

export default function AddressForm() {
  const { addresses, addToAddress, updateAddress } = addressAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    realname: "",
    surname: "",
    phone: "",
    address: "",
    district: "",
    province: "",
    postcode: "",
  });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateAddress(editId, formData);
    } else {
      addToAddress(formData);
    }
    setFormData({
      realname: "",
      surname: "",
      phone: "",
      address: "",
      district: "",
      province: "",
      postcode: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setFormData({
      realname: address.realname,
      surname: address.surname,
      phone: address.phone,
      address: address.address,
      district: address.district,
      province: address.province,
      postcode: address.postcode,
    });
    setEditId(address.id);
    setShowForm(true);
  };

  console.log(12234, addresses);

  return (
    <div className="bg-[#592828] min-h-screen p-4">
      <div className="max-w-[60rem] mx-auto mt-[6rem]">
        <div className="mb-4 p-2 rounded bg-[#f2f2f2] my-[5rem]">
          <div className="">
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-500 text-white p-2 rounded mb-4"
            >
              เพิ่มที่อยู่
            </button>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md mb-4"
              >
                <h2 className="text-xl font-bold mb-4">
                  {editId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="realname"
                      value={formData.realname}
                      onChange={handleChange}
                      placeholder="ชื่อจริง"
                      className="p-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="นามสกุล"
                      className="p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="เบอร์โทรศัพท์"
                    className="p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="ที่อยู่"
                    className="p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="อำเภอ"
                    className="p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="จังหวัด"
                    className="p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="รหัสไปรษณีย์"
                    className="p-2 border border-gray-300 rounded"
                    required
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded flex-1"
                    >
                      {editId ? "อัปเดตที่อยู่" : "บันทึกที่อยู่"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          realname: "",
                          surname: "",
                          phone: "",
                          address: "",
                          district: "",
                          province: "",
                          postcode: "",
                        });
                        setEditId(null);
                      }}
                      className="bg-red-500 text-white p-2 rounded flex-1"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div>
              <h2 className="text-xl font-bold mb-4">ที่อยู่ที่เพิ่มแล้ว</h2>
              <hr />
              {addresses.length === 0 ? (
                <p>ยังไม่มีที่อยู่</p>
              ) : (
                <ul className="space-y-4">
                  {addresses.map((addr) =>
                    addr ? (
                      <li
                        key={addr.id}
                        className="bg-white p-4 rounded shadow-md"
                      >
                        <p>
                          <strong>ชื่อ:</strong> {addr.realname} {addr.surname}
                        </p>
                        <p>
                          <strong>โทรศัพท์:</strong> {addr.phone}
                        </p>
                        <p>
                          <strong>ที่อยู่:</strong> {addr.address}
                        </p>
                        <p>
                          <strong>อำเภอ:</strong> {addr.district}
                        </p>
                        <p>
                          <strong>จังหวัด:</strong> {addr.province}
                        </p>
                        <p>
                          <strong>รหัสไปรษณีย์:</strong> {addr.postcode}
                        </p>
                        <button
                          onClick={() => handleEdit(addr)}
                          className="bg-yellow-500 text-white p-2 rounded mt-2"
                        >
                          แก้ไขที่อยู่
                        </button>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
