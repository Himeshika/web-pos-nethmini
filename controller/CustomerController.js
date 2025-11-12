import {save_customer, search_cus_by_id, update_customer, delete_customer, getAll_customers, generateNextCustomerId} from "../model/CustomerModel.js";
import customerDto from "../dto/CustomerDto.js";

$('#customer_id_field').val(generateNextCustomerId()); // initial id generation
let selected_cus_id;

// ================== SAVE CUSTOMER ==================
$('#cus_save_btn').on('click', function () {
    let cus_id = $('#customer_id_field').val().trim();
    let cus_name = $('#customer_name_field').val().trim();
    let cus_mail = $('#customer_email_field').val().trim();
    let cus_no = $('#customer_contact_no_field').val().trim();

    if (!validateAll(cus_name, cus_mail, cus_no)) return;

    save_customer(cus_id, cus_name, cus_mail, cus_no);

    Swal.fire({
        title: "Saved!",
        text: "Customer has been added successfully.",
        icon: "success",
        draggable: true
    });

    loadAllToTable();
    clearFields();
    $('#customer_id_field').val(generateNextCustomerId());
});

// ================== LOAD TABLE ==================
function loadAllToTable() {
    $('#customer_table_body').empty();
    let cusData = getAll_customers();

    cusData.map((item) => {
        let row = `<tr data-id="${item.cus_id}">
                        <td>${item.cus_id}</td>
                        <td>${item.name}</td>
                        <td>${item.e_mail}</td>
                        <td>${item.contact_no}</td>
                   </tr>`;
        $('#customer_table_body').append(row);
    });
}

// ================== CLEAR FIELDS ==================
function clearFields() {
    $('#customer_name_field').val("");
    $('#customer_email_field').val("");
    $('#customer_contact_no_field').val("");
}

// ================== TABLE ROW CLICK ==================
$('#customer_table_body').on('click', 'tr', function () {
    selected_cus_id = $(this).data('id');
    let customer = search_cus_by_id(selected_cus_id);
    $('#customer_id_field').val(customer.cus_id);
    $('#customer_name_field').val(customer.name);
    $('#customer_email_field').val(customer.e_mail);
    $('#customer_contact_no_field').val(customer.contact_no);

    $('#cus_save_btn').addClass('d-none');
    $('#cus_field_reset_btn').removeClass('d-none');
});

// ================== RESET BUTTON ==================
$('#cus_field_reset_btn').on('click', function () {
    $('#cus_save_btn').removeClass('d-none');
    $('#cus_field_reset_btn').addClass('d-none');
    clearFields();
    $('#customer_id_field').val(generateNextCustomerId());
});

// ================== UPDATE CUSTOMER ==================
$('#cus_update_btn').on('click', function () {
    if (selected_cus_id === undefined) {
        Swal.fire({
            title: "No Selection",
            text: "Please select a customer from the table to update.",
            icon: "warning"
        });
        return;
    }

    let cus_id = $('#customer_id_field').val().trim();
    let cus_name = $('#customer_name_field').val().trim();
    let cus_mail = $('#customer_email_field').val().trim();
    let cus_no = $('#customer_contact_no_field').val().trim();

    if (!validateAll(cus_name, cus_mail, cus_no)) return;

    update_customer(cus_id, cus_name, cus_mail, cus_no);

    Swal.fire({
        title: "Updated!",
        text: "Customer details have been updated successfully.",
        icon: "success",
        draggable: true
    });

    loadAllToTable();
    clearFields();
    $('#cus_save_btn').removeClass('d-none');
    $('#cus_field_reset_btn').addClass('d-none');
    $('#customer_id_field').val(generateNextCustomerId());
    selected_cus_id = undefined;
});

// ================== DELETE CUSTOMER ==================
$('#cus_delete_btn').on('click', function () {
    if (selected_cus_id === undefined) {
        Swal.fire({
            title: "No Selection",
            text: "Please select a customer from the table to delete.",
            icon: "warning"
        });
        return;
    }

    const idToDelete = selected_cus_id;

    Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the customer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            delete_customer(idToDelete);

            Swal.fire({
                title: "Deleted!",
                text: "Customer has been deleted successfully.",
                icon: "success"
            });

            loadAllToTable();
            clearFields();
            $('#cus_save_btn').removeClass('d-none');
            $('#cus_field_reset_btn').addClass('d-none');
            $('#customer_id_field').val(generateNextCustomerId());
            selected_cus_id = undefined;
        }
    });
});

// ================== VALIDATION FUNCTION ==================
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;

function validateAll(name, email, phone) {
    let valid = true;
    let errorMsg = "";

    if (!name || name.length < 3) {
        valid = false;
        errorMsg += "Name must be at least 3 characters.\n";
    }

    if (!email || !emailPattern.test(email)) {
        valid = false;
        errorMsg += "Enter a valid email.\n";
    }

    if (!phone || !phonePattern.test(phone)) {
        valid = false;
        errorMsg += "Contact number must be 10 digits.\n";
    }

    if (!valid) {
        Swal.fire({
            title: "Invalid Input",
            text: errorMsg,
            icon: "error"
        });
    }

    return valid;
}
