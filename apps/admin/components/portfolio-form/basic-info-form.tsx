"use client";

import * as React from "react";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PortfolioFormValues } from "./portfolio-schema";

export function BasicInfoForm() {
  const { control, setValue, watch, formState } =
    useFormContext<PortfolioFormValues>();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Auto-generate slug when title changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        const slug = generateSlug(value.title || "");
        setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-card mt-4">
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Project Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Slug is now hidden and auto-generated */}
        <input type="hidden" {...control.register("slug")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="serviceNames"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Services Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="e.g. Advertising and Branding"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 pt-4 border-t">
        <FormField
          control={control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Feature this portfolio?
                </FormLabel>
                <FormDescription>
                  Do you want add this to featured portoflio?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
