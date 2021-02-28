const express = require('express');
const router = express.Router();
const evaluationRecordModel = require("../models/evalutaionRecordModel");
const evaluationCriteria = require("../models/evaluationCriteria");


// Get all Records
router.get('/', async (req, res) => {
    try{
        const records = await evaluationRecordModel.find();
        res.send(records);
    } catch(err) {
        res.send({error: err});
    }
});

// Get Record by id
router.get('/:salesmanId', async (req, res) => {
    try{
        let record = await evaluationRecordModel.find({salesmanId: req.params.salesmanId}, "", (err, target) => {
            try{
                console.log(target);
            } catch(err){
                res.send({error: err});
            }
        });

        for( let r of record){
            r.goals = r.goals.map( function(data){ return {
                description : data.description,
                targetValue: data.targetValue,
                actualValue: data.actualValue,
                bonus: computeSocialBonus(data.actualValue)
            };});

        }
        res.send(record);
    } catch(err) {
        res.send({error: err});
    }
});

// Create new Record
router.post('/', async (req,res) => {
    const record = new evaluationRecordModel({
        salesmanId: req.body.salesmanId,
        evaluationId: req.body.evaluationId,
        year: req.body.year,
        goals: [],
        remarks: ""
    });
    try{
        const savedRecord = await record.save();
        res.send(savedRecord);
    } catch(err){
        res.send({error: err});
    }
});


// Update Record Remarks
router.patch('/:salesmanId/:evaluationId/remarks', async (req,res) => {
    try{
        const updatedRecord = await evaluationRecordModel.update({salesmanId: req.params.salesmanId, evaluationId: req.params.evaluationId }, {remarks: req.body.remarks});
        res.send(updatedRecord);
    } catch(err){
        res.send({error: err});
    }
});


// Update Record
router.patch('/:salesmanId/:evaluationId', async (req,res) => {
    try{
        const updatedRecord = await evaluationRecordModel.updateOne({salesmanId: req.params.salesmanId, evaluationId: req.params.evaluationId },  req.body);
        res.send(updatedRecord);
    } catch(err){
        res.send({error: err});
    }
});

// Delete Record
router.delete('/:salesmanId/:evaluationId', async (req,res) => {
    try{
        const deletedRecord = await evaluationRecordModel.remove({salesmanId: req.params.salesmanId, evaluationId: req.params.evaluationId});
        res.send(deletedRecord);
    } catch(err){
        res.send({error: err});
    }
});


// Create new Criteria
router.patch('/:salesmanId/:evaluationId/criteria', async (req,res) => {
    const criteria = new evaluationCriteria({
        description: req.body.description,
        targetValue: req.body.targetValue,
        actualValue: req.body.actualValue,
    });
    try{
        const updatedRecord = await evaluationRecordModel.update({salesmanId: req.params.salesmanId, evaluationId: req.params.evaluationId },  {$push: {goals: criteria}});
        res.send(updatedRecord);
    } catch(err){
        res.send({error: err});
    }
});

function computeSocialBonus(actualValue){
    switch (actualValue){
        case 1: return 0; break;
        case 2: return 0; break;
        case 3: return 20; break;
        case 4: return 50; break;
        case 5: return 100; break;
        default: return 0;
    }
}

module.exports = router;
