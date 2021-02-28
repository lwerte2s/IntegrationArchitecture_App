const orangehrm = require('../OrangeHRM/dataCollector');
const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();

describe("mytest", function (){
    let axiosget;
    let axiospost;
    let myEmployees;

    beforeEach( () => {

        myEmployees = {
            status: 'success',
            data: [
                {
                    id: 4,
                    name: 'Alda',
                },
                {
                    id: 5,
                    name: 'Miller',
                },
    ]
    };
        axiosget = sinon.stub(axios, 'get');
        axiospost = sinon.stub(axios, 'post');
    });
    afterEach( ()=> {
        axiosget.restore();
        axiospost.restore();
    });


        it('should return all employees', async function () {
            axiosget.returns(Promise.resolve(myEmployees));
            axiospost.returns(Promise.resolve({data: "helloo"}));

            let employees = await orangehrm.getAllEmployees();
            employees[0].id.should.be.eql(4);
            employees[1].name.should.be.eql('Miller');
            chai.expect(axiosget.calledOnce).to.be.true;
        });

        it('should return success message', async function () {
            axiospost.returns(Promise.resolve({data: "success"}));

            let message = await orangehrm.addBonusSalary(4,{year: 2020, value: 1000});
            message.should.be.eql('success');
            chai.expect(axiospost.calledTwice).to.be.true;
        });


    it('should get access token and alter the config object', async function () {
        axiospost.returns(Promise.resolve( { data: {access_token: "new_access_token"} }));

        await orangehrm.getAccessToken();
        orangehrm.config.headers.Authorization.should.be.eql(`Bearer new_access_token`);
        chai.expect(axiospost.calledOnce).to.be.true;
    });



});
