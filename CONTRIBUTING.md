# Contributing to BNB Chain Skills

Thank you for your interest in contributing. This project provides on-chain analysis tools for BNB Smart Chain and we welcome contributions from the community.

## How to Contribute

1. **Fork** this repository
2. **Create a feature branch** from `main`
3. **Make your changes** following the guidelines below
4. **Submit a pull request** with a clear description of your changes

## Adding a New Skill

Each skill lives in its own directory under `skills/<category>/<skill-name>/` and must include a `SKILL.md` file following this structure:

- YAML frontmatter with `name`, `description`, and `metadata` (author, version)
- Overview table listing API endpoints, functions, and use cases
- Use cases section
- Supported chains table
- API documentation with method, URL, parameters, example request, response example, and field descriptions
- Notes section

See any existing `SKILL.md` for reference.

## Adding a New API Endpoint

1. Add the route in `api/routes/bnbchain.py`
2. Create the corresponding `SKILL.md` in the appropriate category
3. Add the frontend panel in `frontend/js/panels.js` if applicable
4. Register the panel in `frontend/js/app.js`
5. Update the skills table in `README.md`

## Code Style

- **Python**: Follow PEP 8. Use `async/await` for all HTTP calls. Use type hints.
- **JavaScript**: Vanilla JS, no frameworks. Web Components for panels.
- **Documentation**: English only. Clear, concise descriptions.

## Testing

Before submitting a PR:

1. Verify the API endpoint returns correct data
2. Test the frontend panel renders properly
3. Check that caching works (stale-while-revalidate pattern)
4. Confirm no broken imports or missing dependencies

## Reporting Issues

Open a GitHub issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- BSC transaction/block/address examples if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
