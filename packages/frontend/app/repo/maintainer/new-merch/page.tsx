"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePond, registerPlugin, FilePondProps } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useEffect, useState } from "react";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useWeb3Context } from "@/context";
// import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

type SupabaseFileUpload = {
  signedUrl: string;
  token: string;
  path: string;
} | null;

function MerchUpload() {
  const [files, setFiles] = useState([]);
  const { account } = useWeb3Context();
  const [user, setUser] = useState("");
  const [file, setFile] = useState(null);
  // const [uploadUrl, setUploadUrl] = useState<SupabaseFileUpload>(null);

  // async function anonSignin(e: any) {
  //   // let login = await supabase.auth.signInAnonymously();
  //   // let user = login.data.user;
  //   // if (user && user.id) {
  //   //   console.log(user.id);

  //   // @ts-expect-error
  //   let imgs = e.map((f) => f.file);

  //   for (let i = 0; i < imgs.length; i++) {
  //     let file = imgs[i] as File;

  //     console.log("File");

  //     const { data, error } = await supabase.storage
  //       .from("images")
  //       .upload(`${file.name}`, file, {
  //         cacheControl: "3600",
  //         upsert: false,
  //       });

  //     console.log("data", data);
  //     console.log("error", error);

  //     console.log("file", "uploaded");
  //   }
  // }

  // useEffect(() => {
  //   // anonSignin();
  // }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Merchandise</CardTitle>
        <CardDescription>Upload your merchandise here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <FilePond
            files={files}
            // @ts-expect-error
            onupdatefiles={setFiles}
            allowMultiple={true}
            allowRevert={false}
            maxFiles={3}
            // server="/api/upload"
            name="files"
            // onprocessfilestart={(file) => file.}
            onaddfile={async (err, file) => {}}
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Link href="/repo/maintainer">Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MerchUpload;
