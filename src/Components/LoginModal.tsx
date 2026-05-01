import { Button, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

interface LoginModalProps {
  handleLogin: (username: string, password: string) => void;
}

export const LoginModal = ({ handleLogin }: LoginModalProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div>
      <Stack align="center">
        <TextInput
          label="username"
          value={username}
          onChange={(v) => {
            setUsername(v.currentTarget.value.trim());
          }}
        />
        <TextInput
          label="password"
          value={password}
          onChange={(v) => {
            setPassword(v.currentTarget.value.trim());
          }}
        />
        <Button onClick={() => handleLogin(username, password)}>Login</Button>
      </Stack>
    </div>
  );
};
