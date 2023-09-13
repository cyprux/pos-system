import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "./utils/constant";
import Table from "./components/ItemTable";
import MainNavbar from "./components/MainNavbar";
import Select from "react-select";
import { InputGroup, Row, Col, Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemTable from "./components/ItemTable";

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
        const fetchedOptions = res.data.map((item) => ({
          value: item.itemName,
          label: item.itemName,
        }));
        setItems(res.data);
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

  const handleFruitSelect = (event) => {
    setSelectedFruitOptions(event);
    const selectedFruit = items.find((item) => item.itemName === event.value);
    if (selectedFruit) {
      setUnitPrice(Number(selectedFruit.unitPrice).toFixed(2));
    } else {
      setUnitPrice(0);
    }
  };

  const addFruitTable = () => {
    if (qtys !== "" && fruitOptions.length !== 0 && unitPrice !== "") {
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
      <MainNavbar />
      <Container>
        <Row>
          <Col xs={4}>
            <Form.Group className="mb-4"></Form.Group>
            <Form.Group className="mb-4">
              <Select
                options={fruitOptions}
                placeholder="Item Name"
                value={selectedFruitOptions}
                onChange={handleFruitSelect}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="number"
                min="1"
                value={qtys}
                placeholder="Quantity"
                onChange={(e) => setQtys(Number(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={unitPrice}
                  placeholder="Unit Price"
                  readOnly
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4">
              <Button
                variant="success"
                className="submitButton"
                type="submit"
                onClick={updateId ? updateFruitTable : addFruitTable}
              >
                {updateId ? "Update Item" : "Add Item"}
              </Button>
            </Form.Group>
          </Col>
          <Col></Col>
          <Col xs={7}>
            <Row>
              <Form.Group className="mb-4"></Form.Group>
              <ItemTable
                data={fruitTableValue}
                setFruitTableValue={setFruitTableValue}
                setSelectedFruitOptions={setSelectedFruitOptions}
                setQtys={setQtys}
                setUnitPrice={setUnitPrice}
                setUpdateId={setUpdateId}
              />
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-4"> </Form.Group>
                <Button
                  variant="danger"
                  type="submit"
                  onClick={() => {
                    setFruitTableValue([]);
                  }}
                >
                  Remove All Items
                </Button>
              </Col>
              <Col></Col>
              <Col>
                <Form.Group className="mb-4"></Form.Group>
                <InputGroup>
                  <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    className="currency-input"
                    value={
                      totalAmount.toFixed(2) <= 0 ? "" : totalAmount.toFixed(2)
                    }
                    placeholder="Total Amount"
                    readOnly
                  />
                </InputGroup>
              </Col>
              <Col>
                <Form.Group className="mb-4"></Form.Group>
                <Button
                  variant="success"
                  className="submitButton"
                  type="submit"
                  onClick={addFruitTransaction}
                >
                  Add Tranasction
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <div></div>
    </main>
  );
};

export default App;
