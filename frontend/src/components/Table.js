import React from "react";
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Unit Price</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.itemName}</td>
            <td>{item.quantity}</td>
            <td>{item.unitPrice}</td>
            <td>
              <BsTrash className="icon" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
