import axios from "axios";
import { Buffer } from "buffer";

export async function fetchFundingFile(
  owner: string,
  repo: string,
  filePath = "FUNDING.json",
  branch = "main"
) {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const response = await axios.get(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    // The content is base64 encoded, so decode it
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );
    const jsonContent = JSON.parse(content);

    return jsonContent;
  } catch (error: any) {
    console.error(`Error fetching file: ${error.message}`);
    return null;
  }
}

export function extractGitHubRepoInfo(url: string) {
  const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/;
  const match = url.match(regex);

  if (match) {
    const owner = match[1];
    let repo = match[2];

    // Remove the .git extension if it exists
    if (repo.endsWith(".git")) {
      repo = repo.slice(0, -4);
    }

    return { owner, repo };
  } else {
    return null;
  }
}
