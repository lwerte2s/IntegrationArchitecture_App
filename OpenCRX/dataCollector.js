

const axios = require("axios");

const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX';

const credentials = {
    username: 'guest',
    password: 'guest'
};

const config = {
    headers: {'Accept': 'application/json'},
    auth: credentials
};



async function getOrdersBySalesmanId(id){

    try {
        // hole alle Bestellungen
        let orders = await axios.get( `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`, config);
        orders = orders.data.objects;

        let myOrders = [];
        for( let item of orders){
            // hole zuständigen Salesman der Bestellung
            const salesman = await axios.get( item.salesRep["@href"], config);
            // filtere nach den Bestellungen die vom angegebenen Salesman bearbeitet wurden/werden
            if ( String(salesman.data.governmentId) === String(id) ){
                // hole den Kunden der Bestellung
                const customer = await axios.get( item.customer["@href"], config);
                let fillterdItem = {
                    'customer': customer.data.fullName,
                    'accountRating': convertAccountRating(customer.data.accountRating)
                };

                // hole die eigentlichen Bestellungen (Position) mit quantity etc.
                let orderdItems = await  axios.get(item["@href"]+"/position", config);
                orderdItems = orderdItems.data.objects;
                fillterdItem.orders = [];
                for( let position of orderdItems){

                    if( position.quantity && position.product){
                        // hole das verkaufte Produkt
                        let product = await axios.get( position.product["@href"], config);

                        fillterdItem.orders.push({
                            'quantity': Math.round(position.quantity),
                            'product': product.data.name,
                            'bonus': computeOrderBonus(position.quantity,product.data.name, customer.data.accountRating)
                        });
                    }
                }
                myOrders.push(fillterdItem);
            }
        }
        return myOrders;
    } catch (err){
        console.log(err);
    }

}

function convertAccountRating(rating){
    switch (rating){
        case 1: return "very important"; break;
        case 2: return "important"; break;
        case 3: return "normal"; break;
        case 4: return "unimportant"; break;
        default: return "unimportant";
    }
}

function computeOrderBonus(quantity, name, accountRating) {
    let nameValue = 20;
    if( name === 'HooverGo' ){
        nameValue = 30;
    }
    switch (accountRating){
        case 1: return Math.round(quantity*nameValue*1.5); break;
        case 2: return Math.round(quantity*nameValue*1.3); break;
        case 3: return Math.round(quantity*nameValue*1.1); break;
        case 4: return quantity*nameValue; break;
        default: return quantity*nameValue;
    }
}

module.exports = {"getOrdersBySalesmanId": getOrdersBySalesmanId};
