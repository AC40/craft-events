# Craft Events

A privacy-focused event scheduling tool that integrates with Craft documents. Create Doodle-like scheduling pages directly in your Craft workspace without ads, sign-ups, or data collection.

## Features

- **Event Scheduling**: Create scheduling pages with multiple time slots
- **Craft Integration**: Seamlessly integrates with Craft documents via API
- **Privacy First**: No database storage, credentials encrypted server-side
- **Easy Sharing**: Share voting links with anyone—no Craft accounts required
- **Live Results**: View real-time availability synced from Craft documents

## Tech Stack

- **Framework**: Next.js 14.2.0
- **Language**: TypeScript 5.6.2
- **Styling**: Tailwind CSS 3.4.13
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query) 5.59.0
- **Forms**: React Hook Form 7.67.0 with Zod validation
- **Encryption**: Web Crypto API (AES-GCM)
- **Package Manager**: pnpm 9.0.0

## Prerequisites

- Node.js 20 or higher
- pnpm 9.0.0 or higher
- A Craft account with API access
- Your Craft API URL (and optional API key)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AC40/craft-events.git
cd craft-events
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create `.env` manually with the following variables:

```env
# Required: Master key for encrypting/decrypting API credentials
# Generate a strong random string (at least 32 characters recommended)
MASTER_KEY=your-secret-master-key-here

# Optional: Telemetry Deck App ID for analytics (only if you want analytics)
NEXT_PUBLIC_TELEMETRY_DECK_APP_ID=
```

**Important**: Generate a strong, random `MASTER_KEY`. This key is used to encrypt user API credentials. You can generate one using:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Building for Production

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `MASTER_KEY`: Your encryption master key
   - `NEXT_PUBLIC_TELEMETRY_DECK_APP_ID`: (Optional) Your Telemetry Deck app ID
4. Deploy

The `netlify.toml` file is already configured for Next.js.

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables:
   - `MASTER_KEY`: Your encryption master key
   - `NEXT_PUBLIC_TELEMETRY_DECK_APP_ID`: (Optional) Your Telemetry Deck app ID
4. Deploy

### Deploy to Other Platforms

The application is a standard Next.js application and can be deployed to any platform that supports Next.js:

- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify
- Any Node.js hosting platform

Make sure to set the required environment variables in your hosting platform's configuration.

## Project Structure

```
craft-events/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── actions.ts          # Server actions for API calls
│   │   ├── page.tsx            # Home page (event creation flow)
│   │   ├── event/[blockId]/    # Voting and results pages
│   │   ├── how-it-works/       # Documentation page
│   │   └── privacy/            # Privacy policy page
│   ├── components/             # React components
│   │   ├── eventForm.tsx      # Event creation form
│   │   ├── votingForm.tsx      # Voting interface
│   │   ├── resultsView.tsx     # Results display
│   │   ├── documentSelector.tsx
│   │   └── ui/                 # Reusable UI components
│   └── lib/                    # Core utilities
│       ├── craftApi.ts         # Craft API client
│       ├── crypto.ts           # Encryption/decryption
│       ├── tableParser.ts      # Markdown table parsing
│       └── eventHistory.ts     # Browser-local history
├── public/                     # Static assets
├── .env                        # Environment variables (not committed)
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies and scripts
```

## Environment Variables

### Required

- `MASTER_KEY`: Secret key used for encrypting/decrypting user API credentials. Must be a strong random string.

### Optional

- `NEXT_PUBLIC_TELEMETRY_DECK_APP_ID`: Telemetry Deck app ID for analytics. Only used if you want to track usage.

## How It Works

### Architecture

1. **Client-Side**: React components handle user interactions
2. **Server Actions**: Next.js Server Actions handle all API calls to Craft
3. **Encryption**: API credentials are encrypted server-side using AES-GCM
4. **Storage**: No database—all data lives in Craft documents

### Security

- API credentials are encrypted using AES-GCM encryption
- Encryption uses PBKDF2 key derivation (100,000 iterations)
- Credentials are only decrypted server-side when making API calls
- Decrypted values are immediately discarded after use
- No credentials are stored in databases or exposed to browsers

## Development

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

### Code Style

The project uses:

- ESLint for linting (Next.js config)
- Prettier for code formatting
- TypeScript for type safety

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source. Review the codebase to verify security and privacy practices.

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/AC40/craft-events).

## Acknowledgments

Built for Craft's Winter Challenge. Demonstrates secure integration with Craft's API while maintaining privacy-first principles.
