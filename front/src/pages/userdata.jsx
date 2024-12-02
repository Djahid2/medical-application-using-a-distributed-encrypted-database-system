import { useContext, useEffect, useState ,useRef, useReducer } from "react";
import { User } from "../context/userContent";
import info from '../context/patient_schedule.json'
import { useOnClickOutside } from "usehooks-ts";
import { type } from "@testing-library/user-event/dist/type";
export default function UserData() {
    // {data.author.data.name}
    // #####################################################################################
    const data = useContext(User);
    const [priv , setPriv] = useState(1)
    const [actionDelAdd  , setActionDelAdd ] = useState(null) 
    // del = 0 / add = 1 
    const [showdata , setShowdata] = useState([])
    const [stateOfModifier , setStateOfModifier] = useState(0)
    const [listSelected , setListSelected] = useState([])
    const [element , setElement] = useState(null)
    const [listOfTheDeletedObejcts , setListOfTheDeletedObejcts] = useState([])
    const del = useRef()
    const len = Math.ceil(info.length / 10)
    const menu = useRef()
    const tab = useRef()
    const iCancalepasswordReq = useRef(null)
    const passwordReq = useRef()
    const passwordReqinput = useRef()
    const theImportanteButton = useRef()

    // #####################################################################################
    let init =  {
        patientId:"",
        patientName: "",
        appointmentDate: "",
        appointmentTime: "",
        doctorName: "",
        department: "",
        treatment: "",
        notes: "",
        emergencyContact: {
            contact1: "",
            contact2: "",
            contact3: "",
        }
    }
    function reducer(valueChageReduce , action) {
        switch(action.type) {
            case 'changeAdding' : return ({...valueChageReduce , [action.fild] : action.value})
            case 'changeAddingContact' : return ({...valueChageReduce , emergencyContact: {
                ...valueChageReduce.emergencyContact,
                [action.fild]: action.value
            }})
            case 'mod' : return ({ 
                patientId:action.patientId,
                patientName: action.patientName,
                appointmentDate: action.appointmentDate,
                appointmentTime: action.appointmentTime,
                doctorName: action.doctorName,
                department: action.department,
                treatment: action.treatment,
                notes: action.notes,
                emergencyContact: {
                    contact1: action.emergencyContact.contact1,
                    contact2: action.emergencyContact.contact2,
                    contact3: action.emergencyContact.contact3,
                }
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
    }
    function removeActiveMenu() {
        menu.current.classList.remove('active')
        
    }
    
    useEffect(()=> {
            let start = (priv -1 ) * 10;
            let vid = []
            for (let i = 0 ; i < 10 ;i++) {
                vid.push(info[start + i])
            }
            setShowdata(vid)
    },[priv])
    
    function handShow(data) {
        setStateOfModifier(0)
        menu.current.classList.add('active')
        dispatsh({
            type:'mod',
            patientId:data.patientId,
            patientName: data.patientName,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            doctorName: data.doctorName,
            department: data.department,
            treatment: data.treatment,
            notes: data.notes,
            emergencyContact: {
                contact1: data.emergencyContact.contact1,
                contact2: data.emergencyContact.contact2,
                contact3: data.emergencyContact.contact3,
            }
        })
        console.log(valueChageReduce)
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
        if (listOfTheDeletedObejcts.length > 0) {
            del.current.classList.add('active')
        } else {
            del.current.classList.remove('active')
        }
    }, [listOfTheDeletedObejcts]);
    function handlChangeReducer(e) {
        dispatsh({
            type:'changeAdding',
            fild: e.target.name,
            payload : e.target.value
        })
    }
    function handlChangeReducerContact(e) {
        dispatsh({
            type:'changeAddingContact',
            fild: e.target.name,
            payload : e.target.value
        })
    }
    function handlClickFirst() {
        setPriv(1)
        setListOfTheDeletedObejcts([]);
        [...tab.current.children].forEach((ele) => {
            ele.classList.remove('selected')
        })
    }
    function handlClickLast() {
        setPriv(len)
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
    return (
        <div className="userdata">
            <div onClick={(e)=>{
                e.stopPropagation()
            }} ref={passwordReq} className="passwordReq">
                <p>please the enter "{actionDelAdd === 0 ? "delete password" : actionDelAdd === 1 ? "add password" : null}"</p>
                <input ref={passwordReqinput} onClick={(e)=>{
                e.stopPropagation()
            }}  type="password" />
                <i onClick={()=>{passwordReq.current.classList.remove('active')}} ref={iCancalepasswordReq} class="fa-solid fa-xmark"></i>
                <button ref={theImportanteButton} >submit</button>
            </div>
            <div ref={menu} className="moreinfo"> 
                <i onClick={removeActiveMenu} class="icon fa-solid fa-xmark"></i>
                <div className="intro">
                <div>
                <p>patient Information</p>
                <span>local your partient information</span>
                </div>
                <div className="contacts">
                    
                    <div className="showcontacts">
                        {/* <input type="let" />
                        <button className="add">add</button> */}
                        <p>emergency Contact : </p>
                        {/* <div>{valueChageReduce?.emergencyContact?.contact1}</div>
                        <div>{valueChageReduce?.emergencyContact?.contact2}</div>
                        <div>{valueChageReduce?.emergencyContact?.contact3}</div> */}
                        {/* #######################*/}
                        <label htmlFor=""> contact 1 </label>
                        <input name="contact1" type="tel" onChange={handlChangeReducerContact}  value={valueChageReduce?.emergencyContact?.contact1} />
                        <label htmlFor=""> contact 2 </label>
                        <input name="contact2" type="tel" onChange={handlChangeReducerContact}  value={valueChageReduce?.emergencyContact?.contact2} />
                        <label htmlFor=""> contact 3 </label>
                        <input name="contact3" type="tel" onChange={handlChangeReducerContact}  value={valueChageReduce?.emergencyContact?.contact3} />
                        {/* ##################### */}
                    </div>
                </div>
                <button onClick={()=>{
                            passwordReq.current.classList.add('active')
                            setActionDelAdd(1)
                        }} className="addmodfie"> {stateOfModifier === 0 ? "Save Changes":stateOfModifier === 1 ? "Add" : null } </button>
                </div>
                <form action="">
                <label htmlFor=""> patientId </label>
                <input name="patientId" type="number" value={ stateOfModifier === 0 ?  valueChageReduce?.patientId : stateOfModifier === 1 ? info.length : null  } readOnly  />
                <label htmlFor=""> patient Name </label>
                <input name="patientName" type="text" onChange={handlChangeReducer}  value={valueChageReduce?.patientName} />
                <label htmlFor=""> data </label>
                <input name="appointmentDate" type="date" onChange={handlChangeReducer} value={valueChageReduce?.appointmentDate}  />
                <label htmlFor=""> time </label>
                <input name="appointmentTime" type="time" onChange={handlChangeReducer} value={valueChageReduce?.appointmentTime}></input>
                <label htmlFor=""> doctor Name </label>
                <input  name='doctorName' type="text" onChange={handlChangeReducer} value={valueChageReduce?.doctorName} />
                <label htmlFor=""> department </label>
                <input name="department" type="text" onChange={handlChangeReducer} value={valueChageReduce?.department} />
                <label htmlFor=""> treatment </label>
                <input name="treatment" type="text" onChange={handlChangeReducer} value={valueChageReduce?.treatment} />
                <label htmlFor=""> notes </label>
                <input name="notes" type="text" onChange={handlChangeReducer} value={valueChageReduce?.notes} />
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
            <div className="info">
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
                        <th>Patient ID</th>
                        <th>Patient Name</th>
                        <th>Appointment Date</th>
                    </tr>
                    {
                        [...Array(10)].map((ele ,i)=> {
                            let data = showdata[i]
                            if (!data) {
                                return null
                            } else {
                                console.log(data)
                                return (
                                    <tr identifier={showdata[i]?.patientId} >
                                    <td onClick={()=>{
                                    
                                    handShow(data)
                                }}
                                onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }}
                                > {showdata[i]?.patientId } </td>
                                    <td onClick={()=>{
                                    
                                    handShow(data)
                                }}  
                                onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }}
                                > {showdata[i]?.patientName } </td>
                                    <td onClick={()=>{
                                    
                                    handShow(data)
                                }} onContextMenu={(e)=> {
                                    handlRightClickRemove(e)
                                }
                                } > {showdata[i]?.appointmentDate } </td>
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
                        [...Array(len)].map((ele,i)=>{
                            return(<button className={(i+1)===priv ? 'active':null} onClick={()=>{handlClickButtonMove(i+1)}} >{i+1}</button>)
                        })
                    }
                    <button onClick={()=>{handlClickLast()}}>Last page</button>
                </div>
            </div>
        </div>
    );
}
