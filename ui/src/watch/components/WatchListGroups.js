import AppBar from '@mui/material/AppBar';
import {Box, useTheme} from "@mui/system";
import {Button, Card, CircularProgress, IconButton, InputAdornment, Tab, Tabs, TextField} from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import WatchListCard from "./WatchListCard";
import {refreshActiveWatchList, setActiveGroup} from "../../stock/actions";

const WatchListGroups = (stocks = true) => {
  const [tabGroupValue, setTabGroupValue] = useState(false)
  const [tabSymbolValue, setTabSymbolValue] = useState(false)
  const [newGroup, setNewGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const {groups: watchGroups, loaded, activeGroup} = useSelector(({stock}) => stock.watchList)

  const theme = useTheme()
  const dispatch = useDispatch()

  useEffect(() => {setNewGroupName('')}, [newGroup])

  useEffect(() => {
    if (tabGroupValue === false) return
    dispatch(setActiveGroup(tabGroupValue))

    if (tabGroupValue >= 0) {
      dispatch(refreshActiveWatchList(tabGroupValue))
    }
  }, [tabGroupValue])

  const handleChange = (e, val) => {
    setTabGroupValue(val)
    setTabSymbolValue(false)
  }

  const handleNewGroup = () => {}

  return (
    <Card sx={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0, minWidth: '680px', maxWidth: '680px'}}>
      <AppBar
        position='relative'
        sx={{
          pt: '12px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.success.main
        }}
      >
        <Tabs
          value={tabGroupValue}
          onChange={handleChange}
          textColor='white'
          TabIndicatorProps={{style: {background: 'white'}}}
          sx={{fontWeight: 600}}
        >
          {watchGroups.map((group) => {
            return (
              <Tab sx={{fontWeight: 600}} label={group?.name} />
            )
          })}
        </Tabs>
        {newGroup ?
          (
            <TextField
              size='small'
              sx={{mx: '12px', mt: '-12px', input: {color: 'white'}}}
              variant='standard'
              label={`Group Name ${newGroupName.length > 0 ? '(' + newGroupName.length + "/20)" : ''}`}
              inputProps={{maxLength: 20, style: {borderBottom: '1px solid white'}}}
              InputLabelProps={{style: {color: 'white'}}}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <>
                    <InputAdornment position='end'>
                      <IconButton>
                        <CheckOutlinedIcon sx={{color: 'darkgreen'}} />
                      </IconButton>
                      <IconButton onClick={() => {setNewGroup(false)}}>
                        <CloseOutlinedIcon sx={{color: 'darkred'}} />
                      </IconButton>
                    </InputAdornment>
                  </>
                )
              }}
              value={newGroupName}
              onChange={(e) => {setNewGroupName(e.target.value)}}
            />
          ) :
          <Button
            sx={{ml: '12px', color: 'white', fontWeight: 600}}
            onClick={() => {setNewGroup(true)}}
            label='New Group' iconPosition='end'
          >
            Add Group
            <AddCircleOutlineOutlinedIcon sx={{ml: '8px'}} />
          </Button>}
      </AppBar>
      <Box>
        <Tabs value={tabSymbolValue} onChange={(e, val) => {setTabSymbolValue(val)}}>
          {
            !loaded && activeGroup !== undefined ?
            <Box sx={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: '87px', pb: '24px'}}><CircularProgress /></Box> :
            <WatchListCard activeGroup={watchGroups?.[tabGroupValue]} />
          }
        </Tabs>
      </Box>
    </Card>
  )
}

export default WatchListGroups