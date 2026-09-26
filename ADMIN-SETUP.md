# Gift Shop Admin Setup & Operations Guide

This document describes the architecture, initial setup, security configuration, and operational procedures for the **mdgifts.in** admin portal.

---

## 1. System Architecture

```
Client / Shop Owner
  ↓
https://mdgifts.in/admin
  ↓
Cloudflare Access (Zero Trust Email Allow Policy)
  ↓
Admin UI (React Client App)
  ↓
Cloudflare Pages Functions (/api/admin/*)
  ↓ [Web Crypto RS256 JWT]
GitHub App (ID: 5077719, Installation: 164922482)
  ↓ [Contents API]
Repository (ShaikYakoub/md-gifts: content/products.json & content/banners.json)
  ↓ [Git Push Hook]
Cloudflare Pages Automatic Static Rebuild
  ↓
Updated Static Storefront (out/)
```

### Key Architectural Principles
- **Storefront remains 100% Static**: Static Next.js export (`output: 'export'`) served from `out/` on Cloudflare Pages global CDN.
- **Zero Storefront Functions**: Controlled by `public/_routes.json` (`include: ["/api/admin/*"]`). Public routes never invoke Workers.
- **No Password Management**: Cloudflare Access manages identity verification (deny-by-default, one-time PIN / SSO to client's email).
- **No Database**: The GitHub repository is the canonical data store.
- **Security Boundary**: The browser never sees GitHub credentials or specifies repository paths. Functions only allow edits to `content/products.json`, `content/banners.json`, and images in `public/uploads/`.

---

## 2. Admin URL
- **Production Admin Portal**: `https://mdgifts.in/admin`
- **Allowed Admin Identity**: Configured via Cloudflare Secret `ADMIN_EMAIL`

---

## 3. Cloudflare Access Setup (Step-by-Step)

Configure Cloudflare Access in the Cloudflare Dashboard to protect `/admin`:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Zero Trust** → **Access** → **Applications**.
3. Click **Add an application** and select **Self-hosted**.
4. Configure **Application Configuration**:
   - **Application name**: `MD Gifts Admin`
   - **Session Duration**: `24 hours` (or desired session length)
   - **Application domain**:
     - Subdomain: *(leave empty or enter `www` if using www)*
     - Domain: `mdgifts.in`
     - Path: `admin*`
5. Click **Next** to configure **Policies**:
   - **Policy name**: `Allow Store Owner`
   - **Action**: `Allow`
   - **Configure rules** → **Include**:
     - Selector: `Emails`
     - Value: `<client-email@example.com>` *(the client's exact email address)*
6. Click **Next** through CORS/Cookie settings (defaults are suitable) and click **Save application**.

> [!IMPORTANT]
> Cloudflare Access operates on a **deny-by-default** model. Only the specified email address can authenticate and reach `/admin`. All other visitors are blocked before any request reaches the application.

---

## 4. Cloudflare Pages Secrets Setup

In your Cloudflare Pages project settings, configure the following server-side environment variables and secrets:

1. In the Cloudflare Dashboard, go to **Workers & Pages** → **Overview** → select **md-gifts**.
2. Navigate to **Settings** → **Environment variables**.
3. Under **Production** (and **Preview** if needed), add:

| Variable Name | Type | Value / Description |
|---|---|---|
| `NODE_VERSION` | Plaintext | `22.16.0` |
| `ADMIN_EMAIL` | Encrypted Secret / Plaintext | The client's exact email (e.g. `owner@mdgifts.in`). Comma-separated for multiple. |
| `GITHUB_APP_ID` | Plaintext | `5077719` |
| `GITHUB_INSTALLATION_ID` | Plaintext | `164922482` |
| `GITHUB_PRIVATE_KEY` | **Encrypted Secret** | Your GitHub App `.pem` private key content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`). |

> [!CAUTION]
> Never commit the `.pem` file to Git or expose `GITHUB_PRIVATE_KEY` as a `NEXT_PUBLIC_` variable. It must exist only as an encrypted secret in Cloudflare Pages.

---

## 5. Local Development

To test the admin interface locally:

1. Create a local `.env.local` file (this file is ignored in `.gitignore`):
   ```env
   NODE_VERSION=22.16.0
   ADMIN_EMAIL=your-email@example.com
   GITHUB_APP_ID=5077719
   GITHUB_INSTALLATION_ID=164922482
   # Paste PEM key with literal newlines if testing GitHub API commits locally:
   GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
   # Enable local development header bypass when running outside Cloudflare Access:
   ALLOW_LOCAL_DEV_ADMIN=true
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000/admin` in your browser.

---

## 6. How the Client Edits Content

### Editing Products
1. Visit `https://mdgifts.in/admin`.
2. Cloudflare Access sends a one-time login code to the client's email.
3. On the **Products** tab:
   - Click **Add Product** to create a new product.
   - Click **Edit** on any existing product to update its name, images, price, compare-at price, offer tag, category, sizes, or colors.
   - Use the **Upload Image** button to upload photos directly from a computer or phone.
   - Toggle **Publish to Storefront** to show or hide a product without deleting it.
   - Click **Save Product**.
4. The system automatically commits the update to `content/products.json` in GitHub.
5. Cloudflare Pages detects the commit, initiates a static build, and deploys the updated storefront in ~1–2 minutes.

### Editing Banners
1. On the **Banners** tab:
   - Click **Add Banner** or **Edit** on an existing banner.
   - Change the banner title, description, destination link, or upload a new banner image.
   - Toggle **Active on Storefront** to activate or pause the banner.
   - Click **Save Banner**.
2. Cloudflare Pages rebuilds and updates the hero banner slider automatically.

---

## 7. Changing or Revoking Client Access

### To change the client email:
1. In Cloudflare Dashboard → **Zero Trust** → **Access** → **Applications** → edit `MD Gifts Admin` policy.
2. Update the email under the **Include** rule.
3. In **Workers & Pages** → **md-gifts** → **Settings** → **Environment variables**, update `ADMIN_EMAIL` to match.

### To immediately revoke client access:
1. Delete or disable the Allow policy in Cloudflare Access.
2. The user will be blocked immediately at Cloudflare's edge.

---

## 8. Rotating the GitHub App Private Key

If the GitHub App private key is ever compromised or needs periodic rotation:
1. Go to [GitHub App Settings](https://github.com/settings/apps) → **Mdgift-shop admin-access**.
2. Scroll to **Private keys** and click **Generate a private key**.
3. Download the new `.pem` file.
4. Go to Cloudflare Dashboard → **Workers & Pages** → **md-gifts** → **Settings** → **Environment variables**.
5. Update `GITHUB_PRIVATE_KEY` with the contents of the new `.pem` file.
6. Return to GitHub App settings and delete the old private key.

---

## 9. Verification & Build Commands

- **Run all unit & integration tests**:
  ```bash
  npm test
  ```
- **Typecheck TypeScript**:
  ```bash
  npm run typecheck
  ```
- **Run Linter**:
  ```bash
  npm run lint
  ```
- **Create Static Production Build**:
  ```bash
  npm run build
  ```
  *(Confirms static HTML export to `out/` with zero errors).*
