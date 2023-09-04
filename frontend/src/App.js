import React, { useEffect, useState } from "react";
import List from "./components/List";
import Table from "./components/Table";
import axios from "axios";
import { baseURL } from "./utils/constant";
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

  const updateMode = (id, text) => {
    console.log(text);
    setQtys(text);
    setUpdateId(id);
  };

  const handleFruitSelect = (data) => {
    setSelectedFruitOptions(data);
    const selectedFruit = items.find((item) => item.itemName === data.value);
    if (selectedFruit) {
      setUnitPrice(Number(selectedFruit.unitPrice));
    } else {
      setUnitPrice(0);
    }
  };

  const addFruitTable = () => {
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
    reduceFruitQuantity();
    saveTransaction();
  };

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

        <button type="submit" onClick={addFruitTable}>
          Add Item
        </button>

        {/* <button type="submit" onClick={updateId ? updateItem : addItem}>
          {updateId ? "Update Item" : "Add Item"}
        </button> */}
      </div>
      <div className="input_holder">
        {/* <ul>
          {items.map((test) => (
            <List
              key={test._id}
              id={test._id}
              itemName={test.itemName}
              qty={test.quantity}
              setUpdateUI={setUpdateUI}
              //updateMode={updateMode}
            />
          ))}
        </ul> */}
        <Table data={fruitTableValue} />
      </div>
      <div className="input_holder">
        <button type="submit" onClick={addFruitTransaction}>
          Add Tranasction
        </button>
      </div>
    </main>
  );
};

export default App;
