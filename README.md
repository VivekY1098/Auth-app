# {{ Project Name }}

{{ Brief description of the project }}

## Overview
This repository is created from Ollion's standard template to ensure best practices.

## Installation
{{ Instructions on how to install the project }}

## Usage
{{ How to use the project }}

## Using this Template
1. When creating a new repository on GitHub, select "Choose a template" and pick `ollionorg/private-repository-creation` from the list.
2. Enter your repository name (e.g., "my-new-repository").
3. Set visibility to "Private".
4. Do not check "Include all branches".
5. Click "Create repository.

## Post-Creation Setup
- After creating your repository from private-repository-creation template, you can enable branch protection for the `main` branch by manually triggering the included workflow:
  - Go to the **Actions** tab, select **Set Branch Protection**, and click **Run workflow** > **Run workflow** to apply the protection rules, which are configured by the workflow.
- After the workflow completes successfully, verify in **Settings** > **Branches** that `main` has:
  - Pull request required (1 approval)
  - Conversation resolution required
  - Signed commits required
- Customize this README: Replace `[Project Name]`, `[Brief description of the project]`, and update `Installation` and `Usage` sections as needed. Modify other files if required.

## Note: GPG Signing and Repository Creation
- The branch protection rules mandate commit signatures. Set up GPG signing in your Git client by following this [Confluence guide](https://ollion.atlassian.net/wiki/spaces/CID/pages/2989687222/Signed+Commits+on+Github).
- For detailed instructions on creating a repository with this template, refer to this [Confluence guide](https://ollion.atlassian.net/wiki/spaces/CID/pages/4123131980/Github+Repository+creation+using+template).