
import {customerDb} from "../DB/DB.js";
import CustomerDto from "../dto/CustomerDto.js"

let save_customer=(cus_id,name,e_mail,contact_no)=>{
     let customer=new CustomerDto(cus_id,name,e_mail,contact_no);
     customerDb.push(customer);

}

let update_customer = (cus_id, name, e_mail, contact_no) => {
    const index = search_cus_index_by_id(cus_id);
    if (index === -1) {
        console.warn("Customer ID not found for update:", cus_id);
        return false;
    }


    customerDb[index].name = name;
    customerDb[index].e_mail = e_mail;
    customerDb[index].contact_no = contact_no;
    return true;
};


let delete_customer=(cus_id)=>{
    const index = search_cus_index_by_id(cus_id);
    if (index === -1) {
        console.warn("Customer ID not found for delete:", cus_id);
        return false;
    }
    customerDb.splice(index,1);
    return true;
}

let search_cus_index_by_id = (cus_id) => {
    return customerDb.findIndex(item => item.cus_id === cus_id);
}


let getAll_customers=()=>{
     return customerDb;
}

let search_cus=(contact_no)=>{
    return customerDb.find(item => item.contact_no === contact_no) || null;
}

let search_cus_by_id=(cus_id)=>{
    return customerDb.find(item => item.cus_id === cus_id) || null;
}

let getLastCustomerId = () => {
    if (customerDb.length === 0) return null;
    // Sort customers by ID (to handle potential unsorted deletion/save order)
    const sortedDb = [...customerDb].sort((a, b) => {
        const numA = parseInt(a.cus_id.substring(1));
        const numB = parseInt(b.cus_id.substring(1));
        return numA - numB;
    });
    return sortedDb[sortedDb.length - 1].cus_id;
}


let generateNextCustomerId = () => {
    let lastId = getLastCustomerId();
    if (!lastId) return "C001";

    let numericPart = parseInt(lastId.substring(1));
    let nextNumericPart = numericPart + 1;

    // Format with leading zeros
    let nextId = "C" + nextNumericPart.toString().padStart(3, "0");
    return nextId;
}

export {save_customer,update_customer,delete_customer,getAll_customers,search_cus,generateNextCustomerId,getLastCustomerId,search_cus_by_id};