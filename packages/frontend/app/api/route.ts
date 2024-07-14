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
  funding_file: OSSPayload;
  github_repo: GithubRepo;
};

export async function POST(request: Request) {
  try {
    let body = (await request.json()) as Payload | null;

    if (!body) {
      return Response.json(
        {
          message: "Please provide github repo link",
          funding_file: null,
          github_repo: null,
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
          funding_file: null,
          github_repo: null,
        },
        {
          status: 404,
        }
      );
    }

    let { owner, repo } = isGithubRepo;

    let projectInfo = (await fetchFundingFile(owner, repo)) as
      | GithubResponse["funding_file"]
      | null;

    if (!projectInfo) {
      return Response.json(
        {
          message: "Could not find Funding.json file, please add to project.",
          funding_file: null,
          github_repo: null,
        },
        {
          status: 200,
        }
      );
    }

    return Response.json({
      message: "Github repo resolved successfully",
      funding_file: projectInfo,
      github_repo: isGithubRepo,
    });
  } catch (e: any) {
    return Response.json(
      {
        message: e.message,
        funding_file: null,
        github_repo: null,
      },
      {
        status: 500,
      }
    );
  }
}
