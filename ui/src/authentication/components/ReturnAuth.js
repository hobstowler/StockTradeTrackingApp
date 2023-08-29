import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {tdGetToken} from "../actions";

const ReturnAuth = ({provider}) => {
  const dispatch = useDispatch()
  const code = new URLSearchParams(useLocation().search).get('code')

  if (provider === 'td') {
    dispatch(tdGetToken(code))
  }
}

export default ReturnAuth