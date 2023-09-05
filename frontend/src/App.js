import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "./utils/constant";
import Table from "./components/Table";
import Select from "react-select";

const App = () => {
  const [qtys, setQtys] = useState("");
  const [items, setItems] = useState([]);
  const [unitPrice, setUnitPrice] = useState("");
  const [fruitOptions, setFruitOptions] = useState([]);
  const [selectedFruitOptions, setSelectedFruitOptions] = useState("");
  const [fruitTableValue, setFruitTableValue] = useState([]);
  const [updateUI, setUpdateUI] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    getItems();
    removeDuplicateItemName();
  }, [updateUI]);

  const getItems = () => {
    axios
      .get(`${baseURL}/getItem`)
      .then((res) => {
        setItems(res.data);
        const fetchedOptions = res.data.map((item) => ({
          value: item.itemName,
          label: item.itemName,
        }));
        setFruitOptions(fetchedOptions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const updateFruitTable = () => {
    const updatedItems = fruitTableValue.map((item) => {
      if (item._id === updateId) {
        return { ...item, quantity: qtys };
      }
      return item;
    });

    setFruitTableValue(updatedItems);
    setUnitPrice("");
    setQtys("");
    setSelectedFruitOptions("");
    setUpdateId(null);
  };

  const handleFruitSelect = (data) => {
    setSelectedFruitOptions(data);
    const selectedFruit = items.find((item) => item.itemName === data.value);
    if (selectedFruit) {
      setUnitPrice(Number(selectedFruit.unitPrice).toFixed(2));
    } else {
      setUnitPrice(0);
    }
  };

  const addFruitTable = () => {
    if (qtys !== "" && fruitOptions !== [] && unitPrice !== "") {
      const selectedFruit = items.find(
        (item) => item.itemName === selectedFruitOptions.value
      );

      setFruitTableValue([
        ...fruitTableValue,
        {
          _id: selectedFruit._id,
          itemName: selectedFruit.itemName,
          quantity: qtys,
          unitPrice: selectedFruit.unitPrice,
        },
      ]);

      setUpdateUI((prevState) => !prevState);
      setUnitPrice("");
      setQtys("");
      setSelectedFruitOptions("");
    } else {
      alert("Please Ensure ALL Fields are Filled!");
    }
  };

  const removeDuplicateItemName = () => {
    const mergedItems = fruitTableValue.reduce((accumulator, currentItem) => {
      const existingItem = accumulator.find(
        (item) => item.itemName === currentItem.itemName
      );

      if (existingItem) {
        existingItem.quantity += currentItem.quantity;
      } else {
        accumulator.push({ ...currentItem });
      }

      return accumulator;
    }, []);

    setFruitTableValue(mergedItems);
  };

  const addFruitTransaction = () => {
    if (fruitTableValue.length > 0) {
      reduceFruitQuantity();
      saveTransaction();
    } else {
      alert("Please Ensure You Have At Least 1 Line Item!");
    }
  };

  const totalAmount = fruitTableValue.reduce((accumulator, item) => {
    const itemCost = item.quantity * item.unitPrice;
    return accumulator + itemCost;
  }, 0);

  const saveTransaction = () => {
    axios
      .post(`${baseURL}/saveTransaction`, { items: fruitTableValue })
      .then((res) => {
        console.log(res.data);
        setUnitPrice("");
        setQtys("");
        setSelectedFruitOptions("");
        setFruitTableValue([]);
      });
  };

  const reduceFruitQuantity = () => {
    fruitTableValue.forEach(async (item) => {
      try {
        var existingQuantity = await items.find((id) => id._id === item._id)
          ?.quantity;

        if (existingQuantity > 0 && existingQuantity) {
          existingQuantity -= item.quantity;
          axios
            .put(`${baseURL}/updateQuantity/${item._id}`, {
              quantity: existingQuantity,
            })
            .then((res) => {
              console.log(res.data);
            });
          console.log(`Updated ID ${item._id}: Quantity -${item.quantity}`);
        } else {
          console.log(`Item ID ${item._id} not found in the database.`);
        }
      } catch (error) {
        console.error(`Error updating ${item.itemName}: ${error}`);
      }
    });
  };

  return (
    <main>
      <h1 className="title">Point of Sales System</h1>

      <div className="input_holder">
        <Select
          options={fruitOptions}
          placeholder="Item Name"
          value={selectedFruitOptions}
          onChange={handleFruitSelect}
        />

        <input
          type="number"
          min="1"
          value={qtys}
          placeholder="Quantity"
          onChange={(e) => setQtys(Number(e.target.value))}
        />

        <input
          type="number"
          className="currency-input"
          value={unitPrice}
          placeholder="Unit Price"
          readOnly
        />

        <button
          type="submit"
          onClick={() => {
            setFruitTableValue([]);
          }}
        >
          Remove All Item
        </button>

        <button
          type="submit"
          onClick={updateId ? updateFruitTable : addFruitTable}
        >
          {updateId ? "Update Item" : "Add Item"}
        </button>
      </div>
      <div className="input_holder">
        <Table
          data={fruitTableValue}
          setFruitTableValue={setFruitTableValue}
          setSelectedFruitOptions={setSelectedFruitOptions}
          setQtys={setQtys}
          setUnitPrice={setUnitPrice}
          setUpdateId={setUpdateId}
        />
      </div>
      <div className="input_holder">
        <input
          type="number"
          className="currency-input"
          value={totalAmount.toFixed(2) <= 0 ? "" : totalAmount.toFixed(2)}
          placeholder="Total Amount"
          readOnly
        />
        <button type="submit" onClick={addFruitTransaction}>
          Add Tranasction
        </button>
      </div>
    </main>
  );
};

export default App;
