import {
    save_item,
    search_item_by_id,
    update_item,
    delete_item,
    getAll_items,
    generateNextItemId
} from "../model/ItemModel.js";

import {loadAllItemsToDatalist} from "./OrderController.js";


$('#item_id_field').val(generateNextItemId()); // initial ID

let selected_item_id;


$('#item_save_btn').on('click', function () { //save

    let item_id = $('#item_id_field').val().trim();
    let item_name = $('#item_name_field').val().trim();
    let item_price = $('#item_unit_price_field').val().trim();
    let item_qty = $('#item_quantity_field').val().trim();

    if (!validateAll()) return;

    save_item(item_id, item_name, item_price, item_qty);

    Swal.fire({
        title: "Saved!",
        text: "Item has been added successfully.",
        icon: "success",
        draggable: true
    });

    loadAllToTable();
    loadAllItemsToDatalist();
    clearFields();
    $('#item_id_field').val(generateNextItemId());
});


function loadAllToTable() { // load to table
    $('#item_table_body').empty();
    let items = getAll_items();

    items.map((item) => {
        let row = `<tr data-id="${item.item_id}">
                        <td>${item.item_id}</td>
                        <td>${item.name}</td>
                        <td>${item.unit_price}</td>
                        <td>${item.quantity}</td>
                   </tr>`;
        $('#item_table_body').append(row);
    });
}


function clearFields() { // clear
    $('#item_name_field').val("");
    $('#item_unit_price_field').val("");
    $('#item_quantity_field').val("");
}


$('#item_table_body').on('click', 'tr', function () { //table click
    selected_item_id = $(this).data('id');
    let item = search_item_by_id(selected_item_id);

    $('#item_id_field').val(item.item_id);
    $('#item_name_field').val(item.name);
    $('#item_unit_price_field').val(item.unit_price);
    $('#item_quantity_field').val(item.quantity);

    $('#item_save_btn').addClass('d-none');
    $('#item_field_reset_btn').removeClass('d-none');
});


$('#item_field_reset_btn').on('click', function () { //reset
    $('#item_save_btn').removeClass('d-none');
    $('#item_field_reset_btn').addClass('d-none');
    clearFields();
    $('#item_id_field').val(generateNextItemId());
});


$('#item_update_btn').on('click', function () { //update
    if (selected_item_id === undefined) {
        Swal.fire({
            title: "No Selection",
            text: "Please select an item from the table to update.",
            icon: "warning"
        });
        return;
    }

    let item_id = $('#item_id_field').val().trim();
    let item_name = $('#item_name_field').val().trim();
    let item_price = $('#item_unit_price_field').val().trim();
    let item_qty = $('#item_quantity_field').val().trim();

    if (!validateAll()) return;

    update_item(item_id, item_name, item_price, item_qty);

    Swal.fire({
        title: "Updated!",
        text: "Item details have been updated successfully.",
        icon: "success"
    });

    loadAllToTable();
    loadAllItemsToDatalist();
    clearFields();
    $('#item_save_btn').removeClass('d-none');
    $('#item_field_reset_btn').addClass('d-none');
    $('#item_id_field').val(generateNextItemId());
    selected_item_id = undefined;
});


$('#item_delete_btn').on('click', function () { //delete
    if (selected_item_id === undefined) {
        Swal.fire({
            title: "No Selection",
            text: "Please select an item from the table to delete.",
            icon: "warning"
        });
        return;
    }

    const idToDelete = selected_item_id;

    Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the item.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            delete_item(idToDelete);

            Swal.fire({
                title: "Deleted!",
                text: "Item has been deleted successfully.",
                icon: "success"
            });

            loadAllToTable();
            loadAllItemsToDatalist();
            clearFields();
            $('#item_save_btn').removeClass('d-none');
            $('#item_field_reset_btn').addClass('d-none');
            $('#item_id_field').val(generateNextItemId());
            selected_item_id = undefined;
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const pricePattern = /^\d+(\.\d{1,2})?$/;
const qtyPattern = /^\d+$/;

$('#item_name_field').on('input', function () {
    const val = $(this).val().trim();
    if (val === "") setInvalid($(this), "Name is required");
    else if (val.length < 2) setInvalid($(this), "Name must be at least 2 characters");
    else setValid($(this));
});

$('#item_unit_price_field').on('input', function () {
    const val = $(this).val().trim();
    if (val === "") setInvalid($(this), "Price is required");
    else if (!pricePattern.test(val)) setInvalid($(this), "Enter a valid number (e.g. 12.50)");
    else setValid($(this));
});

$('#item_quantity_field').on('input', function () {
    const val = $(this).val().trim();
    if (val === "") setInvalid($(this), "Quantity is required");
    else if (!qtyPattern.test(val)) setInvalid($(this), "Quantity must be a whole number");
    else setValid($(this));
});

function setValid(element) {
    element.removeClass('is-invalid').addClass('is-valid');
}

function setInvalid(element, msg) {
    element.removeClass('is-valid').addClass('is-invalid');

}

function validateAll() {
    let valid = true;
    $('#item_name_field, #item_unit_price_field, #item_quantity_field').each(function () {
        if ($(this).hasClass('is-invalid') || $(this).val().trim() === '') {
            valid = false;
        }
    });

    if (!valid) {
        Swal.fire({
            title: "Invalid Input",
            text: "Please fix the highlighted fields.",
            icon: "error"
        });
    }

    return valid;
}


loadAllToTable();

export {loadAllToTable}
