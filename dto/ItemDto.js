class ItemDto {

    #item_id;
    #name;
    #unit_price;
    #quantity;

    constructor(item_id, name, unit_price, quantity) {
        this.#item_id = item_id;
        this.#name = name;
        this.#unit_price = unit_price;
        this.#quantity = quantity;
    }

    get item_id() {
        return this.#item_id;
    }

    get name() {
        return this.#name;
    }

    get unit_price() {
        return this.#unit_price;
    }

    get quantity() {
        return this.#quantity;
    }


    set item_id(value) {
        this.#item_id = value;
    }

    set name(value) {
        this.#name = value;
    }

    set unit_price(value) {
        this.#unit_price = value;
    }

    set quantity(value) {
        this.#quantity = value;
    }
}

export default ItemDto;
