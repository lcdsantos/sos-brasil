"use client";

import {
  Box,
  FileUpload,
  FileUploadFileAcceptDetails,
  FileUploadFileRejectDetails,
  Flex,
  Float,
  Icon,
  IconButton,
  Image,
  useFileUpload,
} from "@chakra-ui/react";
import { RiUploadLine, RiCloseLine } from "react-icons/ri";

import { createClient } from "@/lib/supabase/client";

import { Field } from "./ui";
import { toaster } from "../ui/Toaster";

type ImageUploadProps = {
  value?: string | null; // current foto_url
  onChange: (url: string | null) => void;
  bucket?: string; // defaults to 'sos-brasil'
  folder?: string; // e.g. 'abrigos' or 'locais-doacao'
};

const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

const formatBytes = (bytes: number, decimals: number) => {
  if (bytes == 0) return "0 Bytes";
  const k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default function ImageUpload({
  value,
  onChange,
  bucket = "sos-brasil",
  folder = "uploads",
}: ImageUploadProps) {
  const { clearFiles } = useFileUpload();
  const supabase = createClient();

  const upload = async (file: File) => {
    toaster.info({ id: "image-upload", title: "Enviando imagem..." });

    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      toaster.error({
        id: "image-upload",
        title: `Erro no upload: ${uploadError.message}`,
      });
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);

    toaster.success({
      id: "image-upload",
      title: "Imagem enviada com sucesso!",
    });
  };

  const handleOnFileAccept = (details: FileUploadFileAcceptDetails) => {
    const file = details.files[0];
    if (file) upload(file);
  };

  const handleOnFileReject = (details: FileUploadFileRejectDetails) => {
    const error = details.files?.[0].errors?.[0];

    if (error) {
      clearFiles();
    }

    if (error === "FILE_INVALID") {
      toaster.error({
        id: "image-upload",
        title: "Somente imagens são permitidas.",
      });
      return;
    }

    if (error === "FILE_TOO_LARGE") {
      toaster.error({
        id: "image-upload",
        title: `Envie uma imagem menor que ${formatBytes(MAX_FILE_SIZE_IN_BYTES, 0)}.`,
      });
      return;
    }

    if (error) {
      toaster.error({
        id: "image-upload",
        title: "Error ao enviar imagem. Tente novamente.",
      });
    }
  };

  return (
    <Field label="Imagem">
      <Flex alignItems="stretch" w="full" gap="2">
        <FileUpload.Root
          alignItems="stretch"
          maxFileSize={MAX_FILE_SIZE_IN_BYTES}
          accept={["image/*"]}
          onFileAccept={handleOnFileAccept}
          onFileReject={handleOnFileReject}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone minHeight="32">
            <Icon size="md" color="fg.muted">
              <RiUploadLine />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>Clique ou arraste uma imagem</Box>
              <Box color="fg.muted">
                .png, .jpg máx. {formatBytes(MAX_FILE_SIZE_IN_BYTES, 0)}
              </Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
        </FileUpload.Root>

        {value && (
          <Box position="relative" w="0" minWidth="32">
            <Image
              src={value}
              alt="Imagem selecionada"
              objectFit="cover"
              borderRadius="md"
              w="full"
              h="auto"
            />
            <Float placement="top-end">
              <IconButton
                size="xs"
                rounded="full"
                aria-label="Remover imagem"
                onClick={() => onChange(null)}
              >
                <RiCloseLine />
              </IconButton>
            </Float>
          </Box>
        )}
      </Flex>
    </Field>
  );
}
