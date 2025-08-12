# Recerts.org: An impact mechanism design journal

The goal of this hypercerts platform is to enable continuous funding for all of our project partners. Funders will be able to fund any of our partner projects' impact work, and receive a fraction of that hypercert (proportional to the amount that they have funded) in return.

Visit the journal at [recerts.org](https://recerts.org).

Partner projects define their work scope, cost and timeline, and funders anywhere in the world can fund this project at any time.

This platform will have impact metric integrations from various sources, including but not limited to:

- The green globe to show geospatial and environmental metrics
- Metrics garden for impact reviews.
- Karma.gap for milestones
- The projects themselves for any additional data that they want to add.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/) programming language
- [Next.js](https://nextjs.org/) full-stack framework
- [TailwindCSS](https://tailwindcss.com/) css framework
- [shadcn/ui](https://ui.shadcn.com/) ui components
- [Hypercerts](https://hypercerts.org/) tokenized impact certification
- [ethers.js](https://docs.ethers.org/v6/) Ethereum API library
- [viem](https://viem.sh/) TypeScript interface for Ethereum
- [Wagmi](https://wagmi.sh/) interface for Ethereum
- [WalletConnect](https://walletconnect.com/) crypto wallet connector
- [Biome](https://biomejs.dev/) formatter/linter

We recommend [direnv](https://direnv.net/) for managing your environment variables

## Getting Started

### Prerequisites

Node.js: this project requires installation of Node.js 18.17 or later. [Next Documentation](https://nextjs.org/docs/getting-started/installation)

Ethereum Sepolia: The Hypercert Marketplace is currently deployed on Sepolia Testnet. To interact with recerts, you'll need to connect to Sepolia Testnet and obtain SepoliaETH from a [testnet token faucet](https://faucetlink.to/sepolia).

### Network Configuration

| Parameter                     | Value                           |
| ----------------------------- | ------------------------------- |
| Network Name                  | `Sepolia test network`          |
| RPC URL                       | `https://sepolia.infura.io`     |
| Chain ID                      | `11155111`                      |
| Currency Symbol               | `SepoliaETH`                    |
| Block Explorer URL (Optional) | `https://sepolia.etherscan.io/` |

### Run Locally

#### Clone the repository

```bash
  git clone git@github.com:GainForest/hypercerts-platform.git
```

#### Install dependencies

```bash
  cd app && bun install
```

#### Start the server

```bash
  bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/reports/page.tsx`.

## Helpful References

- [TypeScript Documentation](https://www.typescriptlang.org/docs/) TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Next.js Documentation](https://next.org/docs/) Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.
  Under the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more. This allows focus on building the application instead of spending time with configuration.
- [Tailwind Documentation](https://tailwindcss.com/docs/installation) Tailwind CSS is a utility-first CSS framework for rapidly building modern websites without ever leaving your HTML. A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.
- [Shadcn Documentation](https://ui.shadcn.com/docs) Shadcn provides beautifully designed components that you can copy and paste into your apps and enables you to bootstrap them via cli. It 5x's productivity and allows focus on what matters most, business logic + features.
- [Hypercerts Documentation](https://hypercerts.org/docs/) Hypercerts create this interoperability by serving as a single, open, shared, decentralized database for impact funding mechanisms. A single hypercert is a semi-fungible token that accounts for work that is supposed to be impactful and whose ownership is fractionizable and transferable (under specific conditions). Hypercerts do not impose any specific funding mechanisms but provide baseline invariant guarantees such that claims will not be forgotten as different mechanisms come into and out of fashion. This is also why hypercerts are especially useful for any retrospective funding mechanisms – funding can be applied to claims of the past.
- [ethers.js Documentation](https://docs.ethers.org/v6/) The ethers.js library aims to be a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem. It is often used to create decentralized applications (dapps), wallets (such as MetaMask and Tally) and other tools and simple scripts that require reading and writing to the blockchain.
- [viem](https://viem.sh/docs/introduction) Viem is a TypeScript Interface for Ethereum that provides low-level stateless primitives for interacting with Ethereum. It delivers a great developer experience through modular and composable APIs, comprehensive documentation, and automatic type safety and inference.
- [WalletConnect Documentation](https://docs.walletconnect.com/) The Web3Modal SDK allows you to easily connect your Web3 app with wallets. It provides a simple and intuitive interface for requesting actions such as signing transactions and interacting with smart contracts on the blockchain.
