import { useState } from "react";
import { ReceiptCard } from "./Components/ReceiptCard";
import { testData } from "./TestData";
import type { ReceiptData } from "./Props/Data";
import { useDisclosure } from "@mantine/hooks";
import { Box, Button, Modal, Stack, Text } from "@mantine/core";
import { FormModal } from "./Components/FormModal";
import { useFormStore } from "./State/FormState";

export const ReceiptListPage = () => {
  const resetStoreData = useFormStore((s) => s.resetData);
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [data, setData] = useState<ReceiptData[]>(testData);
  const handleAdd = (form: ReceiptData) => {
    form.id = Date.now();
    setData((prev) => [...prev, form]);
  };

  const handleEdit = (form: ReceiptData) => {
    if (data.findIndex((data: any) => data.id === form.id) === -1) {
      return;
    }
    setData((prev) =>
      prev.map((v: any) => (v.id === form.id ? { ...v, ...form } : v)),
    );
  };

  const handleDelete = (id: number) => {
    if (data.findIndex((data: any) => data.id === id) === -1) {
      return;
    }
    setData((prev) => prev.filter((v) => v.id !== id));
  };
  return (
    <div>
      <Modal opened={openedForm} onClose={closeForm}>
        <FormModal onClose={closeForm} handleSave={handleAdd}></FormModal>
      </Modal>
      <Box mx={"auto"} maw={700}>
        {" "}
        <Stack justify="center" gap="md">
          <Text size="xl" mx={"auto"}>
            Receipt
          </Text>
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
      <Button
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
      >
        add
      </Button>
    </div>
  );
};
