import React from "react";

interface FormEntryProps {
  label?: string;
  children: React.ReactNode;
}

export function FormEntry(props: FormEntryProps) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      {props.label && <label className="text-white">{props.label}</label>}
      {props.children}
    </div>
  );
}
