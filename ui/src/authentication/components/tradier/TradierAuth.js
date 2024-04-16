import {useEffect} from "react";
import {getAuthUrl} from "../../actions";

const TradierAuth = () => {
  useEffect(() => {
    getAuthUrl().then((url) => {
      window.location.href = url
    })
  }, [])
}

export default TradierAuth