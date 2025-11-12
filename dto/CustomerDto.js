
class CustomerDto{

    #cus_id;
    #name;
    #e_mail
    #contact_no

    constructor(cus_id, name, e_mail, contact_no) {
        this.#cus_id = cus_id;
        this.#name = name;
        this.#e_mail = e_mail;
        this.#contact_no = contact_no;
    }


    get cus_id() {
        return this.#cus_id;
    }

    get name() {
        return this.#name;
    }

    get e_mail() {
        return this.#e_mail;
    }

    get contact_no() {
        return this.#contact_no;
    }

    set name(value) {
        this.#name = value;
    }

    set e_mail(value) {
        this.#e_mail = value;
    }

    set contact_no(value) {
        this.#contact_no = value;
    }

}

export default CustomerDto;