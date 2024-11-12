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
import Image from "next/image";

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
        setUploadedFileId(id);
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
        <div>
          <i className="text-sm text-muted-foreground pb-2 text-left my-4">
            Sube la evidencia de el Md3, debe ser una sola imagen.
          </i>
          <p className="text-muted-foreground py-2 text-left text-sm italic">
            Puedes encontrar esta imagen en:
            <b className="text-black">
              Extras - Información de Usuario - Historial de Partidos
            </b>
          </p>
          <div className="flex justify-center cursor-pointer flex-col items-center relative">
            <Image
              src="/example-image.jpg"
              width={400}
              height={400}
              alt=""
              className="my-4"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <div className="bg-slate-200 p-4 w-full rounded-md">
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        width="w-full"
                        placeholder="shadcn"
                        {...fileRef}
                        accept="image/jpeg, image/jpg, image/png, image/webp"
                      />
                    </FormControl>
                    {errorExists && (
                      <span className="text-red-500 text-sm">
                        Porfa selecciona una imagen
                      </span>
                    )}
                  </FormItem>
                  {field.value && (
                    <div className="flex justify-end mt-4">
                      <Button disabled={isLoading} type="submit">
                        {isLoading ? "Subiendo Imagen" : "Cargar Imagen"}
                      </Button>
                      {isLoading && <Loader />}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </form>
    </Form>
  );
};
