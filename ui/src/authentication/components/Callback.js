import {useParams} from "react-router-dom";
import RegisterForm from "./RegisterForm";
import {Container} from "@mui/system";

const Callback = () => {
  const { data } = useParams()
  console.log(data)

  return (
    <Container sx={{mt: '100px'}}>
      <RegisterForm initialData={data} />
    </Container>
  )
}

export default Callback;