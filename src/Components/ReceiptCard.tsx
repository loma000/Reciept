import {
  ActionIcon,
  Box,
  Card,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import type { ReceiptData } from "../Props/types";
import { useState } from "react";
import {
  IconPrinter,
  IconEdit,
  IconUser,
  IconCalendar,IconX
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { FormModal } from "./FormModal";
import PDFLoader from "./PDFLoaderPage";
import { useFormStore } from "../Store/FormStore";
 
interface ReceiptCardProps {
  payment: ReceiptData;
  handleEdit:(form:ReceiptData)=>void;
  handleDelete:(id:number)=>void;
}

export const ReceiptCard = ({ payment , handleEdit,handleDelete }: ReceiptCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [openedLoader, { open: openLoader, close: closeLoader }] =
    useDisclosure(false);
const setform = useFormStore((s)=>s.setData);
  return (
    <div>
      <Modal opened={openedForm} onClose={closeForm}>
      <FormModal onClose={closeForm} handleSave={handleEdit}></FormModal>
      </Modal>
      <Modal opened={openedLoader} onClose={closeLoader}>
        <PDFLoader Data={payment}></PDFLoader>
      </Modal>
      <Card
        radius="xl"
        px="xl"
        py="md"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
            : "linear-gradient(135deg, #f1f3f5 0%, #e9ecef 100%)",
          border: "1.5px solid",
          borderColor: hovered ? "#adb5bd" : "#dee2e6",
          transition: "all 0.25s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.10)"
            : "0 2px 8px rgba(0,0,0,0.05)",
          cursor: "default",
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          {/* ชื่อผู้จ่าย */}
          <Group gap="xs" style={{ minWidth: 160 }}>
            <Box
              style={{
                background: "#343a40",
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconUser size={16} color="#fff" />
            </Box>
            <Stack gap={0}>
              <Text
                size="xs"
                c="dimmed"
                fw={500}
                style={{ letterSpacing: "0.04em" }}
              >
                ชื่อ ผู้จ่าย
              </Text>
              <Text
                fw={700}
                size="sm"
                c="dark.8"
                style={{ fontFamily: "'Sarabun', sans-serif" }}
              >
                {payment.name}
              </Text>
            </Stack>
          </Group>

          <Divider orientation="vertical" style={{ height: 40 }} />

          {/* วันที่ */}
          <Group gap="xs" style={{ flex: 1 }}>
            <Box
              style={{
                background: "#1971c2",
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconCalendar size={16} color="#fff" />
            </Box>
            <Stack gap={0}>
              <Text
                size="xs"
                c="dimmed"
                fw={500}
                style={{ letterSpacing: "0.04em" }}
              >
                วันที่
              </Text>
              <Text fw={600} size="sm" c="dark.7">
                {payment.date}
              </Text>
            </Stack>
          </Group>

          {/* Actions */}
          <Group gap="xs" ml="md">
            <Tooltip label="พิมพ์" withArrow position="top">
              <ActionIcon
                onClick={openLoader}
                variant="filled"
                color="dark"
                size="lg"
                radius="xl"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <IconPrinter size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="แก้ไข" withArrow position="top">
              <ActionIcon
                onClick={()=>{ setform(payment); openForm();}}
                variant="filled"
                color="gray"
                size="lg"
                radius="xl"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="ลบ" withArrow position="top">
              <ActionIcon
                onClick={()=>{ handleDelete(payment.id??-1)}}
                variant="filled"
                color="darkred"
                size="lg"
                radius="xl"
                style={{
                  boxShadow: "0 2px 6px rgba(255, 4, 4, 0.12)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <IconX size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card>
    </div>
  );
};
