const express = require('express');
const { AddPatient,Getpatient,DeletPatient,findPatient,UpdatePatients,SerchPatients} = require('../Controller/userController');

const router = express.Router();

router.post('/addpatient', AddPatient);
router.post('/getPatient',Getpatient);
router.post('/deletpatient',DeletPatient);
router.post('/findPatient', findPatient);
router.post('/UpdatePatients',UpdatePatients);
router.post('/SerchPatients',SerchPatients)


module.exports = router;
