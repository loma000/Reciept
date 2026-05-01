import { useEffect, useState } from "react";
import { ReceiptCard } from "./Components/ReceiptCard";

import type { ReceiptData } from "./Props/types";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Box,
  Burger,
  Grid,
  Group,
  Modal,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { FormModal } from "./Components/FormModal";
import { useFormStore } from "./Store/FormStore";
import { useFormListStore } from "./Store/FormListStore";
import { api } from "./api/api";
import { userStore } from "./Store/UserStore";
import { useNavigate } from "react-router-dom";
import { IconPlusFilled, IconLogout } from "@tabler/icons-react";
export const ReceiptListPage = () => {
  const navigate = useNavigate();
  const resetStoreData = useFormStore((s) => s.resetData);
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
 // const forms = useFormListStore((s) => s.forms);
  const setForms = useFormListStore((s) => s.setForms);
  const [data, setData] = useState<ReceiptData[]>([]);
  const user = userStore((s) => s.user);
  const clearUser = userStore((s) => s.clearUser);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const Receipts = await api.fetchReceipt(Number(user.id));
    setData(Receipts);
    setForms(Receipts);
  };
  const handleAdd = async (receipt: ReceiptData) => {
    const addForm = await api.addReceipt(Number(user.id), receipt);
    if (addForm) {
      fetchData();
    }
  };

  const handleEdit = async (receipt: ReceiptData) => {
    const editForm = await api.editReceipt(Number(user.id), receipt);
    if (editForm) {
      fetchData();
    }
  };

  const handleDelete = async (receiptId: number) => {
    const del = await api.deleteReceipt(Number(user.id), receiptId);
    if (del) {
      fetchData();
    }
  };

  const handleLogOut = () => {
    clearUser();
    navigate("/");
  };
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <Modal opened={openedForm} onClose={closeForm}>
        <FormModal onClose={closeForm} handleSave={handleAdd}></FormModal>
      </Modal>{" "}
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Text size="xl" mx={"auto"}>
            Receipt
          </Text>
        </Group>
      </AppShellHeader>
      <AppShellMain>
        <Box mx={"auto"} maw={700}>
          <Stack justify="center" gap="md">
            {data.map((a: any) => (
              <ReceiptCard
                key={a.id}
                payment={a}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              ></ReceiptCard>
            ))}
          </Stack>
        </Box>{" "}
        <ActionIcon
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 100,
          }}
          onClick={() => {
            resetStoreData();
            openForm();
          }}
          size={"xl"}
          radius={"xl"}
        >
          <IconPlusFilled   />
        </ActionIcon>
      </AppShellMain>
      <AppShellNavbar>
        <Stack align="center" gap="md" h="100%">
          <Box mt="auto">
            <Grid>
              <Text>Username : {user.username}</Text>

              <ActionIcon onClick={handleLogOut}>
                <IconLogout />
              </ActionIcon>
            </Grid>{" "}
            <Space h="md"></Space>
          </Box>
        </Stack>
      </AppShellNavbar>
    </AppShell>
  );
};
