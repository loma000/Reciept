import { Button, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LoginModal } from "./Components/LoginModal";
import { SignUpModal } from "./Components/SignUpModal";
import { api } from "./api/api";
import { userStore } from "./Store/UserStore";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [openedLogin, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [openedSignUp, { open: openSignUp, close: closeSignUp }] =
    useDisclosure(false);
    const navigate = useNavigate();
  const setUser = userStore((s) => s.setUser);
  const HandleSignUp = async (username: string, password: string) => {
    setUser({ username: username });
    const Id = await api.signUp(username, password);
    if (Id) {
      setUser({ id: Id });
      navigate("/ReceiptList")
    } 
  };
   const HandleLogin = async (username: string, password: string) => {
    setUser({ username: username });
    const Id = await api.login(username, password);
    if (Id) {
      setUser({ id: Id });
      navigate("/ReceiptList")
    }
  };

  return (
    <div>
      <Modal opened={openedLogin} onClose={closeLogin}>
        <LoginModal handleLogin={HandleLogin}/>
      </Modal>
      <Modal opened={openedSignUp} onClose={closeSignUp}>
        <SignUpModal handleSignUp={HandleSignUp} />
      </Modal>
      <Stack align="center" justify="center" h={300}>
        <Button onClick={openLogin}>Login</Button>
        <Button onClick={openSignUp}>SignUp</Button>
      </Stack>
    </div>
  );
};
