"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadFileHandler } from "@/lib/uploadFile";
import Loader from "./Loader";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

let errorExists: any = null;

const formSchema = z.object({
  file: z.custom((value) => {
    if (!(value instanceof FileList) || value.length === 0) {
      errorExists = true;
    } else {
      errorExists = false;
    }
    return value;
  }),
});

export const UploadFile = ({
  setUploadedFileId,
}: {
  setUploadedFileId: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("file");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { file } = data;

    try {
      setIsLoading(true);

      if (file) {
        const id = await uploadFileHandler(file[0]);
        setUploadedFileId([{ id }]);
        console.log("File uploaded successfully", id);
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <>
                  <FormItem>
                    <FormControl>
                      <Input type="file" placeholder="shadcn" {...fileRef} />
                    </FormControl>
                    {errorExists && (
                      <span className="text-red-500 text-sm">
                        Porfa selecciona una imagen
                      </span>
                    )}
                  </FormItem>
                  {field.value && (
                    <>
                      <Button disabled={isLoading} type="submit">
                        {isLoading ? "Subiendo Imagen" : "Cargar Imagen"}
                      </Button>
                      {isLoading && <Loader />}
                    </>
                  )}
                </>
              );
            }}
          />
        </div>
      </form>
    </Form>
  );
};
