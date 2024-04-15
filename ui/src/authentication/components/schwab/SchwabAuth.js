import {useEffect} from "react";
import {getAuthUrl} from "../../actions";

const SchwabAuth = () => {
  useEffect(() => {
    getAuthUrl().then((url) => {
      window.location.href = url
    })
  }, [])
}

export default SchwabAuth