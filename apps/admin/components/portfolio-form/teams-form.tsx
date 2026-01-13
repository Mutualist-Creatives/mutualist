"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { PortfolioFormValues } from "./portfolio-schema";

export function TeamsForm() {
  const { control, register } = useFormContext<PortfolioFormValues>();

  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeam,
  } = useFieldArray({
    control,
    name: "teams",
  });

  return (
    <div className="space-y-4 mt-4">
      {teamFields.map((team, index) => (
        <div key={team.id} className="border p-4 rounded-lg bg-card relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => removeTeam(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="grid gap-4">
            {/* Role Field */}
            <FormField
              control={control}
              name={`teams.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Creative Director" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Names Array (Nested) */}
            <TeamNames index={index} />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => appendTeam({ role: "", names: [""] })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Team Role
      </Button>
    </div>
  );
}

function TeamNames({ index }: { index: number }) {
  const { control } = useFormContext<PortfolioFormValues>();
  const {
    fields: nameFields,
    append: appendName,
    remove: removeName,
  } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    name: `teams.${index}.names`,
  });

  return (
    <div className="space-y-2">
      <FormLabel>Members</FormLabel>
      <div className="space-y-2">
        {nameFields.map((field, nameIndex) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={control}
              name={`teams.${index}.names.${nameIndex}`}
              render={({ field: inputField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...inputField} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (nameFields.length <= 1) {
                  // Maybe clear instead of remove if it's the last one?
                  // Default behavior: just remove.
                }
                removeName(nameIndex);
              }}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendName("")}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Name
      </Button>
    </div>
  );
}
