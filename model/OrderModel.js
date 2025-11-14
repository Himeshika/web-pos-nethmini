import { orderDB } from "../DB/DB.js";
import OrderDto from "../dto/OrderDto.js";


let save_order = (order_id, customer_id, customer_name, order_date, total_items, total_amount, payment_status) => {
    let order = new OrderDto(order_id, customer_id, customer_name, order_date, total_items, total_amount, payment_status);
    orderDB.push(order);
};


let update_order = (order_id, customer_id, customer_name, order_date, total_items, total_amount, payment_status) => {
    const index = search_order_index_by_id(order_id);
    if (index === -1) {
        console.warn("Order ID not found for update:", order_id);
        return false;
    }

    orderDB[index].customer_id = customer_id;
    orderDB[index].customer_name = customer_name;
    orderDB[index].order_date = order_date;
    orderDB[index].total_items = total_items;
    orderDB[index].total_amount = total_amount;
    orderDB[index].payment_status = payment_status;
    return true;
};


let delete_order = (order_id) => {
    const index = search_order_index_by_id(order_id);
    if (index === -1) {
        console.warn("Order ID not found for delete:", order_id);
        return false;
    }
    orderDB.splice(index, 1);
    return true;
};


let search_order_index_by_id = (order_id) => {
    return orderDB.findIndex(order => order.order_id === order_id);
};

let search_order_by_id = (order_id) => {
    return orderDB.find(order => order.order_id === order_id) || null;
};

let getAll_orders = () => {
    return orderDB;
};

let getLastOrderId = () => {
    if (orderDB.length === 0) return null;

    const sortedDb = [...orderDB].sort((a, b) => {
        const numA = parseInt(a.order_id.substring(1));
        const numB = parseInt(b.order_id.substring(1));
        return numA - numB;
    });

    return sortedDb[sortedDb.length - 1].order_id;
};

let generateNextOrderId = () => {
    let lastId = getLastOrderId();
    if (!lastId) return "O001";

    let numericPart = parseInt(lastId.substring(1));
    let nextNumericPart = numericPart + 1;

    let nextId = "O" + nextNumericPart.toString().padStart(3, "0");
    return nextId;
};

export {
    save_order,
    update_order,
    delete_order,
    getAll_orders,
    search_order_by_id,
    generateNextOrderId,
    getLastOrderId
};
