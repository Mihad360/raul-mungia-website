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

  // NEW
  required?: boolean;
  helpText?: string;
  rows?: number;
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
  required,
  helpText,
  rows = 4,
}: TInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={error ? "error" : ""}
          help={error?.message || helpText}
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
          ) : type === "textarea" ? (
            <Input.TextArea
              {...field}
              id={name}
              disabled={disabled}
              className={className}
              style={style}
              placeholder={placeholder || (label ? `Enter ${label}` : "")}
              readOnly={readOnly}
              rows={rows}
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
