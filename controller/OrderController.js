
import {search_cus} from "../model/CustomerModel.js";
import {getAll_items, checkQuantity, reduce_quantity, search_item_by_id, add_quantity} from "../model/ItemModel.js";
import {loadAllToTable} from "./ItemController.js";
import {save_order, generateNextOrderId, delete_order} from "../model/OrderModel.js";
import {orderDB} from "../DB/DB.js";

////////////////////////////////////////////customer part

let selected_customer;
let selected_item;
let item_list=[];
let quantity; // for update part

$('#cus_no_search_btn-op').on('click',function (){
    let contact_no = $('#cus_no_field-op').val().trim();

    // If no input
    if (contact_no === "") {
        Swal.fire({
            title: "Empty Field",
            text: "Please enter a contact number to search.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    // Search for customer
    let customer = search_cus(contact_no);

    if (customer === null) {
        Swal.fire({
            title: "Not Found",
            text: "No customer found with this contact number.",
            icon: "error",
            confirmButtonText: "Try Again"
        });
        $('#cus_id_op').val("");
        return;
    }

    if(customer!=null){
        selected_customer=customer;
    }else {
        selected_customer=null;
    }

    // If found
    $('#cus_id_op').val(customer.cus_id);

    Swal.fire({
        title: "Customer Found!",
        text: `Customer ID: ${customer.cus_id}\nName: ${customer.name}`,
        icon: "success",
        confirmButtonText: "OK"
    });

})

////////////////////////////////////////////////////////////// item part


$(document).ready(function () {
    loadAllItemsToDatalist();
});

function  loadAllItemsToDatalist(){
    let item_list=getAll_items();
    let $datalist=$('#productList');

    $datalist.empty();

    item_list.forEach((item)=>{
        let option=`<option value="${item.item_id} - ${item.name}"></option>`;
        $datalist.append(option);
    })
}

$('#quantity_op').on('input', function () {////// this update the amount
    if (selected_item != null) {
        calculateTotalPriceForItem();
    } else {
        $('#amount_op').val(''); // clear amount if no item selected
    }
});

$('#productInput').on('input',function (){
    let item=$(this).val();
    let item_id=item.split('-')[0]?.trim();

    let full_item=search_item_by_id(item_id);

    if(full_item!=null){
        selected_item=full_item;
    }else {
        selected_item=null;
    }
})

function calculateTotalPriceForItem(){
    let unit_price=selected_item.unit_price;
    let quantity=$('#quantity_op').val();
    let amount=unit_price*quantity;
    $('#amount_op').val(amount);
    return amount;
}

$('#add_item_btn_op').on('click', function () {
    if (!selected_item) {
        Swal.fire({
            title: "No Item Selected",
            text: "Please select an item first.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    let item_id = selected_item.item_id;
    let item_name = selected_item.name;
    let quantity = parseInt($('#quantity_op').val());
    let unit_price = parseFloat(selected_item.unit_price);
    let total_price = calculateTotalPriceForItem();

    if (!checkQuantity(item_id, quantity)) {
        Swal.fire({
            title: "Insufficient Stock!",
            text: `Only ${selected_item.quantity} units left for ${selected_item.name}.`,
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }


    let existingItem = item_list.find(item => item.item_id === item_id); /// for duplicate items

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total_price = existingItem.quantity * existingItem.unit_price;


        let $row = $('#item_table_op tr').filter(function () {
            return $(this).find('td:first').text().trim() === item_id;
        });


        if ($row.length) {
            $row.find('td:eq(2)').text(existingItem.quantity);
            $row.find('td:eq(4)').text(existingItem.total_price.toFixed(2));
        }

        calculateTotalPriceForOrder();
    } else {

        let order_item = {
            item_id: item_id,
            name: item_name,
            quantity: quantity,
            unit_price: unit_price,
            total_price: total_price
        };

        item_list.push(order_item);

        let row = `<tr>
            <td>${item_id}</td>
            <td>${item_name}</td>
            <td>${quantity}</td>
            <td>${unit_price}</td>
            <td>${total_price.toFixed(2)}</td>
        </tr>`;

        $('#item_table_op').append(row);
    }

    reduce_quantity(item_id, quantity);
    loadAllToTable();
    calculateTotalPriceForOrder(); // update grand total
    clearItemFields();

    Swal.fire({
        title: "Item Added!",
        text: `${item_name} (${quantity}) added to order.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
    });
});

$('#item_update_btn-op').on('click', function () { //update



    if (!selected_item) {
        Swal.fire({
            title: "No Item Selected",
            text: "Please click a row first to edit.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    let newQty=$('#quantity_op').val();

    if (isNaN(newQty) || newQty <= 0) {
        Swal.fire({
            title: "Invalid Quantity",
            text: "Please enter a valid quantity.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    let item_id = selected_item.item_id;
    let updated_total = selected_item.unit_price * newQty;

    let itemObj = item_list.find(item => item.item_id === item_id);
    if (itemObj) {
        itemObj.quantity = newQty;
        itemObj.total_price = updated_total;
    }


    let $row = $('#item_table_op tr').filter(function () {
        return $(this).find('td:first').text().trim() === item_id;
    });

    if ($row.length) {
        $row.find('td:eq(2)').text(newQty);
        $row.find('td:eq(4)').text(updated_total.toFixed(2));
    }
    let stockDifference = newQty - quantity;

    if (stockDifference > 0 && !checkQuantity(item_id, stockDifference)) { //quantity validation
        Swal.fire({
            title: "Insufficient Stock!",
            text: `Only ${selected_item.quantity} units left for ${selected_item.name}.`,
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }
    reduce_quantity(item_id,stockDifference);

    calculateTotalPriceForOrder();
    loadAllToTable();

    Swal.fire({
        title: "Item Updated!",
        text: `${selected_item.name} quantity updated to ${newQty}.`,
        icon: "success",
        timer: 1200,
        showConfirmButton: false
    }).then(() => {
        $('#item_update_btn-op, #item_delete_btn-op').addClass('d-none');
        clearItemFields();
    });

});




function clearItemFields() {
    $('#productInput').val('');
    $('#quantity_op').val('');
    $('#amount_op').val('');
    selected_item = null;
    quantity = null;
}

$('#item_delete_btn-op').on('click', function () {
    if (!selected_item) {
        Swal.fire({
            title: "No Item Selected",
            text: "Please click a row first to delete.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    let item_id = selected_item.item_id;
    let deletedQty = parseInt($('#quantity_op').val()) || 0;

    Swal.fire({
        title: "Remove Item?",
        text: `Are you sure you want to remove ${selected_item.name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, remove",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {

            item_list = item_list.filter(item => item.item_id !== item_id);


            $('#item_table_op tr').filter(function () {
                return $(this).find('td:first').text().trim() === item_id;
            }).remove();


            add_quantity(item_id, deletedQty);


            calculateTotalPriceForOrder();
            loadAllToTable();

            Swal.fire({
                title: "Removed!",
                text: `${item_id} has been deleted successfully.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                $('#item_update_btn-op, #item_delete_btn-op').addClass('d-none');
                clearItemFields();
            });
        }
    });
});




//////////////////////////////////////////////////////// place order part


$('#place_order_btn_id').on('click',function (){

    if (!selected_customer) {
        Swal.fire({
            title: "No Customer Selected",
            text: "Please search and select a customer first.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    if (item_list.length === 0) {
        Swal.fire({
            title: "No Items Added",
            text: "Please add at least one item to the order.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    let order_date = $('#order_date_field').val();
    if (!order_date) {
        Swal.fire({
            title: "Missing Date",
            text: "Please select the order date.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    let order_id = generateNextOrderId();
    let customer_id = selected_customer.cus_id;
    let customer_name = selected_customer.name;
    let total_items = item_list.length;
    let total_amount = item_list.reduce((sum, item) => sum + item.total_price, 0);


    save_order(order_id, customer_id, customer_name, order_date, total_items, total_amount);


    Swal.fire({
        title: "Order Placed!",
        text: `Order ID: ${order_id}\nCustomer: ${customer_name}\nTotal Rs. ${total_amount.toFixed(2)}`,
        icon: "success",
        confirmButtonText: "OK"
    });


    let newRow = `<tr>
        <td>${order_id}</td>
        <td>${customer_id}</td>
        <td>${customer_name}</td>
        <td>${order_date}</td>
        <td>${total_items}</td>
        <td>${total_amount.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm delete-order-btn" data-id="${order_id}">Delete</button></td>
    </tr>`;
    $('#order_history tbody').append(newRow);

    clearOrderData();
})

function clearOrderData() {
    selected_customer = null;
    item_list = [];
    $('#cus_id_op').val('');
    $('#cus_no_field-op').val('');
    $('#order_date_field').val('');
    $('#item_table_op').empty();
    $('#total_price_span').text('0');
    loadAllToTable();
}

function calculateTotalPriceForOrder(){
    let total_price = 0;

    item_list.forEach(item => {
        total_price += item.total_price;
    });

    $('#total_price_span').text(total_price.toFixed(2));
}

$('#item_table_op').on('click', 'tr', function () {// table click
    let item_id = $(this).find('td:eq(0)').text();
    let item_name = $(this).find('td:eq(1)').text();
    quantity = $(this).find('td:eq(2)').text();
    let unit_price = $(this).find('td:eq(3)').text();
    let total_price = $(this).find('td:eq(4)').text();


    $('#productInput').val(`${item_id} - ${item_name}`);
    $('#quantity_op').val(quantity);
    $('#amount_op').val(total_price);


    selected_item = search_item_by_id(item_id);


    $('#item_update_btn-op').removeClass('d-none');
    $('#item_delete_btn-op').removeClass('d-none');
});

/////////////////////////////////order history


$('#order_history').on('click', '.delete-order-btn', function () {
    let orderId = $(this).data('id');
    let $row = $(this).closest('tr');

    Swal.fire({
        title: "Delete Order?",
        text: `Are you sure you want to delete Order ID: ${orderId}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            console.log( orderDB.length)// debug
            delete_order(orderId);
            $row.remove();
            console.log( orderDB.length)//debug

            Swal.fire({
                title: "Deleted!",
                text: `Order ${orderId} has been removed.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
});




export {loadAllItemsToDatalist};