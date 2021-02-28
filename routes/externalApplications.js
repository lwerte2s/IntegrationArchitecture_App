const express = require('express');
const router = express.Router();
const opencrx = require('../OpenCRX/dataCollector');
const orangehrm = require('../OrangeHRM/dataCollector');
const cors = require('cors');

// Get orders by id
router.get('/opencrx/:salesmanId', async (req, res) => {
    try{
        const orders = await opencrx.getOrdersBySalesmanId( req.params.salesmanId).then(JSON.stringify);
        res.send(orders);
    } catch(err) {
        res.send({error: err});
    }
});



// Create new BonusSalary
router.post('/orangehrm/:salesmanId/bonussalary', async (req,res) => {
    try{
        const response = await orangehrm.addBonusSalary(req.params.salesmanId,req.body)
        res.send( response );
    } catch(err){
        res.send({error: err});
    }
});


// get all Salesmen
router.get('/orangehrm/employees', async (req, res) => {
    try{
        const response = await orangehrm.getAllEmployees();
        res.send(
            response.data.filter( x => x.unit === "Sales")
            .map( sales => {
                return {name: sales.fullName, id: sales.code, ohrmId: sales.employeeId, department: sales.unit};
            })
        );
    } catch(err) {
        res.send({error: err});
    }
});

module.exports = router;
