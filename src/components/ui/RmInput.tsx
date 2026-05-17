// RmInput.tsx
"use client";

import { Form, Input } from "antd";
import type { CSSProperties } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  size?: "large" | "middle" | "small";
  className?: string;
  style?: CSSProperties;
  readOnly?: boolean;
  allowClear?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onPressEnter?: (e: React.KeyboardEvent) => void;
};

const RmInput = ({
  name,
  label,
  type = "text",
  disabled = false,
  placeholder,
  size = "large",
  className,
  style,
  readOnly = false,
  allowClear = false,
  prefix,
  suffix,
  onPressEnter,
}: TInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
          className={!label ? "mb-0!" : "mb-4"}
        >
          {type === "password" ? (
            <Input.Password
              {...field}
              id={name}
              disabled={disabled}
              size={size}
              className={className}
              style={style}
              placeholder={placeholder || (label ? `Enter ${label}` : "")}
              readOnly={readOnly}
            />
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              readOnly={readOnly}
              disabled={disabled}
              size={size}
              className={className}
              style={style}
              placeholder={placeholder || (label ? `Enter ${label}` : "")}
              allowClear={allowClear}
              prefix={prefix}
              suffix={suffix}
              onPressEnter={onPressEnter}
            />
          )}
        </Form.Item>
      )}
    />
  );
};

export default RmInput;
