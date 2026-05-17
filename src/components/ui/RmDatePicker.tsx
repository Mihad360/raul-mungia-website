// RmDatePicker.tsx
"use client";

import { DatePicker, Form } from "antd";
import type { CSSProperties } from "react";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

type TDatePickerProps = {
  name: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
  showTime?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
};

const RmDatePicker = ({
  name,
  label,
  style,
  className,
  showTime = false,
  disabled = false,
  placeholder,
  format = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD",
}: TDatePickerProps) => {
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
          <DatePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => field.onChange(date ? date.toDate() : null)}
            size="large"
            showTime={showTime}
            style={{ width: "100%", ...style }}
            className={className}
            placeholder={placeholder || `Select ${label || "date"}`}
            disabled={disabled}
            format={format}
          />
        </Form.Item>
      )}
    />
  );
};

export default RmDatePicker;
