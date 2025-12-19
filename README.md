# Testing and Security Improvement Cursus

## Motivation

This website was born out of a desire to share and publish well-documented knowledge about testing and security. Created from a place of professional frustration, our goal is to provide clear, practical insights into these critical aspects of software development.

## Project Overview

A comprehensive, GitBook-inspired platform designed to enhance existing educational resources on testing and security.

### Tech Stack

#### Languages and Frameworks
- **Primary Language**: TypeScript
- **Frontend**:
  - React (TypeScript)
  - Tailwind CSS
  - Shadcn UI
  - Markdown to HTML React

#### Infrastructure
- **Container**: Docker
- **Backend**: None (Static Site)
- **Runtime**: Node.js
- **CI/CD**: 
  - GitHub Actions
  - Tailscale

## Automation Strategy

We've implemented automated workflows for three key processes:
1. Server Deployment
2. Docker Image Publishing when creating realise
3. Release Management via auto tagging

### Versioning Convention

| Commit Message Keyword | Version Increment | Example |
|------------------------|-------------------|---------|
| `[major]`              | Major (2.0.0)     | Breaking architectural changes |
| `[minor]`              | Minor (1.1.0)     | New features |
| `[patch]`              | Patch (1.0.1)     | Bug fixes |
| `[release]`            | Patch (1.0.1)     | Release preparation |

## Project Access

Visit our live site: [Testing and Security Resources](https://testingandsecurity.nilsmertens.dev)

## Contribution

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/Nils-dev-mertens/testingAndSecurityCursus/issues).