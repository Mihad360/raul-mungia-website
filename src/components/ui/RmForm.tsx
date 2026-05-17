// RmForm.tsx
"use client";

import { useEffect, useCallback } from "react";
import { Form, ConfigProvider } from "antd";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type Resolver,
  type DefaultValues,
} from "react-hook-form";

type TFormConfig<T extends FieldValues = FieldValues> = {
  defaultValues?: DefaultValues<T>;
  resolver?: Resolver<T>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
};

type TFormProps<T extends FieldValues = FieldValues> = {
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
} & TFormConfig<T>;

const RmForm = <T extends FieldValues = FieldValues>({
  onSubmit,
  children,
  resolver,
  defaultValues,
  mode = "onSubmit",
  className,
}: TFormProps<T>) => {
  const methods = useForm<T>({
    resolver,
    defaultValues,
    mode,
  });

  const { reset } = methods;

  const resetForm = useCallback(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSubmit = methods.handleSubmit(
    onSubmit as SubmitHandler<FieldValues>,
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#C70A24",
          colorPrimaryHover: "#a3081e",
          colorPrimaryActive: "#9e071c",
        },
        components: {
          Form: {
            itemMarginBottom: 0,
          },
          Input: {
            activeBorderColor: "#C70A24",
            hoverBorderColor: "#a3081e",
          },
          Select: {
            activeBorderColor: "#C70A24",
            hoverBorderColor: "#a3081e",
          },
          DatePicker: {
            activeBorderColor: "#C70A24",
            hoverBorderColor: "#a3081e",
          },
        },
      }}
    >
      <FormProvider {...methods}>
        <Form layout="vertical" onFinish={handleSubmit} className={className}>
          {children}
        </Form>
      </FormProvider>
    </ConfigProvider>
  );
};

export default RmForm;
