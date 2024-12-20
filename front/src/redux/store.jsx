import { configureStore } from "@reduxjs/toolkit";
import thedata from "./slices/thedata"
const store = configureStore({
    reducer: {
        thedata
    }
})
export default store ;