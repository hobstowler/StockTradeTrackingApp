import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {tdGetToken} from "../actions";
import {useEffect} from "react";

const ReturnAuth = ({provider}) => {
  const dispatch = useDispatch()
  const code = new URLSearchParams(useLocation().search).get('code')

  console.log(`ok ${provider}`)
  useEffect(() => {
    if (provider === 'td') {
      dispatch(tdGetToken(code))
    }
  }, [])
}

export default ReturnAuth