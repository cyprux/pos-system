import React from "react";
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ItemTable = ({
  data,
  setFruitTableValue,
  setSelectedFruitOptions,
  setQtys,
  setUnitPrice,
  setUpdateId,
}) => {
  const removeItem = (id) => {
    const itemsAfterRemoved = data.filter((item) => item._id !== id);
    setFruitTableValue(itemsAfterRemoved);
  };
  const updateMode = (id, itemName, qty, unitPrice) => {
    setSelectedFruitOptions({ value: itemName, label: itemName });
    setQtys(Number(qty));
    setUnitPrice(Number(unitPrice));
    setUpdateId(id);
  };
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total Cost Per L/I</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.itemName}</td>
            <td>{item.quantity}</td>
            <td>$ {item.unitPrice.toFixed(2)}</td>
            <td>$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
            <td>
              <BiEditAlt
                className="icon"
                onClick={() =>
                  updateMode(
                    item._id,
                    item.itemName,
                    item.quantity,
                    item.unitPrice
                  )
                }
              />
            </td>
            <td>
              <BsTrash className="icon" onClick={() => removeItem(item._id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ItemTable;
