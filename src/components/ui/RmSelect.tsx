// RmSelect.tsx
"use client";

import { Form, Select } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type TRmSelect = {
  options: TSelectOption[];
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  allowClear?: boolean;
  mode?: "multiple" | "tags";
  loading?: boolean;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
};

const RmSelect = ({
  options,
  name,
  label,
  disabled,
  placeholder,
  icon,
  className,
  style,
  allowClear = true,
  mode,
  loading = false,
  showSearch = false,
  onSearch,
}: TRmSelect) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={
            label ? (
              <span className="flex gap-2 items-center font-medium text-sm">
                {icon}
                {label}
              </span>
            ) : undefined
          }
          validateStatus={error ? "error" : ""}
          help={error?.message}
          className={!label ? "mb-0!" : "mb-4"}
        >
          <Select
            {...field}
            disabled={disabled}
            placeholder={placeholder || `Select ${label || "option"}`}
            options={options}
            allowClear={allowClear}
            mode={mode}
            className={className}
            style={style}
            size="large"
            loading={loading}
            showSearch={showSearch}
            onSearch={onSearch}
            filterOption={
              showSearch
                ? (input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                : undefined
            }
          />
        </Form.Item>
      )}
    />
  );
};

export default RmSelect;
