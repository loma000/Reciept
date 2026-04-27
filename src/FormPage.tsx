import {
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { DatePickerInput } from "@mantine/dates";
import { useFormStore } from "./State/FormState";
import dayjs from "dayjs";
import { THAI_MONTHS_FULL } from "./Props/Data";

export const Form = () => {
  const navigate = useNavigate();
  const form = useFormStore((s) => s.Form);
  const setForm = useFormStore((s) => s.setData);
  const setItems = useFormStore((s) => s.setItems);
  const resetData = useFormStore((s) => s.resetData);
  const handleChange = (parameter: string, data: string) => {
    setForm({ [parameter]: data?.trim() });
  };
  const handleItemsChange = (parameter: string, data: number | null) => {
    const realData = data ?? 0;
    if (realData <= 0) {
      setItems({ [parameter]: { checked: false, amount: "" } });
    } else {
      setItems({ [parameter]: { checked: true, amount: String(realData) } });
    }
  };

  const handleDateInput = (value: string | null) => {
    if (!value) return handleChange("date", "");

    const [year, month, day] = value.split("-");
    const buddhistYear = Number(year) + 543;
    const thaiYear = THAI_MONTHS_FULL[Number(month) - 1];
    handleChange("date", `${day}/${month}/${buddhistYear}`);
    handleChange("month", `${thaiYear} ${buddhistYear}`);
  };

  const handleCalculate = () => {
    const waterPrice =
      (Number(form.waterMeterCurr) - Number(form.waterMeterPrev)) *
      Number(form.waterMeterUsed);
    const eletricPrice =
      (Number(form.electricMeterCurr) - Number(form.electricMeterPrev)) *
      Number(form.electricMeterUsed);
    handleItemsChange("water", waterPrice);
    handleItemsChange("electric", eletricPrice);
  };
  return (
    <div>
      <Stack align="center">
        <Text size="xl">Reciept</Text>
        <Group>
          <TextInput
            label="ชื่อ นามสกุล"
            placeholder="ชื่อ สกุล"
            value={form.name}
            onChange={(v) => handleChange("name", v.currentTarget.value??"")}
          />
          <TextInput
            label="ที่อยู่"
            placeholder="ที่อยู่"
            value={form.address}
            onChange={(v) => handleChange("address", v.currentTarget.value??"")}
          />
          <TextInput
            label="เบอร์"
            placeholder="เบอร์"
            value={form.tel}
            onChange={(v) => handleChange("tel", v.currentTarget.value??"")}
          />
        </Group>

        <DatePickerInput
          label="Pick date"
          placeholder="Pick date"
          defaultValue={dayjs().format("YYYY-MM-DD")}
          onChange={handleDateInput}
        />
        <NumberInput
          min={0}
          label="ค่าเช่า"
          placeholder="ค่าเช่า"
          value={Number(form.items?.rent?.amount) || 0}
          onChange={(v) => handleItemsChange("rent", Number(v))}
        />
        <Text>ค่าน้ำประปา</Text>
        <Group>
          <NumberInput
            min={0}
            label="ก่อนจด"
            placeholder="ก่อนจด"
            value={form.waterMeterPrev || 0}
            onChange={(v) => handleChange("waterMeterPrev", String(v))}
          />
          <NumberInput
            min={0}
            label="หลังจด"
            placeholder="หลังจด"
            value={form.waterMeterCurr || 0}
            onChange={(v) => handleChange("waterMeterCurr", String(v))}
          />
          <NumberInput
            min={0}
            label="หน่วย"
            placeholder="หน่วย"
            value={form.waterMeterUsed || 0}
            onChange={(v) => handleChange("waterMeterUsed", String(v))}
          />
        </Group>
        <Text>ค่าไฟฟ้า</Text>
        <Group>
          <NumberInput
            min={0}
            label="ก่อนจด"
            placeholder="ก่อนจด"
            value={form.electricMeterPrev || 0}
            onChange={(v) => handleChange("electricMeterPrev", String(v))}
          />
          <NumberInput
            min={0}
            label="หลังจด"
            placeholder="หลังจด"
            value={form.electricMeterCurr || 0}
            onChange={(v) => handleChange("electricMeterCurr", String(v))}
          />
          <NumberInput
            min={0}
            label="หน่วย"
            placeholder="หน่วย"
            value={form.electricMeterUsed || 0}
            onChange={(v) => handleChange("electricMeterUsed", String(v))}
          />
        </Group>
        <NumberInput
          min={0}
          label="อินเตอรเน็ต"
          placeholder="อินเตอรเน็ต"
          value={Number(form.items?.internet?.amount) || 0}
          onChange={(v) => handleItemsChange("internet", Number(v))}
        />
        <NumberInput
          min={0}
          label="ค่าปรับ"
          placeholder="ค่าปรับ"
          value={Number(form.items?.fee?.amount) || 0}
          onChange={(v) => handleItemsChange("fee", Number(v))}
        />
        <NumberInput
          min={0}
          label="อื่นๆ"
          placeholder="อื่นๆ"
          value={Number(form.items?.other?.amount) || 0}
          onChange={(v) => handleItemsChange("other", Number(v))}
        />
        <Text>ช่องทางการชำระเงิน</Text>
        <Group>
          <TextInput
            label="ธนาคาร"
            placeholder="ธนาคาร"
            value={form.bankName}
            onChange={(v) => handleChange("bankName", v.currentTarget.value??"")}
          />
          <TextInput
            label="ชื่อบัญชี"
            placeholder="ชื่อบัญชี"
            value={form.accountName}
            onChange={(v) => handleChange("accountName", v.currentTarget.value??"")}
          />
          <TextInput
            label="เลขบัญชี"
            placeholder="เลขบัญชี"
            value={form.accountNumber}
            onChange={(v) =>
              handleChange("accountNumber", v.currentTarget.value??"")
            }
          />
        </Group>

        <TextInput
          label="ผุ้รับเงิน"
          placeholder="ผู้รับเงิน"
          value={form.Receiver}
          onChange={(v) => handleChange("Receiver", v.currentTarget.value??"")}
        />

        <Group>
          <Button
            onClick={() => {
              handleCalculate();
              navigate("/PDF");
            }}
          >
            Create
          </Button>
          <Button onClick={() => resetData()}>Reset</Button>
        </Group>
      </Stack>
    </div>
  );
};
