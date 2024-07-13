// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";

import { fetchFundingFile } from "@/lib/github";
import { extractGitHubRepoInfo } from "@/lib/github";

type Data = {
  name: string;
};

export function GET(request: any) {
  // res.status(200).json({ name: "John Doe" });

  // console.log(request);

  // let url = new URLSearchParams(request.url);
  let url = new URL(request.url).searchParams.get("handle");

  console.log(url);

  return Response.json({ name: "John Doe" });
}

export type Payload = {
  github_repo: string;
};

export type GithubRepo = {
  owner: string;
  repo: string;
  filePath: string;
  branch: string;
};

export type OSSPayload = {
  ossdonate: {
    celo: {
      ownedBy: string;
    };
  };
};

export type GithubResponse = {
  message: string;
  data: {
    funding_file: OSSPayload;
    github_repo: GithubRepo;
  };
};

export async function POST(request: Request) {
  let body = (await request.json()) as Payload | null;

  if (!body) {
    return Response.json(
      {
        message: "Please provide github repo link",
      },
      {
        status: 402,
      }
    );
  }

  let isGithubRepo = extractGitHubRepoInfo(body.github_repo);

  if (!isGithubRepo) {
    return Response.json(
      {
        message: "Please provide a valid github repo link",
      },
      {
        status: 404,
      }
    );
  }

  let { owner, repo } = isGithubRepo;

  let projectInfo = (await fetchFundingFile(owner, repo)) as
    | GithubResponse["data"]["funding_file"]
    | null;

  if (!projectInfo) {
    return Response.json(
      {
        message: "Third party error",
      },
      {
        status: 500,
      }
    );
  }

  console.log(projectInfo);

  return Response.json({
    message: "Github repo resolved successfully",
    data: {
      funding_file: projectInfo,
      github_repo: isGithubRepo,
    } as GithubResponse["data"],
  });
}
