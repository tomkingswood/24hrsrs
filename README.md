# 24 Hour Stairlift Repair Services Website

A modern static website built with Astro and Tailwind CSS, hosted on Cloudflare Pages.

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide Icons
- **Hosting**: Cloudflare Pages
- **Contact Form**: Cloudflare Worker + Resend

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

### 1. Push to GitHub

Create a new GitHub repository and push this code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/24hr-stairlift-repairs.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project"
3. Connect your GitHub account
4. Select this repository
5. Configure build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 3. Configure Environment Variables

In Cloudflare Pages dashboard, add these environment variables:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key |
| `TO_EMAIL` | Email to receive form submissions (default: srs.24hr@hotmail.com) |
| `FROM_EMAIL` | Verified sender email in Resend |

### 4. Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your domain or use the default sender
3. Create an API key
4. Add the API key to Cloudflare Pages environment variables

### 5. Configure Custom Domain

1. In Cloudflare Pages, go to Custom domains
2. Add your domain (e.g., 24hrstairliftrepairs.co.uk)
3. Follow DNS configuration instructions

## Project Structure

```
src/
├── components/
│   ├── Header.astro      # Navigation + contact bar
│   ├── Footer.astro      # Footer with contact info
│   ├── Hero.astro        # Homepage hero section
│   ├── ServiceCard.astro # Reusable service card
│   ├── ContactForm.astro # Contact form component
│   ├── FAQ.astro         # Accordion FAQ item
│   ├── PriceTable.astro  # Pricing table
│   ├── CTA.astro         # Call-to-action section
│   └── PageHeader.astro  # Page header for service pages
├── layouts/
│   └── Layout.astro      # Base layout
├── pages/
│   ├── index.astro       # Homepage
│   ├── repairs.astro     # Repairs page
│   ├── installations.astro
│   ├── servicing.astro
│   ├── faqs.astro
│   ├── pricing.astro
│   └── api/
│       └── contact.ts    # Contact form API endpoint
└── styles/
    └── global.css        # Tailwind + custom styles
```

## Contact Information

- **Phone**: 0114 2347195
- **Mobile**: 07835 204800
- **Email**: srs.24hr@hotmail.com
- **Hours**: 24/7
