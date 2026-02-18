# Publishing Guide

Follow these steps to publish your package to npm:

## Before Publishing

### 1. Update Package Name

Edit `package.json` and change the package name:

```json
{
  "name": "@santiagocetran/ascii-3d-animation",
  // or without scope:
  "name": "ascii-3d-animation"
}
```

**Important**: 
- If using a scoped name (`@username/package`), use your actual npm username
- Check availability: `npm search your-package-name`

### 2. Update Repository URL

Edit the repository field in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/Santiagocetran/my-ascii-three.git"
  }
}
```

### 3. Update Author

Edit the author field in `package.json`:

```json
{
  "author": "santiagocetran <santiagorcetran236@gmail.com>"
}
```

Before publishing, make sure `"private": false` in `package.json`.

## Publishing Steps

### 1. Build the Library

```bash
npm run build:lib
```

This creates the `dist/` folder with your bundled library.

### 2. Test the Build

Check that `dist/ascii-3d-animation.js` exists and looks correct.

### 3. Login to npm

If you haven't already:

```bash
npm login
```

Enter your npm username, password, and email.

### 4. Publish

For a **public package** (free):

```bash
npm publish --access public
```

For a **scoped package without @**:

```bash
npm publish
```

### 5. Verify

Check your package page:
- https://www.npmjs.com/package/@santiagocetran/ascii-3d-animation

## Updating the Package

When you make changes:

1. Update the version in `package.json`:
   - Patch (bug fixes): `1.0.0` → `1.0.1`
   - Minor (new features): `1.0.0` → `1.1.0`
   - Major (breaking changes): `1.0.0` → `2.0.0`

2. Build and publish:
   ```bash
   npm run build:lib
   npm publish --access public
   ```

Or use npm version:
```bash
npm version patch  # or minor, major
npm run build:lib
npm publish --access public
```

## Using in Other Projects

After publishing, install in your website:

```bash
npm install @santiagocetran/ascii-3d-animation
```

Then import and use:

```javascript
import { startModelAnimation } from '@santiagocetran/ascii-3d-animation'

startModelAnimation({
  container: document.getElementById('animation'),
  modelUrl: '/your-model.stl'
})
```

## Automatic Updates in Your Website

When you publish a new version:

1. In your website project, update the package:
   ```bash
   npm update @santiagocetran/ascii-3d-animation
   ```

2. Or install a specific version:
   ```bash
   npm install @santiagocetran/ascii-3d-animation@1.2.0
   ```

## Tips

- **Test before publishing**: Build and test thoroughly
- **Semantic versioning**: Follow [semver](https://semver.org/) rules
- **Changelog**: Keep a CHANGELOG.md to track changes
- **Git tags**: Tag releases in git: `git tag v1.0.0 && git push --tags`

## Troubleshooting

**Error: "You do not have permission to publish"**
- Make sure you're logged in: `npm whoami`
- Check package name isn't taken: `npm search package-name`
- For scoped packages, use `--access public`

**Error: "package.json not found"**
- Make sure you're in the project root directory

**Package not appearing on npm**
- Wait a few minutes, npm can take time to index
- Check your email for any npm notifications
