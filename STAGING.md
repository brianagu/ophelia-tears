# Staging Workflow for Ophelia's Tears Studio

## Quick Reference

### The Three Branches

- **`main`** → Production (live site: opheliatearsstudio.com)
- **`staging`** → Testing environment (auto-generated preview URL)
- **`feature/...` or `fix/...`** → Your work-in-progress branches

---

## Workflow Steps

### 1. Finish Your Work

```bash
git checkout feature/your-feature-name
# Make changes, test locally
git commit -m "Your commit message"
```

### 2. Merge Into Staging & Get Preview URL

```bash
git checkout staging
git merge feature/your-feature-name
git push origin staging
```

**⏱️ Wait 1-2 minutes for Vercel to build and deploy.**

### 3. Find Your Preview URL

Go to **[Vercel Dashboard](https://vercel.com)** → Your Project → **Deployments**

Look for the most recent deployment from the `staging` branch. Click it to get the preview URL.

**Example:** `ophelia-tears-staging-git-staging-brianagu.vercel.app`

### 4. Test on the Preview URL

✅ Visit the preview URL  
✅ Test all changes  
✅ Verify on mobile & desktop  
✅ Check links, animations, responsiveness  

### 5a. Found Issues? Fix & Re-test

```bash
# Go back to your feature branch
git checkout feature/your-feature-name

# Make fixes and commit
git commit -m "Fix: ..."

# Re-merge into staging
git checkout staging
git merge feature/your-feature-name
git push origin staging

# Vercel rebuilds (~1-2 min)
# Same preview URL updates automatically
# Re-test
```

### 5b. Everything Looks Good? Deploy to Production

```bash
git checkout main
git merge staging
git push origin main
```

**⏱️ Wait 1-2 minutes. Your changes go live at opheliatearsstudio.com**

---

## Tips

- **Preview URLs are temporary** — use them for testing, but don't bookmark them for long-term
- **Each push to `staging` triggers a new build** — takes ~1-2 minutes
- **No conflicts expected** — if you get a merge conflict, resolve it locally before pushing
- **You can push to staging multiple times** — test, fix, test again, no limit
- **Production stays safe** — nothing goes live until you explicitly merge `staging` → `main`

---

## Troubleshooting

**Q: I don't see the preview URL**  
A: Check Vercel Deployments tab. If it's still building, wait 1-2 minutes. Refresh the page.

**Q: Preview URL shows old changes**  
A: Vercel's CDN may cache. Try a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows). If still old, wait another minute.

**Q: I want to undo a staging merge**  
A: `git reset --hard origin/main` on the `staging` branch, then `git push -f origin staging` (only on staging, never on main).

---

## Current Branches

```
main (production)
staging (preview)
```

Created: 2026-09-21
