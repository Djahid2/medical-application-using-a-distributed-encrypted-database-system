import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";

export const getdata = createAsyncThunk("getdata",async()=>{
    try {
        const req = await fetch("http://localhost:3009/Data")
        const data = await req.json()
        return data
    } catch(e) {
        console.log(e)
    }
})
export const putdata = createAsyncThunk("putdata",async(args)=>{
    try {
        args["id"] = args.patientId
        const req = fetch("http://localhost:3009/Data",{
            method: "POST",
            body: JSON.stringify(args),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        
        return args
        
    } catch(e) {
        console.log(e)
    }
})
export const changedata = createAsyncThunk("changedata",async(args)=>{
    try {
        const req = fetch(`http://localhost:3009/Data/${args.patientId}`,{
            method: "PUT",
            body: JSON.stringify(args),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        
        return args
        
    } catch(e) {
        console.log(e)
    }
})
const alldata = createSlice({
    name : "data",
    initialState : {dataredux : [] },
    extraReducers :(builder) => {
        builder
            .addCase(getdata.fulfilled , (state , action)=>{
                state.dataredux = (action.payload)
                // console.log(state)
                // state.articles.length = 10
            }) 
            .addCase(putdata.fulfilled , (state , action)=>{
                console.log(action.payload)
                state.dataredux.push(action.payload)
                // console.log(state)
                // state.articles.length = 10
            }) 
            .addCase(changedata.fulfilled , (state , action)=>{
                console.log(action.payload)
                state.dataredux = state.dataredux.map((ele)=>{
                    if (ele.patientId === action.payload.patientId) {
                        console.log("done")
                        return action.payload
                    }
                    return ele
                })
            }) 
    }
})

export default alldata.reducer