import { useContext, useEffect, useState ,useRef, useReducer } from "react";
//import { User } from "../context/userContent";
// import info from '../context/patient_schedule.json'
import {  useOnClickOutside } from "usehooks-ts";
import { type } from "@testing-library/user-event/dist/type";
import axios from 'axios';
export default function UserData() {
    // {data.author.data.name}
    
    // #####################################################################################
   
 
    // //////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////////
    let initFilter = {
        nextappointmentDate:"",
        patientName:"",
        patientMatricule:"",
        diagnosis: "",
        etat: "",
        searchResults: [],
    }
                        // filter
                        function reducerFitler(filtervaluesreducer, action) {
                            switch (action.type) {
                              case "change":
                                return { 
                                  ...filtervaluesreducer, 
                                  [action.fild]: action.payload 
                                };
                              case "setSearchResults":
                                return {
                                  ...filtervaluesreducer,
                                  searchResults: action.payload
                                };
                              default:
                                return filtervaluesreducer;
                            }
                          }

    function isFilterValid() {
        return (
          filtervaluesreducer.matricule ||
          filtervaluesreducer.patientName ||
          filtervaluesreducer.diagnosis ||
          filtervaluesreducer.etat ||
          filtervaluesreducer.appointmentDate
        );
      }

    function changefiltervaluesreducerfunction(e) {
        console.log(filtervaluesreducer)
       dispatchfiter({
            type:"change",
            fild:e.target.name,
            payload:e.target.value
        })
    }
    const [filtervaluesreducer , dispatchfiter] = useReducer(reducerFitler , initFilter)
    useEffect(() => {
        
        if (isFilterValid()) {
          // Faire l'appel API pour rechercher les données
          console.log(filtervaluesreducer)
          
          axios.post('http://localhost:5000/patient/SerchPatients', filtervaluesreducer)
            .then(response => {
                console.log(response)
              // Mettre à jour les résultats de la recherche dans le state
              dispatchfiter({
                type: "setSearchResults",
                payload: response.data.Patients
              });
            })
            .catch(error => {
              console.error('Erreur lors de la recherche:', error);
            });
        }
      }, [filtervaluesreducer]);  // L'appel API se déclenche dès qu'un filtre change
    const theresult = (ele)=> {
        
        return (
            <tr identifier={ele?.matricule} >
            <td onClick={()=>{
            
            handShow(ele)
        }}
        onContextMenu={(e)=> {
            handlRightClickRemove(e)
        }}
        > {ele?.matricule } </td>
            <td onClick={()=>{
            
            handShow(ele)
        }}  
        onContextMenu={(e)=> {
            handlRightClickRemove(e)
        }}
        > {ele?.nom_patient } </td>
            <td onClick={()=>{
            
            handShow(ele)
        }} onContextMenu={(e)=> {
            handlRightClickRemove(e)
        }
        } > {ele?.next_appointment_date } </td>
        </tr>
        
    )
    }
    // //////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////////
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let info = []
        const [priv , setPriv] = useState(1)
        const [actionDelAdd  , setActionDelAdd ] = useState(null) 
        // del = 0 / add = 1 
        
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const [showPatient , setshowPatient] = useState()
    const [User , setUser] = useState()
    const [passManager , setpassManager] = useState()
    const [passEditor , setpassEditor] = useState()
    const [dataPatient , setdataPatient] = useState()
    const [length_data_patient , setlength_data_patient] = useState()
    const [showdata , setShowdata] = useState([])
    const [stateOfModifier , setStateOfModifier] = useState(0)
    const [listSelected , setListSelected] = useState([])
    const [element , setElement] = useState(null)
    const [listOfTheDeletedObejcts , setListOfTheDeletedObejcts] = useState([])
    const del = useRef()
    const menu = useRef()
    const tab = useRef()
    const iCancalepasswordReq = useRef(null)
    const passwordReq = useRef()
    const passwordReqinput = useRef()
    const theImportanteButton = useRef()
    const addmoredatamenu = useRef(null)
    const [typeofadding , setTypeOfAdding] = useState('none')
    // #####################################################################################
    let init =  {
        patientMatricule : "",
        patientName: "",
        next_appointment_date: "",
        next_appointment_Time: "",
        date_naissance_patient :"",
        file_status:"",
        allergies:"",
        doctor_notes: "",
        emergency_contact : [
            // { name: "John Doe", relation: "Brother", phone: "123-456-7890" }
            {}
        ],
        insurance_details : {
            //{ provider: "HealthCare Inc.", policy_number: "POL123456" }
            provider: "",
            policy_number: ""
        },
        medical_history : [
                //{ illness: "Hypertension", date: "2021-05-10" } 
                {}
        ],
        diagnoses:[
            // [{ diagnosis: "Diabetes", severity: "Moderate", date: "2021-06-15" }]
            {}
        ],
        medications: [
            // [{ name: "Metformin", dosage: "500mg", frequency: "twice daily" }]
            {}
        ],
        treatments: [
            // [{ type: "Physiotherapy", date: "2021-07-01", notes: "Weekly sessions" }]
            {}
        ],
        lab_results:[
            //[{ test: "Blood Sugar", date: "2021-06-15", result: "150 mg/dL" }]
            {}
        ],
        symptoms:[
            //[{ symptom: "Fatigue", onset: "2021-05-01" }]
            {}
        ],
        vital_signs:{
            blood_pressure: "",
            temperature: ""
            
        },
        

    }
    function reducer(valueChageReduce , action) {
        switch(action.type) {
            case 'changeAdding' : return ({...valueChageReduce , [action.fild] : action.payload})
            case 'adding' : return ({...init})
            case 'billing_information' : return ({...valueChageReduce , billing_information:{...valueChageReduce.billing_information ,[action.filed]:action.payload }})
            case 'emergency_contactRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // delete dataremove.emergency_contact[0][action.payload]
                // console.log(dataremove.emergency_contact[0][action.payload])
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.emergency_contact[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.emergency_contact[0][key]
                    }
                }
                dataremove.emergency_contact[0] = obj
                return {...dataremove}
            }
            case 'medical_historyRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.medical_history[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.medical_history[0][key]
                    }
                }
                dataremove.medical_history[0] = obj
                return {...dataremove}
            }
            case 'diagnosesRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.diagnoses[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.diagnoses[0][key]
                    }
                }
                dataremove.diagnoses[0] = obj
                return {...dataremove}
            }
            case 'medicationsRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.medications[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.medications[0][key]
                    }
                }
                dataremove.medications[0] = obj
                return {...dataremove}
            }
            case 'treatmentsRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.treatments[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.treatments[0][key]
                    }
                }
                dataremove.treatments[0] = obj
                return {...dataremove}
            }
            case 'lab_resultsRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.lab_results[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.lab_results[0][key]
                    }
                }
                dataremove.lab_results[0] = obj
                return {...dataremove}
            }
            case 'symptomsRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.symptoms[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.symptoms[0][key]
                    }
                }
                dataremove.symptoms[0] = obj
                return {...dataremove}
            }
            case 'consent_formsRemove' : {
                let dataremove = JSON.parse(JSON.stringify(valueChageReduce));
                // eslint-disable-next-line no-new-object
                const obj = new Object({})
                for (const key in dataremove.consent_forms[0] ) {
                    if (key !== action.payload) {
                        obj[key] = dataremove.consent_forms[0][key]
                    }
                }
                dataremove.consent_forms[0] = obj
                return {...dataremove}
            }
            case 'vital_signs' : return ({...valueChageReduce , vital_signs:{...valueChageReduce.vital_signs ,[action.filed]:action.payload }})
            case 'insurance_details' : return ({...valueChageReduce , insurance_details:{...valueChageReduce.insurance_details ,[action.filed]:action.payload }})

            // #################################################

            case 'consent_formsAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.consent_forms[0][`${Date.now()}`] = action.payload
                return {...dataaddted}
            }
            case 'symptomsAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.symptoms[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'lab_resultsAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.lab_results[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'treatmentsAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.treatments[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'medicationsAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.medications[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'diagnosesAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.diagnoses[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'medical_historyAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.medical_history[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'emergency_contactAdd' : {
                let dataaddted = JSON.parse(JSON.stringify(valueChageReduce));
                dataaddted.emergency_contact[0][`${Date.now()}`] = action.payload
                console.log(dataaddted)
                return {...dataaddted}
            }
            case 'mod' : return ({ 
                patientMatricule:action.patientMatricule,
                patientName: action.patientName,
                next_appointment_date: action.next_appointment_date,
                next_appointment_Time: action.next_appointment_Time,
                date_naissance_patient :action.date_naissance_patient,
                file_status:action.file_status,
                allergies:action.allergies,
                doctor_notes: action.doctor_notes,
                emergency_contact:action.emergency_contact,
                insurance_details:action.insurance_details,
                medical_history:action.medical_history,
                diagnoses:action.diagnoses,
                medications:action.medications,
                treatments:action.treatments,
                lab_results:action.lab_results,
                symptoms:action.symptoms,
                vital_signs:action.vital_signs,
                consent_forms:action.consent_forms,
                
            })
            default : 
        }
    
    }
    const [valueChageReduce , dispatsh] = useReducer(reducer ,init)

    // ########################################################################################

    useOnClickOutside(menu,(e)=>{
        if (e.target === passwordReq.current ||e.target ===passwordReqinput.current || e.target===theImportanteButton.current || e.target ===iCancalepasswordReq.current) {

        }else {
            menu.current.classList.remove('active')
        }
    })
    useOnClickOutside(passwordReq,()=>{
        passwordReq.current.classList.remove('active')
    })
    function handlAdd() {
        menu.current.classList.add('active')
        setStateOfModifier(1)
        dispatsh({type:"adding"})
        
    }
    function removeActiveMenu() {
        menu.current.classList.remove('active')
    }
    
 
    // let listtesting = ["mohamed","zouaoui"]
    // console.log(listtesting[3])
    function handlChangeReducer(e) {
        dispatsh({
            type:'changeAdding',
            fild: e.target.name,
            payload : e.target.value
        })
    }
  
    function handShow(data) {
        axios.post('http://localhost:5000/patient/findPatient', {
            data: data.matricule
        }).then(response => {
            setStateOfModifier(0)
            menu.current.classList.add('active')
            let Patient = response.data.patient;
            console.log(Patient)
            // Séparer date et heure de next_appointment_date
            let appointmentDate = "";
            let appointmentTime = "";
    
            if (Patient.next_appointment_date) {
                const [date, timeWithZ] = Patient.next_appointment_date.split('T');
                appointmentDate = date;
                appointmentTime = timeWithZ ? timeWithZ.replace('Z', '') : "";
            }
           
            
             const emergencyContact = Patient.emergency_contact
            ? Object.entries(JSON.parse(Patient.emergency_contact)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
            
            const insuranceDetails = Patient.insurance_details 
            ? JSON.parse(Patient.insurance_details) 
            : {};
        
        const medicalHistory = Patient.medical_history
            ? Object.entries(JSON.parse(Patient.medical_history)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
        
        const diagnoses = Patient.diagnoses
            ? Object.entries(JSON.parse(Patient.diagnoses)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
        
        const medications = Patient.medications
            ? Object.entries(JSON.parse(Patient.medications)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
        
        const treatments = Patient.treatments
            ? Object.entries(JSON.parse(Patient.treatments)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
        
        const labResults = Patient.lab_results
            ? Object.entries(JSON.parse(Patient.lab_results)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
        
        const symptoms = Patient.symptoms
            ? Object.entries(JSON.parse(Patient.symptoms)).map(([key, value]) => ({
                  [key]: value,
              }))
            : [];
        
            const vitalSigns = Patient.vital_signs 
            ? JSON.parse(Patient.vital_signs) 
            : { blood_pressure: "", temperature: "" };
            // Mise à jour du state
            console.log("matricule : " ,Patient.patient_matricule )
            dispatsh({
                type: 'mod',
                patientMatricule: Patient.patient_matricule, 
                patientName: Patient.nom_patient,
                next_appointment_date: appointmentDate,
                next_appointment_Time: appointmentTime,
                date_naissance_patient: Patient.date_naissance_patient,
                file_status: Patient.file_status,
                allergies: Patient.allergies,
                doctor_notes: Patient.doctor_notes,
                emergency_contact: emergencyContact ,
                insurance_details: insuranceDetails,
                medical_history: medicalHistory,
                diagnoses: diagnoses,
                medications: medications,
                treatments: treatments,
                lab_results: labResults,
                symptoms: symptoms,
                vital_signs: vitalSigns,
            });
            
        }).catch(error => {
            console.log(error);
        });
    }
    
    
    function handlRightClickRemove(e) {
        e.preventDefault()
        e.target.parentElement.classList.toggle('selected')
        let item = e.target.parentElement.getAttribute('identifier')
        if (listOfTheDeletedObejcts.indexOf(item) === -1) {
            setListOfTheDeletedObejcts((prev)=>([...prev,item]))
        } else {
            setListOfTheDeletedObejcts((prev)=> (prev.filter((ele)=>(ele !== item ? ele : null))))
        }
        
    }
    useEffect(() => {
        console.log(listOfTheDeletedObejcts)
        if (listOfTheDeletedObejcts.length > 0) {
            del?.current?.classList.add('active')
        } else {
            del?.current?.classList.remove('active')
        }
    }, [listOfTheDeletedObejcts]);
    

    function handlClickFirst() {
        setPriv(1)
        setListOfTheDeletedObejcts([]);
        [...tab.current.children].forEach((ele) => {
            ele.classList.remove('selected')
        })
    }
    function handlClickLast() {
        setPriv(length_data_patient)
        setListOfTheDeletedObejcts([]);
        [...tab.current.children].forEach((ele) => {
            ele.classList.remove('selected')
        })
    }
    function handlClickButtonMove(i) {
        setPriv(i)
        setListOfTheDeletedObejcts([])
        const list = [...tab.current.children]
        list.forEach((ele) => {
            ele.classList.remove('selected')
        })
    }
    
    function handlsubmitforms(e) {
        e.preventDefault()
        addmoredatamenu.current.classList.add('activate')
    }
    // ###################################################################################
    // ###################################################################################
    // ###################################################################################
    function billing_informationFunction(e) {
        dispatsh({
            type:'billing_information',
            filed:e.target.name,
            payload : e.target.value
        })
    }
    function vital_signsFunction(e) {
        dispatsh({
            type:'vital_signs',
            filed:e.target.name,
            payload : e.target.value
        })
    }
    function insurance_detailsFunction(e) {
        dispatsh({
            type:'insurance_details',
            filed:e.target.name,
            payload : e.target.value
        })
    }   
    // *******************************************************////////////////////////////////////////////////////////////////////////////////***********
        function emergency_contactButton(e) {
            dispatsh({
                type:'emergency_contactRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function medical_historyButton(e) {
            dispatsh({
                type:'medical_historyRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function diagnosesButton(e) {
            dispatsh({
                type:'diagnosesRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function medicationsButton(e) {
            dispatsh({
                type:'medicationsRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function treatmentsButton(e) {
            dispatsh({
                type:'treatmentsRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function lab_resultsButton(e) {
            dispatsh({
                type:'lab_resultsRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function symptomsButton(e) {
            dispatsh({
                type:'symptomsRemove',
                payload:e.target.dataset.item,
                
            })
        }
        function consent_formsButton(e) {
            dispatsh({
                type:'consent_formsRemove',
                payload:e.target.dataset.item,
                
            })
        }
        useEffect(() => {
            if (!dataPatient || dataPatient.length === 0) {
                return; // Attendre que dataPatient soit rempli
            }
        
            let start = (priv - 1) * 10; // Calcul de l'index de départ
            let vid = [];
        
            for (let i = 0; i < 10; i++) {
                const item = dataPatient[start + i];
                if (item) {
                    vid.push(item);
                }
            }
        
            setShowdata(vid); // Mise à jour des données affichées
            console.log("showdata updated:", vid);
        }, [priv, dataPatient]); // Dépendances
        
      // fonction qui permet d'ajouter le patient 
    function  Addpatient() {
        axios.post('http://localhost:5000/patient/addpatient',{
            data : valueChageReduce,
            passManager : passManager,
            user : User.data.info,
        }).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }
    function  deletePatient() {
        axios.post('http://localhost:5000/patient/deletpatient',{
            passManager : passManager,
            user : User.data.info,
            listOfTheDeletedObejcts : listOfTheDeletedObejcts
        }).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    // fonction qui avoire les element du tableau 
    useEffect(() => {
        const savedInfo = JSON.parse(localStorage.getItem("userAuth"));
        console.log("jsonsamet",JSON.parse(localStorage.getItem("userAuth")))
        if (savedInfo) {
            setUser(savedInfo); 
            console.log("User",User)// Utilise l'état pour enregistrer les données
        } else {
            console.error("Aucune donnée trouvée dans localStorage");
        }
        axios.post('http://localhost:5000/patient/getPatient',{
        }).then(response => {
            console.log(response.data);

      const data1 = response.data.data || [];
      setdataPatient(data1);

      const calculatedLength = Math.ceil(data1.length / 10); // Calcul de la pagination
      setlength_data_patient(calculatedLength);

      console.log("Length:", calculatedLength);
        }).catch((error) => {
            console.log(error)
        })
       }
      , []);
      function  uppdatepatient(){
        console.log(valueChageReduce)
        axios.post('http://localhost:5000/patient/UpdatePatients',{  
            matricule : valueChageReduce.patientMatricule,   
            data : valueChageReduce
        }).then(response => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
      }
      function verfAdmin(){
        axios.post('http://localhost:5000/auth/VerfAdmin',{  
            passEditor : passEditor,
            user : User.data.info,
        }).then(response => {
            console.log(response.data)
            passwordReq.current.classList.remove('active')
            handShow(showPatient)
        }).catch((error) => {
            console.log(error)
        })
      }
    // ********************************************************///?????????????????????????????????????????????//////////////////////////////////////**********
    // ###################################################################################
    // ###################################################################################
    // ###################################################################################
    return (
        <div className="userdata">
            <div onClick={(e)=>{
                e.stopPropagation()
            }} ref={passwordReq} className="passwordReq">
                <p>please the enter "{actionDelAdd === 0 || actionDelAdd  === 3 ? "Manager password" : actionDelAdd === 2 ? "Editor password" : null}"</p>
                <input  value={passManager} onChange={(e) =>{ if(actionDelAdd === 0 || actionDelAdd  === 3 ){ setpassManager(e.target.value)}else{setpassEditor(e.target.value)}} }  type="password" />
                <i onClick={()=>{passwordReq.current.classList.remove('active')}} ref={iCancalepasswordReq} class="fa-solid fa-xmark"></i>
                <button ref={theImportanteButton} onClick={()=>{ if(actionDelAdd ===0) { deletePatient()} else { if(actionDelAdd === 3){Addpatient()}else{ verfAdmin()};} }}  >submit</button>
            </div>
            <div ref={menu} className="moreinfo"> 

                {/* adding fucntion data */}
                <div ref={addmoredatamenu} className="addmoredata">
                    <button onClick={()=>{
                        addmoredatamenu.current.classList.remove('activate')
                        // eslint-disable-next-line no-lone-blocks
                        
                    }}><i class="fa-solid fa-xmark"></i></button>
                    {/* switch ########################################################### */}
                    {/* ################################################################### */}
                    {/* ################################################################### */}
                    {
                        {
                            'none':(null),
                            // mull
                            'emergency_contact':
                                    (<div className="chosingDiv">
                                        <h3>emergency contact</h3>
                                        
                                        <form action="" onSubmit={(e)=>{
                                                e.preventDefault()
                                        
                                                const formData = new FormData(e.target)
                                                
                                                let name = formData.get("name")
                                                let phone = formData.get("phone")
                                                
                                                let relation = formData.get("relation")
                                                dispatsh({
                                                    type:"emergency_contactAdd",
                                                    payload:{name,relation,phone}
                                                })
                                            }}>
                                            <label htmlFor="">add new contact</label>
                                            <div className="infoadd">
                                                    <div>
                                                        
                                                        <input type="text" name="name" placeholder="name" />
                                                    </div>
                                                    <div>
                                                        
                                                        <input type="text" name="relation" placeholder="relation" />

                                                    </div>
                                                    <div>

                                                        <input type="tel" name="phone" placeholder="phone" />
                                                    </div>
                                                    <button type="submit">Integrate</button>
                                            </div>
                                        </form>
                                        <div>
                                        {
                                        Object.keys(valueChageReduce.emergency_contact[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    <th>name</th>
                                                    <th>relation</th>
                                                    <th>phone</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce.emergency_contact[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.emergency_contact[0][ele]["name"]}</td>
                                                                <td>{valueChageReduce?.emergency_contact[0][ele]["relation"]}</td>
                                                                <td>{valueChageReduce?.emergency_contact[0][ele]["phone"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{emergency_contactButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                        </div>
                                    </div>),
                            'insurance_details':
                            (<div className="chosingDiv">
                                <h3>insurance details</h3>
                                
                                <form action="">
                                    
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">provider</label>
                                                <input type="text" onChange={(e)=>insurance_detailsFunction(e)} name="provider" value={valueChageReduce?.insurance_details?.provider} placeholder="provider" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">policy number</label>
                                                <input type="text" onChange={(e)=>insurance_detailsFunction(e)} className="round" value={valueChageReduce?.insurance_details?.policy_number} name="policy_number" placeholder="policy number" />
                                            </div>
                                            {/* <button className="activate">save</button> */}
                                    </div>
                                </form>
                            </div>),
                            // mull
                            'medical_history':
                            (<div className="chosingDiv">
                                <h3>medical history</h3>
                                
                                <form action="" onSubmit={(e)=>{
                                    e.preventDefault()
                                    
                                    const formData = new FormData(e.target)
                                    let illness = formData.get("illness")
                                    
                                    let date = formData.get("date")
                                    dispatsh({
                                        type:"medical_historyAdd",
                                        payload:{illness,date}
                                    })
                                }}>
                                    <label htmlFor="">add new file</label>
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">illness</label>
                                                <input type="text" name="illness" placeholder="illness" />
                                            </div>
                                            <div>
                                                <label htmlFor="" className="active">date</label>
                                                <input type="date" name="date" placeholder="date" />

                                            </div>
                                            <button type="submit" className="activate">Integrate</button>
                                            
                                    </div>
                                </form>
                                <div>
                                {
                                        Object.keys(valueChageReduce.medical_history[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    <th>illness</th>
                                                    <th>date</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce.medical_history[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.medical_history[0][ele]["illness"]}</td>
                                                                <td>{valueChageReduce?.medical_history[0][ele]["date"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{medical_historyButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                        </div>
                            </div>),
                            // mull
                            "diagnoses":
                            (<div className="chosingDiv">
                                <h3>diagnoses</h3>
                                
                                <form action="" onSubmit={(e)=>{
                                    e.preventDefault()
                                    // console.log(e)
                                    const formData = new FormData(e.target)
                                    let diagnosis = formData.get("diagnosis")
                                    let severity = formData.get("severity")
                                    let date = formData.get("date")
                                    dispatsh({
                                        type:"diagnosesAdd",
                                        payload:{diagnosis,severity,date}
                                    })
                                }}>
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">diagnosis</label>
                                                <input type="text" name="diagnosis" placeholder="diagnosis" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">severity </label>
                                                <input type="text"  name="severity" placeholder="severity" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">date </label>
                                                <input type="date"  name="date" placeholder="date" />
                                            </div>
                                            <button type="submit" className="activate">Integrate</button>
                                    </div>
                                </form>
                                <div>
                                {
                                        Object.keys(valueChageReduce?.diagnoses[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    <th>diagnosis</th>
                                                    <th>severity</th>
                                                    <th>date</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce.diagnoses[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.diagnoses[0][ele]["diagnosis"]}</td>
                                                                <td>{valueChageReduce?.diagnoses[0][ele]["severity"]}</td>
                                                                <td>{valueChageReduce?.diagnoses[0][ele]["date"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{diagnosesButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                        </div>
                            </div>),
                            // mull
                            "medications":
                            (<div className="chosingDiv">
                                <h3>medications</h3>
                                
                                <form action="" onSubmit={(e)=>{
                                    e.preventDefault()
                                    // console.log(e)
                                    const formData = new FormData(e.target)
                                    let name = formData.get("name")
                                    let dosage = formData.get("dosage")
                                    let frequency = formData.get("frequency")
                                    dispatsh({
                                        type:"medicationsAdd",
                                        payload:{name,dosage,frequency}
                                    })
                                }}>
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">name</label>
                                                <input type="text" name="name" placeholder="name" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">dosage </label>
                                                <input type="text"  name="dosage" placeholder="dosage" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">frequency </label>
                                                <input type="text"  name="frequency" placeholder="frequency" />
                                            </div>
                                            <button type="submit" className="activate">Integrate</button>
                                    </div>
                                </form>
                                <div>
                                {
                                        Object.keys(valueChageReduce.medications[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    <th>name</th>
                                                    <th>dosage</th>
                                                    <th>frequency</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce.medications[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.medications[0][ele]["name"]}</td>
                                                                <td>{valueChageReduce?.medications[0][ele]["dosage"]}</td>
                                                                <td>{valueChageReduce?.medications[0][ele]["frequency"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{medicationsButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                        </div>
                            </div>),
                            // mull
                            "treatments":
                            (<div className="chosingDiv">
                                <h3>treatments</h3>
                                
                                <form action="" onSubmit={(e)=>{
                                    e.preventDefault()
                                    // console.log(e)
                                    const formData = new FormData(e.target)
                                    let type = formData.get("type")
                                    let notes = formData.get("notes")
                                    let date = formData.get("date")
                                    dispatsh({
                                        type:"treatmentsAdd",
                                        payload:{type,notes,date}
                                    })
                                }}>
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">type</label>
                                                <input type="text" name="type" placeholder="type" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">notes </label>
                                                <input type="text"  name="notes" placeholder="notes" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">date </label>
                                                <input type="date"  name="date"  />
                                            </div>
                                            <button className="activate">Integrate</button>
                                    </div>
                                </form>
                                <div>
                                    
                                {
                                        Object.keys(valueChageReduce.treatments[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    <th>type</th>
                                                    <th>notes</th>
                                                    <th>date</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce?.treatments[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.treatments[0][ele]["type"]}</td>
                                                                <td>{valueChageReduce?.treatments[0][ele]["notes"]}</td>
                                                                <td>{valueChageReduce?.treatments[0][ele]["date"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{treatmentsButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                        </div>
                            </div>),
                            // mull
                            "lab_results":
                            (<div className="chosingDiv">
                                <h3>lab results</h3>
                                <form action="" onSubmit={(e)=>{
                                    e.preventDefault()
                                    // console.log(e)
                                    const formData = new FormData(e.target)
                                    let test = formData.get("test")
                                    let result = formData.get("result")
                                    let date = formData.get("date")
                                    dispatsh({
                                        type:"lab_resultsAdd",
                                        payload:{test,result,date}
                                    })
                                }}>
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">test</label>
                                                <input type="text" name="test" placeholder="test" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">result </label>
                                                <input type="text"  name="result" placeholder="result" />
                                            </div>
                                            <div>   
                                                <label htmlFor="" className="active">date </label>
                                                <input type="date"  name="date"  />
                                            </div>
                                            <button  className="activate">Integrate</button>
                                    </div>
                                </form>
                                <div>
                                {
                                        Object.keys(valueChageReduce.lab_results[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    <th>test</th>
                                                    <th>result</th>
                                                    <th>date</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce.lab_results[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.lab_results[0][ele]["test"]}</td>
                                                                <td>{valueChageReduce?.lab_results[0][ele]["result"]}</td>
                                                                <td>{valueChageReduce?.lab_results[0][ele]["date"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{lab_resultsButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                    </div>
                            </div>),
                            // mull
                            "symptoms":
                            (<div className="chosingDiv">
                                <h3>symptoms</h3>
                                <form action="" onSubmit={(e)=>{
                                    e.preventDefault()
                                    // console.log(e)
                                    const formData = new FormData(e.target)
                                    let symptom = formData.get("symptom")
                                    let onset = formData.get("onset")
                                    dispatsh({
                                        type:"symptomsAdd",
                                        payload:{symptom,onset}
                                    })
                                }}>
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">symptom</label>
                                                <input type="text" name="symptom" placeholder="symptom" />
                                            </div>
                            
                                            <div>   
                                                <label htmlFor="" className="active">onset </label>
                                                <input type="date"  name="onset"  />
                                            </div>
                                            <button type="submit" className="activate">Integrate</button>
                                    </div>
                                </form>
                                <div>
                                {
                                        Object.keys(valueChageReduce.symptoms[0]).length === 0 
                                            ? null 
                                            : (<table className="tableshowinfo">
                                                <tr>
                                                    {/* symptoms */}
                                                    <th>symptom</th>
                                                    <th>onset</th>
                                                    <th>delete</th>
                                                </tr>
                                                {
                                                    // console.log(valueChageReduce.emergency_contact[0])
                                                    Object.keys(valueChageReduce.symptoms[0]).map((ele ,ind)=>{
                                                        return(
                                                            <tr>
                                                                <td>{valueChageReduce?.symptoms[0][ele]["symptom"]}</td>
                                                            
                                                                <td>{valueChageReduce?.symptoms[0][ele]["onset"]}</td>
                                                                <td><button data-item={ele} onClick={(e)=>{symptomsButton(e)}} className="remove">remove</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>)
                                        }
                                    </div>
                            </div>),
                            "vital_signs":
                            (<div className="chosingDiv">
                                <h3>vital signs</h3>
                                
                                <form action="">
                                    <div className="infoadd">
                                            <div>
                                                <label htmlFor="" className="active">blood pressure</label>
                                                <input type="text" onChange={(e)=>{vital_signsFunction(e)}} name="blood_pressure" value={valueChageReduce?.vital_signs?.blood_pressure} placeholder="blood pressure" />
                                            </div>
                                            <div>
                                                <label htmlFor="" className="active">temperature</label>
                                                <input type="text" onChange={(e)=>{vital_signsFunction(e)}} name="temperature" value={valueChageReduce?.vital_signs?.temperature} className="round"  placeholder="temperature" />
                                            </div>
                            
                                    
                                            {/* <button className="activate">save</button> */}
                                    </div>
                                </form>
                                
                            </div>),
                            // "billing_information":
                            // (<div className="chosingDiv">
                            //     <h3>billing information</h3>
                                
                            //     <form action="">
                            //         <div className="infoadd">
                            //                 <div>
                            //                     <label htmlFor="" className="active">total_cost</label>
                            //                     <input type="number" name="total_cost" onChange={(e)=>(billing_informationFunction(e))} value={valueChageReduce?.billing_information?.total_cost} placeholder="total cost " />
                            //                 </div>
                            //                 <div>
                            //                     <label htmlFor="" className="active">paid amount</label>
                            //                     <input type="number" name="paid_amount" onChange={(e)=>(billing_informationFunction(e))} value={valueChageReduce?.billing_information?.paid_amount}  placeholder="paid amount" />
                            //                 </div>
                            //                 <div>
                            //                     <label htmlFor="" className="active">due_balance</label>
                            //                     <input type="number" name="due_balance" onChange={(e)=>(billing_informationFunction(e))} value={valueChageReduce?.billing_information?.due_balance} className="round"  placeholder="due balance" />
                            //                 </div>
                            //                 {/* <button className="activate">save</button> */}
                            //         </div>
                            //     </form>
                            // </div>),
                            // mull
                            // "consent_forms":
                            // (<div className="chosingDiv">
                            //     <h3>consent forms</h3>
                                
                            //     <form action="" onSubmit={(e)=>{
                            //         e.preventDefault()
                            //         // console.log(e)
                            //         const formData = new FormData(e.target)
                            //         let link = formData.get("link")
                            //         dispatsh({
                            //             type:"consent_formsAdd",
                            //             payload:link
                            //         })
                            //     }}>
                            //         <div className="infoadd">
                            //                 <div>
                            //                     <label htmlFor="" className="active">link</label>
                            //                     <input type="text"  name="link" placeholder="link" />
                            //                 </div>
                            //                 <button type="submit" className="activate">Integrate</button>
                            //         </div>
                            //     </form>
                            //     <div>

                            //     {
                            //         Object.keys(valueChageReduce.emergency_contact[0]).length === 0 
                            //         ? null 
                            //         : (<table className="tableshowinfo">
                            //                     <tr>
                            //                         {/* symptoms */}
                            //                         <th>link</th>
                                                    
                            //                         <th>delete</th>
                            //                     </tr>
                            //                     {
                            //                         // console.log(valueChageReduce.emergency_contact[0])
                            //                         Object.keys(valueChageReduce.consent_forms[0]).map((ele ,ind)=>{
                            //                             return(
                            //                                 <tr>
                            //                                     <td><a target="_blank" href={valueChageReduce?.consent_forms[0][ele]}>{valueChageReduce?.consent_forms[0][ele]}</a></td>
                            //                                     <td><button data-item={ele} onClick={(e)=>{consent_formsButton(e)}} className="remove">remove</button></td>
                            //                                 </tr>
                            //                             )
                            //                         })
                            //                     }
                            //                 </table>)
                            //             }
                            //         </div>
                            // </div>),
                        }[typeofadding]
                    }
                    {/* switch ########################################################### */}
                    {/* ################################################################### */}
                    {/* ################################################################### */}
                </div>

                <i onClick={removeActiveMenu} class="icon fa-solid fa-xmark"></i>
                <div className="intro">
                <div>
                <p>patient Information</p>
                <span>local your partient information</span>
                </div>

                <button onClick={()=>{
                    console.log("add")
                      console.log(valueChageReduce)  
                    /////////////////// important ////////////////////////////
                            // 
                           
                            if (stateOfModifier === 1) {
                                passwordReq.current.classList.add('active')
                                setActionDelAdd(3)
                              
                            
                            } else if (stateOfModifier === 0) {
                                uppdatepatient()
                            }
                            // console.log(valueChageReduce)
                        }} className="addmodfie"> {stateOfModifier === 0 ? "Save Changes":stateOfModifier === 1 ? "Add" : null } </button>
                </div>
                <form action="" onSubmit={handlsubmitforms} className="changeAdd">
                   {/* <label htmlFor=""> Matricule </label>
                    <input name="matricule" type="number"  onChange={handlChangeReducer}  value={valueChageReduce?.matricule} /> */}
                    <label htmlFor=""> patient Name </label>
                    <input name="patientName" type="text" onChange={handlChangeReducer}  value={valueChageReduce?.patientName} />
                    <label htmlFor=""> date of birth  </label>
                    <input name="date_naissance_patient" type="date" onChange={handlChangeReducer} value={valueChageReduce?.date_naissance_patient}  />
                    <label htmlFor=""> date of next appotment </label>
                    <input name="next_appointment_date" type="date" onChange={handlChangeReducer} value={valueChageReduce?.next_appointment_date}  />
                    <label htmlFor=""> time </label>
                    <input name="next_appointment_Time" type="time" onChange={handlChangeReducer} value={valueChageReduce?.next_appointment_Time} />
                    <label htmlFor=""> file status </label>
                    <input name="file_status" type="text" onChange={handlChangeReducer} value={valueChageReduce?.file_status} />
                    <label htmlFor=""> all ergies </label>
                    <input name="allergies" type="text" onChange={handlChangeReducer} value={valueChageReduce?.allergies} />
                    <label htmlFor=""> doctor notes </label>
                    <input name="doctor_notes" type="text" onChange={handlChangeReducer} value={valueChageReduce?.doctor_notes} />
                   
                </form>
                <form action="" onSubmit={handlsubmitforms} className="changeAdd">
                <label htmlFor="">emergency contact</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('emergency_contact')
                    }} >show more</button>
                    <label htmlFor="">insurance details</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('insurance_details')
                    }}>show more</button>
                    {/* medical_history */}
                    <label htmlFor="">medical history</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('medical_history')
                    }}>show more</button>
                    <label htmlFor="">diagnoses</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('diagnoses')
                    }}>show more</button>
                    <label htmlFor="">medications</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('medications')
                    }}>show more</button>
                    <label htmlFor="">treatments</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('treatments')
                    }}>show more</button>
                    <label htmlFor="">lab results</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('lab_results')
                    }}>show more</button>
                    <label htmlFor="">symptoms</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('symptoms')
                    }}>show more</button>
                    <label htmlFor="">vital signs</label>
                    <button onClick={(e)=>{
                        setTypeOfAdding('vital_signs')
                    }}>show more</button>
                </form>

            </div>
            <div className="text">
                <h2>
                    welcome back <span>test</span> to your dashboard !{" "}
                </h2>
                <p>
                    from here you can change and update your all data , we hope that we
                    can satisfaite you .{" "}
                </p>
            </div>
            <div className="searchingFilter">
                <h2>searching by : </h2>
                <form action="">
                    <input type="number" onChange={(e)=>{changefiltervaluesreducerfunction(e)}} value={filtervaluesreducer.patientMatricule} name="matricule" id="" placeholder="matricule" />
                    <input type="text" onChange={(e)=>{changefiltervaluesreducerfunction(e)}} value={filtervaluesreducer.patientName} name="patientName" id="" placeholder="patientName" />
                    <input type="text" onChange={(e)=>{changefiltervaluesreducerfunction(e)}} value={filtervaluesreducer.diagnosis} name="diagnosis" id="" placeholder="diagnosis" />
                    <input type="text" onChange={(e)=>{changefiltervaluesreducerfunction(e)}} value={filtervaluesreducer.etat} name="etat" id="" placeholder="etat" />
                    <input type="date" onChange={(e)=>{changefiltervaluesreducerfunction(e)}} value={filtervaluesreducer.nextappointmentDate} name="appointmentDate" id="" placeholder="appointmentDate" />
                    
                </form>
                {filtervaluesreducer.patientMatricule || filtervaluesreducer.patientName || filtervaluesreducer.nextappointmentDate ||filtervaluesreducer.diagnosis || filtervaluesreducer.etat ?
                (<table ref={tab}>
                    <tr>
                        <th>Matricule</th>
                        <th>Patient Name</th>
                        <th>Next Appointment Date</th>
                        <th>diagnosis</th>
                        <th>etat</th>
                    </tr>
                    {
                        filtervaluesreducer.searchResults.map((ele ,i)=> {
                            let data = ele
                            // console.log(ele)
                            const message = (<p>data not existe</p>)
                            if (!data) {
                                return null
                            } else {
                                // console.log(data)
                                // 1
                                if (filtervaluesreducer.patientMatricule && filtervaluesreducer.patientName && !filtervaluesreducer.appointmentDate) {
                                    if (ele.matricule === parseInt((filtervaluesreducer.patientMatricule)) && (ele.nom_patient.includes((filtervaluesreducer.patientName)))) {
                                        return theresult(ele)
                                    }
                                    else {
                                        return null
                                    }
                                }
                                // 2
                                if (filtervaluesreducer.patientMatricule && filtervaluesreducer.nextappointmentDate && !filtervaluesreducer.patientName) {
                                    if (ele.matricule === parseInt((filtervaluesreducer.patientMatricule)) && (ele.next_appointment_date.includes((filtervaluesreducer.nextappointmentDate)))) {
                                        return theresult(ele)
                                    }
                                    else {
                                        return null
                                    }
                                }
                                // 3
                                if (filtervaluesreducer.patientName && filtervaluesreducer.nextappointmentDate && !filtervaluesreducer.matricule ) {
                                    if (ele.nom_patient.includes((filtervaluesreducer.patientName)) && (ele.next_appointment_date.includes((filtervaluesreducer.nextappointmentDate)))) {
                                        return theresult(ele)
                                    }
                                    else {
                                        return null
                                    }
                                }
                                // 4
                                if (filtervaluesreducer.patientMatricule && filtervaluesreducer.patientName && filtervaluesreducer.nextappointmentDate ) {
                                    if ((ele.matricule === parseInt((filtervaluesreducer.patientMatricule))) &&  ele.nom_patient.includes((filtervaluesreducer.patientName)) && (ele.next_appointment_date.includes((filtervaluesreducer.nextappointmentDate)))) {
                                        return theresult(ele)
                                    }
                                    else {
                                        return null
                                    }
                                }
                                // 5
                                if (filtervaluesreducer.patientMatricule && !filtervaluesreducer.patientName && !filtervaluesreducer.nextappointmentDate) {
                                    if (ele.matricule === parseInt((filtervaluesreducer.patientMatricule))) {
                                        return theresult(ele)
                                    }else {
                                        return null
                                    }

                                }
                                // 6
                                if (!filtervaluesreducer.patientMatricule && filtervaluesreducer.patientName && !filtervaluesreducer.nextappointmentDate ) {
                                    if (ele.nom_patient.includes((filtervaluesreducer.patientMatricule))) {
                                        return theresult(ele)
                                    }else {
                                        return null
                                    }
                                }
                                // 7
                                if (!filtervaluesreducer.patientMatricule && !filtervaluesreducer.patientName && filtervaluesreducer.nextappointmentDate ) {
                                    if (ele.next_appointment_date.includes((filtervaluesreducer.nextappointmentDate))) {
                                        return theresult(ele)
                                    }else {
                                        return null
                                    }
                                }
                                // 8 -<>-
                                
                            }
                            }
                        )
                        
                        
                    }      
                </table>) :
                null}
            </div>
            {!(filtervaluesreducer.matricule || filtervaluesreducer.patientName || filtervaluesreducer.nextappointmentDate) ?
            (<div className="info">
                <div className="top">
                    <h2>Patient Schedule Template</h2>
                    <div>
                        <button onClick={()=>{
                            passwordReq.current.classList.add('active')
                            setActionDelAdd(0)
                        }} ref={del}  do='remove' >Remove</button>
                        <button onClick={handlAdd} do='add'>Add A Patient</button>
                    </div>
                </div>
                <table ref={tab}>
                    <tr>
                    <th>Matricule</th>
                        <th>Patient Name</th>
                        <th>Next Appointment Date</th>
                        <th>diagnosis</th>
                        <th>etat</th>
                    </tr>
                    {
                        [...Array(10)].map((ele ,i)=> {
                            let data = showdata[i]
                            if (!data) {
                                return null
                            } else {
                                // console.log(data)
                                return (
                                    <tr identifier={showdata[i]?.matricule} >
                                    <td onClick={()=>{
                                    passwordReq.current.classList.add('active');
                                    setActionDelAdd(2)
                                    handShow(data)
                                    setshowPatient(data)
                                }}
                                onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }}
                                > {showdata[i]?.matricule } </td>
                                    <td onClick={()=>{
                                    passwordReq.current.classList.add('active');
                                    setActionDelAdd(2)
                                    setshowPatient(data)
                                }}  
                                onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }}
                                > {showdata[i]?.nom_patient } </td>
                                    <td onClick={()=>{
                                    
                                    passwordReq.current.classList.add('active');
                                    setActionDelAdd(2)
                                    setshowPatient(data)
                                }} onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }
                                } > {showdata[i]?.next_appointment_date } </td>
                                 <td onClick={()=>{
                                    passwordReq.current.classList.add('active');
                                    setActionDelAdd(2)
                                    setshowPatient(data)
                                }} onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }
                                } > {showdata[i]?.diagnosis } </td>
                                 <td onClick={()=>{
                                    passwordReq.current.classList.add('active');
                                    setActionDelAdd(2)
                                    setshowPatient(data)
                                }} onContextMenu={(e)=> {
                                   
                                    handlRightClickRemove(e)
                                }
                                } > {showdata[i]?.etat
                                } </td>
                                </tr>
                                
                            )
                            }
                            }
                        )
                        
                        
                    }
                </table>
                <div className="switch">
                    {/*  */}
                    <button onClick={()=> {handlClickFirst()}} >First page</button>
                    {
                        [...Array(length_data_patient)].map((ele,i)=>{
                            return(<button className={(i+1)===priv ? 'active':null} onClick={()=>{handlClickButtonMove(i+1)}} >{i+1}</button>)
                        })
                    }
                    <button onClick={()=>{handlClickLast()}}>Last page</button>
                </div>
            </div>)
            : null}
        </div>
    );
}

{/* <div className="contacts">
                    
<div className="showcontacts">
    {/* <input type="let" />
    <button className="add">add</button> */}
    // <p>emergency Contact : </p>
    {/* <div>{valueChageReduce?.emergencyContact?.contact1}</div>
    <div>{valueChageReduce?.emergencyContact?.contact2}</div>
    <div>{valueChageReduce?.emergencyContact?.contact3}</div> */}
    {/* #######################*/}
    // <label htmlFor=""> contact 1 </label>
    // <input name="contact1" type="tel" onChange={handlChangeReducerContact}  value={valueChageReduce?.emergencyContact?.contact1} />
    // <label htmlFor=""> contact 2 </label>
    // <input name="contact2" type="tel" onChange={handlChangeReducerContact}  value={valueChageReduce?.emergencyContact?.contact2} />
    // <label htmlFor=""> contact 3 </label>
    // <input name="contact3" type="tel" onChange={handlChangeReducerContact}  value={valueChageReduce?.emergencyContact?.contact3} />
    {/* ##################### */}
// </div>
// </div> */}