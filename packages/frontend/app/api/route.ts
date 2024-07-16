// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";

import { fetchFundingFile } from "@/lib/github";
import { extractGitHubRepoInfo } from "@/lib/github";
import axios from "axios";

type Data = {
  name: string;
};

type GithubNotFound = {
  message: string;
  funding_file: null;
  github_repo: null;
};

export function GET(request: any) {
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
  /** Github repo link */
  repo: string;
  filePath: string;
  branch: string;
};

export type OSSPayload = {
  ossdonate: {
    celo: {
      ownedBy: `0x${string}`;
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
    const branch = "main";
    const filePath = "FUNDING.json";
    const body = (await request.json()) as Payload | null;

    if (!body) {
      return Response.json(
        {
          message: "Please provide github repo link",
          funding_file: null,
          github_repo: null,
        },
        {
          status: 404,
        }
      );
    }

    let isGithubRepo = extractGitHubRepoInfo(body.github_repo.toLowerCase());

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

    // let projectInfo = (await fetchFundingFile(owner, repo)) as
    //   | GithubResponse["funding_file"]
    //   | null;

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const response = await axios.get(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    // The content is base64 encoded, so decode it
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );
    const funding_file = JSON.parse(content) as
      | GithubResponse["funding_file"]
      | null;

    if (!funding_file) {
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
      message: "Found Funding.json file.",
      funding_file: funding_file,
      github_repo: isGithubRepo,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.status === 404) {
      // If FUNDING.json file is not found do not error out
      return Response.json(
        {
          message: "Could not find Funding.json file",
          funding_file: null,
          github_repo: null,
        },
        {
          status: 200,
        }
      );
    }

    return Response.json(
      {
        message: error.message,
        funding_file: null,
        github_repo: null,
      },
      {
        status: 500,
      }
    );
  }
}
