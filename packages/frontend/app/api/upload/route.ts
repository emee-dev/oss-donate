import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    // Extract form data
    const formData = await req.formData();
    let body = Object.fromEntries(formData);

    // Example: extracting an avatar file from the form data
    const avatarFile = formData.get("files") as File;

    if (!avatarFile) {
      return Response.json({ message: "No file provided" });
    }

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${avatarFile.name}`, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    console.log("Uploaded file:", data);

    return Response.json({ message: "File Uploaded", data });
  } catch (error) {
    console.error("Error uploading file:", error);
    return Response.json({ message: "File upload failed", error });
  }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  let body = await req.json();
  console.log("delete body", body);
  console.log("delete body", req.url);

  return Response.json({ message: "File deleted." });
};
