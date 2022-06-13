import {BsFillGearFill} from 'react-icons/bs'
import {Link} from "react-router-dom";

export default function AccountIcon() {
    return(
        <Link to='/account'><BsFillGearFill /></Link>
    )
}