# Deploy NanoSensei to GitHub

This guide will help you push your NanoSensei project to GitHub.

## Step 1: Initialize Git Repository

If you haven't already, initialize git in your project:

```bash
# Navigate to project root
cd nanosensei

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: NanoSensei - On-Device AI Skill Coach"
```

## Step 2: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name:** `nanosensei` (or your preferred name)
   - **Description:** `🔥 On-Device AI Skill Coach - Optimized for Arm-based devices and AWS Graviton`
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Option B: Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# Then authenticate: gh auth login

# Create repository
gh repo create nanosensei --public --description "🔥 On-Device AI Skill Coach - Optimized for Arm-based devices and AWS Graviton"
```

## Step 3: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nanosensei.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/nanosensei.git

# Verify remote was added
git remote -v
```

## Step 4: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys
- Use GitHub CLI: `gh auth login`

## Step 5: Verify Deployment

1. Go to your repository on GitHub
2. Verify all files are present
3. Check that README.md displays correctly
4. Verify CI workflow is set up (`.github/workflows/ci.yml`)

## Step 6: Set Up Repository Settings (Optional)

### Add Topics/Tags

Go to repository → **Settings** → add topics:
- `react-native`
- `expo`
- `fastapi`
- `aws-graviton`
- `arm64`
- `on-device-ai`
- `machine-learning`
- `docker`

### Add Repository Description

Update the description to:
```
🔥 On-Device AI Skill Coach - React Native mobile app with FastAPI backend, optimized for Arm-based devices and AWS Graviton (arm64)
```

### Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Enable "Allow all actions and reusable workflows"
3. Save

## Step 7: Create Releases (Optional)

For version releases:

```bash
# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

Then on GitHub:
1. Go to **Releases** → **Draft a new release**
2. Select the tag
3. Add release notes
4. Publish

## Troubleshooting

### Authentication Issues

**If you get "Permission denied":**

1. **Use Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions
   - Use token as password when pushing

2. **Or use SSH:**
   ```bash
   # Generate SSH key
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add to SSH agent
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   
   # Copy public key and add to GitHub → Settings → SSH keys
   cat ~/.ssh/id_ed25519.pub
   
   # Then use SSH URL for remote
   git remote set-url origin git@github.com:YOUR_USERNAME/nanosensei.git
   ```

### Large Files

If you have large files, consider:
- Using Git LFS: `git lfs install`
- Adding to `.gitignore` if not needed
- Using `.gitattributes` for specific file types

### Branch Protection

For production repositories:
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Require pull request reviews
4. Require status checks to pass

## Next Steps After Deployment

1. **Clone on EC2 for deployment:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nanosensei.git
   ```

2. **Set up GitHub Actions secrets** (if needed for CI/CD)

3. **Add collaborators** (Settings → Collaborators)

4. **Create issues** for tracking features/bugs

5. **Set up branch protection** for production

## Repository Structure on GitHub

Your repository should have:
```
nanosensei/
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
├── backend/                # FastAPI backend
├── mobile/                 # React Native app
├── infra/                  # Deployment files
├── .gitignore
├── LICENSE
├── README.md
├── QUICKSTART.md
├── TESTING.md
└── docker-compose.yml
```

## Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# Add specific files
git add backend/app/main.py

# Commit with message
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Best Practices

1. **Commit often** with descriptive messages
2. **Use branches** for features (`git checkout -b feature/name`)
3. **Write good commit messages:**
   - Start with verb: "Add", "Fix", "Update", "Remove"
   - Be specific: "Add user authentication" not "Update code"
4. **Don't commit:**
   - API keys or secrets
   - Large binary files
   - Generated files
   - Personal information
5. **Use .gitignore** (already configured)

## Security Checklist

Before pushing, ensure:
- [ ] No API keys or secrets in code
- [ ] No database passwords
- [ ] No personal information
- [ ] `.env` files in `.gitignore`
- [ ] SSH keys not committed
- [ ] AWS credentials not in code

## Need Help?

- [GitHub Docs](https://docs.github.com)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub CLI Docs](https://cli.github.com/manual/)

