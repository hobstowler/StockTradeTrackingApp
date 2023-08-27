import {useSelector} from "react-redux";

const AccountSelector = () => {
  const account = useSelector(({account}) => account)
}

export default AccountSelector;