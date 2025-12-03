# SSH Key Setup for GitHub

## ✅ SSH Key Created!

Your SSH key has been generated. Here's what to do next:

## Step 1: Copy Your Public Key

Your public key is located at:
```
C:\Users\YOUR_USERNAME\.ssh\id_ed25519_nanosensei.pub
```

**Copy the entire contents of this file** - it should look like:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... nanosensei@github
```

### Quick Command to Copy:
```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519_nanosensei.pub | Set-Clipboard
```

This will copy the key to your clipboard automatically.

## Step 2: Add SSH Key to GitHub

1. Go to GitHub.com and sign in
2. Click your profile picture → **Settings**
3. In the left sidebar, click **SSH and GPG keys**
4. Click **New SSH key** (green button)
5. Fill in:
   - **Title:** `NanoSensei Development` (or any name you prefer)
   - **Key type:** Authentication Key
   - **Key:** Paste your public key (from Step 1)
6. Click **Add SSH key**
7. You may be asked to confirm your GitHub password

## Step 3: Test SSH Connection

```powershell
ssh -T git@github.com
```

You should see:
```
Hi LightLLM! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 4: Configure Git to Use This Key

Create or edit `C:\Users\YOUR_USERNAME\.ssh\config`:

```ssh-config
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_nanosensei
    IdentitiesOnly yes
```

## Step 5: Update Remote URL to Use SSH

```powershell
# Remove existing remote (if any)
git remote remove origin

# Add SSH remote
git remote add origin git@github.com:LightLLM/nanosensei.git

# Verify
git remote -v
```

## Step 6: Push to GitHub

```powershell
# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Troubleshooting

### "Permission denied (publickey)"

- Verify the key was added to GitHub correctly
- Check that the config file is set up properly
- Try: `ssh -T git@github.com -v` for verbose output

### "Could not resolve hostname"

- Check your internet connection
- Verify you're using `git@github.com` not `github.com`

### Key Not Found

If you need to regenerate the key:
```powershell
ssh-keygen -t ed25519 -C "nanosensei@github" -f $env:USERPROFILE\.ssh\id_ed25519_nanosensei
```

## Security Notes

- **Never share your private key** (`id_ed25519_nanosensei` - the one WITHOUT .pub)
- **Only share your public key** (`id_ed25519_nanosensei.pub` - the one WITH .pub)
- Keep your private key secure and backed up
- Use a passphrase for extra security (optional)

## Alternative: Use Existing SSH Key

If you already have an SSH key set up with GitHub, you can use it instead:

```powershell
# Check existing keys
Get-ChildItem $env:USERPROFILE\.ssh\*.pub

# Use existing key by updating the config file
```

## Next Steps

Once SSH is set up:
1. Push your code: `git push -u origin main`
2. Verify on GitHub that all files are there
3. Check that CI workflows run automatically

