import {useEffect, useState} from "react";
import {Grid} from "@mui/material";

const Item = (props) => {
  const {starttext = '', endtext = '', item, width = 1, currency = true} = props
  const [text, setText] = useState('')

  useEffect(() => {
    if (item === undefined || item === null) {
      setText('null')
      return
    }

    let newText = ''
    if (currency) {
      newText = item.toLocaleString("en-US", {style:"currency", currency:"USD"})
    } else {
      newText = item.toLocaleString()
    }

    setText(`${starttext}${newText}${endtext}`)
  }, [item])
  return (
    <Grid {...props} item xs={width}>{text}</Grid>
  )
}

export default Item