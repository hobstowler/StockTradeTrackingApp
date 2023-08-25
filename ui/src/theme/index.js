import * as components from './components/index'
import {createTheme} from "@mui/material";

console.log({...components})

export const theme = createTheme({
    components: {...components}
})