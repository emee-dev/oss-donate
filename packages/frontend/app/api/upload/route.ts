import { Buffer } from "buffer";
// import { supabase } from "@/utils/supabase/client";
import formidable from "formidable";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // console.log(avatarFile);

    // let bytes = await avatarFile.arrayBuffer();
    // const buffer = Buffer.from(bytes);

    // // const byteArrayBuffer = fs.readFileSync();
    // let data = await new Promise((resolve) => {
    //   cloudinary.uploader
    //     .upload_stream((error, uploadResult) => {
    //       return resolve(uploadResult);
    //     })
    //     .end(buffer);
    // });

    // console.log("data", data);

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
