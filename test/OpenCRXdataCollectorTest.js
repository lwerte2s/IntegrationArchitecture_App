const opencrx = require('../OpenCRX/dataCollector');
const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();

describe("mytest", function (){
    let axiosget;
    let axiospost;
    let myOrders;
    let salesman;
    let kunde;
    let position;
    let produkt;

    beforeEach( () => {
        myOrders = {
            status: 'success',
            data: {
                objects: [
                    { salesRep: { '@href' : 'salesRep'}, customer: {'@href': 'customer'}, '@href': ''}

                ]
            }
        };
        salesman = {
            data: {
                governmentId: 1
            }
        };
        kunde = {
            data: {
                fullName: 'test-gmbh',
                accountRating: 5,
            }
        };
        position = {
            data: {
                objects:[{quantity: 10, product:{'@href': 'product'}}]
            }
        };
        produkt = {
            data: {
                name: 'test-produkt'
            }
        }

        axiosget = sinon.stub(axios, 'get');
        axiospost = sinon.stub(axios, 'post');
    });

    afterEach( ()=> {
        axiosget.restore();
        axiospost.restore();
    });


    it('should return all employees', async function () {
        axiosget.withArgs('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder').returns(Promise.resolve(myOrders));
        axiosget.withArgs('salesRep').returns(Promise.resolve(salesman));
        axiosget.withArgs('customer').returns(Promise.resolve(kunde));
        axiosget.withArgs('/position').returns(Promise.resolve(position));
        axiosget.withArgs('product').returns(Promise.resolve(produkt));

        let orders = await opencrx.getOrdersBySalesmanId(1);
        orders.should.be.eql([{"customer":"test-gmbh","accountRating":"unimportant","orders":[{"quantity":10,"product":"test-produkt","bonus":200}]}]);
    });





});
