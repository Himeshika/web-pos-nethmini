import { itemDB } from "../DB/DB.js";
import ItemDto from "../dto/ItemDto.js";


let save_item = (item_id, name, unit_price, quantity) => {
    let item = new ItemDto(item_id, name, unit_price, quantity);
    itemDB.push(item);
};


let update_item = (item_id, name, unit_price, quantity) => {
    const index = search_item_index_by_id(item_id);
    if (index === -1) {
        console.warn("Item ID not found for update:", item_id);
        return false;
    }

    itemDB[index].name = name;
    itemDB[index].unit_price = unit_price;
    itemDB[index].quantity = quantity;
    return true;
};


let delete_item = (item_id) => {
    const index = search_item_index_by_id(item_id);
    if (index === -1) {
        console.warn("Item ID not found for delete:", item_id);
        return false;
    }
    itemDB.splice(index, 1);
    return true;
};


let search_item_index_by_id = (item_id) => {
    return itemDB.findIndex(item => item.item_id === item_id);
};


let getAll_items = () => {
    return itemDB;
};


let search_item_by_name = (name) => {
    return itemDB.find(item => item.name.toLowerCase() === name.toLowerCase()) || null;
};


let search_item_by_id = (item_id) => {
    return itemDB.find(item => item.item_id === item_id) || null;
};


let getLastItemId = () => {
    if (itemDB.length === 0) return null;


    const sortedDb = [...itemDB].sort((a, b) => {
        const numA = parseInt(a.item_id.substring(1));
        const numB = parseInt(b.item_id.substring(1));
        return numA - numB;
    });

    return sortedDb[sortedDb.length - 1].item_id;
};


let generateNextItemId = () => {//next id
    let lastId = getLastItemId();
    if (!lastId) return "I001";

    let numericPart = parseInt(lastId.substring(1));
    let nextNumericPart = numericPart + 1;


    let nextId = "I" + nextNumericPart.toString().padStart(3, "0");
    return nextId;
};

let reduce_quantity=(item_id,quantity)=>{

    let item = search_item_by_id(item_id);

    if (item) {
        if (item.quantity > 0) {
            item.quantity =item.quantity-quantity;
        } else {
            console.log("Item is out of stock!");
        }
    } else {
        console.log("Item not found!");
    }
};

let add_quantity = (item_id, quantity) => {
    let item = search_item_by_id(item_id);
    quantity = parseInt(quantity);

    if (item) {
        if (item.quantity >= 0) {
            item.quantity += quantity;
        } else {
            console.log("Item is out of stock!");
        }
    } else {
        console.log("Item not found!");
    }
};


let checkQuantity=(item_id,amount)=>{
    let item = search_item_by_id(item_id);


    if (item.quantity < amount) {
        console.log(`⚠️ Not enough stock! Only ${item.quantity} left for ${item.name}.`);
        return false;
    }

    return true;
}

export {
    save_item,
    update_item,
    delete_item,
    getAll_items,
    search_item_by_name,
    generateNextItemId,
    getLastItemId,
    search_item_by_id,
    reduce_quantity,
    checkQuantity,
    add_quantity
};
