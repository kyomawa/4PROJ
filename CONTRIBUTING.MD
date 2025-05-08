# Contributing Guide

Thank you for your interest in contributing to the Supmap project! This document contains information to help you get started with contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We aim to maintain a welcoming, friendly, and inclusive environment for everyone.

## How to Contribute

### Pull Requests

1. Clone the repository
2. Create a feature branch (with dev branch) (e.g., `git checkout -b feat/my-new-feature`)
3. Commit your changes using a well-formatted commit message
4. Push to the branch (e.g., `git push origin feat/my-new-feature`)
5. Create a new Pull Request (into dev)

### Commit Message Format

Your commit messages should follow the format below:

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify `src` or `test` files
- **revert**: Reverts a previous commit

### Example

```bash
feat(navigation-service): add support for bicycle routing
fix(incident-service): resolve issue with bounding box calculation
docs(auth-service): update API documentation for JWT token handling
refactor(user-service): improve user repository performance
test(mobile-app): add unit tests for map component
```

## Development Setup

1. Make sure you have the following installed:

   - Docker and Docker Compose

2. Clone the repository:

   ```bash
   git clone https://github.com/kyomawa/4PROJ.git
   cd trafine
   ```

3. Create a `.env` file based on the provided `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your own API keys and settings.

5. Start the development environment:
   ```bash
   docker compose watch
   ```

## Project Structure

The project follows a microservices architecture with the following services:

- **navigation-service**: Handles route calculations and directions
- **incident-service**: Manages traffic incidents
- **auth-service**: Handles authentication
- **user-service**: Manages user accounts
- **mobile-app-service**: React Native mobile application

Each service has its own directory with dedicated documentation.

## Branching Strategy

We follow a feature branching workflow:

1. **Main Branch**: `main` - The production-ready code
2. **Development Branch**: `dev` - The active development branch
3. **Feature Branches**: `feat/{feature-name}` - For new features
4. **Fix Branches**: `fix/{bug-name}` - For bug fixes
5. **Documentation Branches**: `docs/{doc-change}` - For documentation changes

Always branch off from `dev` for new work, and create pull requests back to `dev`.

## Documentation

Update documentation when you make changes to code:

- Update READMEs if you change service functionality
- Update API documentation if you modify endpoints
- Add code comments for complex logic

Thank you for contributing !
