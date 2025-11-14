
class OrderDto{

    constructor(order_id, cus_id, cus_name, order_date, items, total_amount) {
        this.order_id = order_id;
        this.cus_id = cus_id;
        this.cus_name = cus_name;
        this.order_date = order_date;
        this.items = items; // array of order items
        this.total_amount = total_amount;
    }

}

export default OrderDto;