interface FormModalProps {
  handleSave: (form: ReceiptData) => void;
  onClose:()=>void;
}


import {
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Paper,
  Divider,
  Grid,
} from "@mantine/core";

import { DatePickerInput } from "@mantine/dates";
import { useFormStore } from "../Store/FormStore";
import dayjs from "dayjs";
import { THAI_MONTHS_FULL, type ReceiptData } from "../Props/types";

export const FormModal = ({ handleSave, onClose }: FormModalProps) => {
  const Form = useFormStore((s) => s.Form);
  const setForm = useFormStore((s) => s.setData);
   
  const resetData = useFormStore((s) => s.resetData);

  const handleChange = (parameter: string, data: string) => {
    setForm({ [parameter]: data?.trim() });
  };

  

  const handleDateInput = (value: string | null) => {
    if (!value) return handleChange("date", "");
    handleChange("dateRealFormat", value);
  };

  const handleCalculate = () => {
    const waterPrice =
      (Number(Form.waterMeterCurr) - Number(Form.waterMeterPrev)) *
      Number(Form.waterMeterUsed);

    const eletricPrice =
      (Number(Form.electricMeterCurr) - Number(Form.electricMeterPrev)) *
      Number(Form.electricMeterUsed);

    const date =
      Form.dateRealFormat === ""
        ? dayjs().format("YYYY-MM-DD")
        : Form.dateRealFormat ?? "";

    const [year, month, day] = date.split("-");
    const buddhistYear = Number(year) + 543;
    const thaiYear = THAI_MONTHS_FULL[Number(month) - 1];

    const finalData: ReceiptData = {
      ...Form,
      
      waterChecked: waterPrice > 0,waterAmount:String(waterPrice),electricChecked:eletricPrice > 0,electricAmount:String(eletricPrice),
      date: `${day}/${month}/${buddhistYear}`,
      month: `${thaiYear} ${buddhistYear}`,
    };

    handleSave(finalData);
  };

  return (
    <Paper shadow="md" radius="lg" p="lg">
      <Stack>
        <Text size="xl" fw={700} ta="center">
          Receipt Form
        </Text>

        <Divider label="ข้อมูลผู้เช่า" />

        <Grid>
          <Grid.Col span={4}>
            <TextInput
              label="ชื่อ-นามสกุล"
              value={Form.name}
              onChange={(v) =>
                handleChange("name", v.currentTarget.value ?? "")
              }
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              label="เบอร์โทร"
              value={Form.tel}
              onChange={(v) =>
                handleChange("tel", v.currentTarget.value ?? "")
              }
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <DatePickerInput
              label="วันที่"
              defaultValue={dayjs().format("YYYY-MM-DD")}
              onChange={handleDateInput}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              label="ที่อยู่"
              value={Form.address}
              onChange={(v) =>
                handleChange("address", v.currentTarget.value ?? "")
              }
            />
          </Grid.Col>
        </Grid>

        <Divider label="ค่าใช้จ่าย" />

        <NumberInput
          label="ค่าเช่า"
          value={Number(Form. rentAmount) || 0}
          onChange={(v) => handleChange("rentAmount", String(v))}
        />

        <Text fw={500}>ค่าน้ำ</Text>
        <Grid>
          <Grid.Col span={4}>
            <NumberInput
              label="ก่อน"
              value={Form.waterMeterPrev || 0}
              onChange={(v) => handleChange("waterMeterPrev", String(v))}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="หลัง"
              value={Form.waterMeterCurr || 0}
              onChange={(v) => handleChange("waterMeterCurr", String(v))}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="หน่วย"
              value={Form.waterMeterUsed || 0}
              onChange={(v) => handleChange("waterMeterUsed", String(v))}
            />
          </Grid.Col>
        </Grid>

        <Text fw={500}>ค่าไฟ</Text>
        <Grid>
          <Grid.Col span={4}>
            <NumberInput
              label="ก่อน"
              value={Form.electricMeterPrev || 0}
              onChange={(v) => handleChange("electricMeterPrev", String(v))}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="หลัง"
              value={Form.electricMeterCurr || 0}
              onChange={(v) => handleChange("electricMeterCurr", String(v))}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="หน่วย"
              value={Form.electricMeterUsed || 0}
              onChange={(v) => handleChange("electricMeterUsed", String(v))}
            />
          </Grid.Col>
        </Grid>

        <Divider label="อื่นๆ" />

        <Grid>
          <Grid.Col span={4}>
            <NumberInput
              label="อินเทอร์เน็ต"
              value={Number(Form.internetAmount) || 0}
              onChange={(v) => handleChange("internetAmount", String(v))}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="ค่าปรับ"
              value={Number(Form.feeAmount) || 0}
              onChange={(v) => handleChange("feeAmount", String(v))}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="อื่นๆ"
              value={Number(Form.otherAmount) || 0}
              onChange={(v) => handleChange("otherAmount", String(v))}
            />
          </Grid.Col>
        </Grid>

        <Divider label="ช่องทางชำระเงิน" />

        <Grid>
          <Grid.Col span={4}>
            <TextInput
              label="ธนาคาร"
              value={Form.bankName}
              onChange={(v) =>
                handleChange("bankName", v.currentTarget.value ?? "")
              }
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="ชื่อบัญชี"
              value={Form.accountName}
              onChange={(v) =>
                handleChange("accountName", v.currentTarget.value ?? "")
              }
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="เลขบัญชี"
              value={Form.accountNumber}
              onChange={(v) =>
                handleChange("accountNumber", v.currentTarget.value ?? "")
              }
            />
          </Grid.Col>
        </Grid>

        <TextInput
          label="ผู้รับเงิน"
          value={Form.receiver}
          onChange={(v) =>
            handleChange("receiver", v.currentTarget.value ?? "")
          }
        />

        <Group justify="flex-end" mt="md">
          <Button
            onClick={() => {
              handleCalculate();
              onClose();
            }}
          >
            Save
          </Button>
          <Button variant="outline" onClick={() => resetData()}>
            Reset
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};