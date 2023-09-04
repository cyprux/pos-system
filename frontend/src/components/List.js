import React from "react";
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { baseURL } from "../utils/constant";
import axios from "axios";

const List = ({ id, itemName, qty, setUpdateUI, updateMode }) => {
  const removeItem = () => {
    axios.delete(`${baseURL}/delete/${id}`).then((res) => {
      console.log(res);
      setUpdateUI((prevState) => !prevState);
    });
  };

  return (
    <li>
      <div>{itemName}</div>
      <div>{qty}</div>
      <div className="icon_holder">
        <BiEditAlt className="icon" onClick={() => updateMode(id, qty)} />
        <BsTrash className="icon" onClick={removeItem} />
      </div>
    </li>
  );
};

export default List;
