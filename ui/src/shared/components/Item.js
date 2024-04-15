import {useEffect, useState} from "react";
import {Box} from "@mui/system";

const Item = (props) => {
  const {starttext = '', endtext = '', item, width = 1, currency = true} = props
  const [text, setText] = useState('')

  useEffect(() => {
    if (item === undefined || item === null) {
      setText('null')
      return
    }

    let newText = currency ?
      item.toLocaleString("en-US", {style:"currency", currency:"USD"})
      : item.toLocaleString()

    setText(`${starttext}${newText}${endtext}`)
  }, [item])
  return (
    <Box {...props} item xs={width}>{text}</Box>
  )
}

export default Item