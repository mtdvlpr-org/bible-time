const config = useRuntimeConfig()

const defaultFetchOptions = {
  baseURL: 'https://api.github.com',
  headers: { Authorization: `Bearer ${config.githubToken}` }
}

export const githubRepository = {
  createIssue: async (
    title: string,
    body: string,
    options?: { labels?: GitHubLabel[]; type?: GitHubIssueType }
  ) => {
    return await $fetch<GitHubIssueCreateResponse>(
      `/repos/${config.public.repoOwner}/${config.public.repoName}/issues`,
      {
        ...defaultFetchOptions,
        body: { body, title, ...options },
        method: 'POST'
      }
    )
  }
}
