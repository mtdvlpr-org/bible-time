/* eslint-disable perfectionist/sort-union-types */
export interface GitHubIssueCreateResponse {
  html_url: string
  number: number
}

export type GitHubIssueType =
  | '❔ Discussion'
  | '🏆 Feature'
  | '📋 Task'
  | '🚀 Enhancement'
  | '🐛 Bug'
  | '📖 Documentation'

export type GitHubLabel =
  | 'Prio: High'
  | 'Prio: Low'
  | 'Prio: Medium'
  | 'Scope: Backend'
  | 'Scope: Dependencies'
  | 'Scope: Design'
  | 'Scope: DevOps'
  | 'Scope: Frontend'
  | 'Scope: Performance'
  | 'Scope: Security'
  | 'Status: Blocked'
  | 'Status: Done'
  | 'Status: Duplicate'
  | 'Status: In Progress'
  | 'Status: Invalid'
  | 'Status: Ready'
  | 'Status: Refinement'
  | 'Status: Review'
  | 'Status: Triage'
  | 'Status: wontfix'
