"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PortfolioFormValues, SERVICE_ICONS } from "./portfolio-schema";

export function ServicesForm() {
  const { control } = useFormContext<PortfolioFormValues>();

  return (
    <div className="border p-4 rounded-lg bg-card mt-4 space-y-4">
      <FormField
        control={control}
        name="serviceIcons"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Active Service Icons</FormLabel>
            </div>
            <div className="flex gap-4">
              {SERVICE_ICONS.map((icon) => (
                <FormField
                  key={icon}
                  control={control}
                  name="serviceIcons"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={icon}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(icon)}
                            onCheckedChange={(checked: boolean) => {
                              return checked
                                ? field.onChange([...(field.value || []), icon])
                                : field.onChange(
                                    (field.value || []).filter(
                                      (value) => value !== icon
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{icon}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
