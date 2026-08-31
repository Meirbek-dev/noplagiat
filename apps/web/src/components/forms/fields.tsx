import type { ReactNode } from "react"

import { Checkbox } from "@/components/checkbox"
import { Input } from "@/components/input"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import { Textarea } from "@/components/textarea"

/**
 * Presentational field wrappers for the TanStack Form + Valibot forms of the
 * admin area.
 *
 * They take plain values rather than a `FieldApi`, so a form renders as
 * `<form.Field name="x">{(field) => <LabeledInput … />}</form.Field>` and the
 * field's own types stay intact - no `any`, and no generic gymnastics to keep
 * one component compatible with every field shape.
 */

export interface FieldShellProps {
  id: string
  label: string
  description?: string
  errors: readonly unknown[]
  children: ReactNode
  className?: string
}

function FieldShell({
  id,
  label,
  description,
  errors,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={className ?? "flex flex-col gap-1"}>
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      {children}
      {description === undefined ? null : (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
      <FieldErrors errors={errors} />
    </div>
  )
}

/**
 * A submit button standing in a row of fields.
 *
 * The admin forms lay their fields out in a grid. Aligning that grid to the
 * bottom looks right only while every cell is the same height - and it never
 * is, because only some fields carry a hint, and a hint that wraps to two
 * lines is taller than one that does not. The «Источники данных» row showed
 * its three labels at three different heights for exactly that reason.
 *
 * So the grids align to the *top*, where the labels are, and the button
 * reserves an empty label line to land on the control row with them.
 */
export function FieldAction({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        aria-hidden="true"
        className="hidden text-sm font-medium @2xl:block"
      >
        &nbsp;
      </span>
      {children}
    </div>
  )
}

/**
 * Valibot issues reach the form as `unknown`; only the strings and the
 * `{ message }` shapes are renderable, and anything else is dropped rather
 * than stringified into `[object Object]`.
 */
export function FieldErrors({ errors }: { errors: readonly unknown[] }) {
  const messages = errors.flatMap((error) =>
    typeof error === "string"
      ? [error]
      : error !== null &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        ? [error.message]
        : []
  )
  if (messages.length === 0) return null
  return (
    <span role="alert" className="text-xs text-destructive">
      {messages.join(" ")}
    </span>
  )
}

export interface LabeledInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  errors: readonly unknown[]
  description?: string
  placeholder?: string
  type?: "text" | "date" | "number" | "email"
  className?: string
  inputClassName?: string
}

export function LabeledInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  errors,
  description,
  placeholder,
  type = "text",
  className,
  inputClassName,
}: LabeledInputProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      description={description}
      errors={errors}
      className={className}
    >
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
        onBlur={onBlur}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
    </FieldShell>
  )
}

export interface SelectOption {
  value: string
  label: string
}

export interface LabeledSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  errors: readonly unknown[]
  description?: string
  /** Rendered as the first, empty option when present. */
  placeholder?: string
  className?: string
  selectClassName?: string
}

export function LabeledSelect({
  id,
  label,
  value,
  onChange,
  options,
  errors,
  description,
  placeholder,
  className,
  selectClassName,
}: LabeledSelectProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      description={description}
      errors={errors}
      className={className}
    >
      <NativeSelect
        id={id}
        name={id}
        value={value}
        className={selectClassName}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      >
        {placeholder === undefined ? null : (
          <NativeSelectOption value="">{placeholder}</NativeSelectOption>
        )}
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </FieldShell>
  )
}

export interface LabeledCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  errors: readonly unknown[]
  description?: string
}

export function LabeledCheckbox({
  id,
  label,
  checked,
  onChange,
  errors,
  description,
}: LabeledCheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          name={id}
          checked={checked}
          onCheckedChange={(next) => {
            onChange(next === true)
          }}
        />
        <label className="text-sm font-medium" htmlFor={id}>
          {label}
        </label>
      </div>
      {description === undefined ? null : (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
      <FieldErrors errors={errors} />
    </div>
  )
}

export interface LabeledTextareaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  errors: readonly unknown[]
  description?: string
  rows?: number
}

export function LabeledTextarea({
  id,
  label,
  value,
  onChange,
  onBlur,
  errors,
  description,
  rows = 8,
}: LabeledTextareaProps) {
  return (
    <FieldShell id={id} label={label} description={description} errors={errors}>
      <Textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        spellCheck={false}
        className="font-mono text-xs"
        onBlur={onBlur}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
    </FieldShell>
  )
}
