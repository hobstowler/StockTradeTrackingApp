import {Box, Container} from "@mui/system";
import {useSelector} from "react-redux";

const Index = () => {
  const activePage = useSelector(({application}) => application.page)

  return (
    <Box role='tabpanel' hidden={activePage !== 'Insights'} className='insightsTab'></Box>
  )
}

export default Index;