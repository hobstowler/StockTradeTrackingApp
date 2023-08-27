import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {tdReturnAuth} from "../actions";

const ReturnAuth = ({provider}) => {
  const dispatch = useDispatch()
  const code = new URLSearchParams(useLocation().search).get('code')

  if (provider === 'td') {
    dispatch(tdReturnAuth(code))
  }
}

export default ReturnAuth