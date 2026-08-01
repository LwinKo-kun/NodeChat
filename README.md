# NodeChat

> A lightweight distributed peer-to-peer (P2P) messaging application that demonstrates decentralized communication using public-key cryptography. Messages are exchanged directly between peers without passing through a central messaging server.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Data Flow](#data-flow)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Responsibilities](#api-responsibilities)
- [Security Model](#security-model)
- [Future Improvements](#future-improvements)
- [License](#license)

---

# Overview

NodeChat is an educational distributed systems project designed to demonstrate how secure communication can occur without relying on centralized message storage.

Instead of routing messages through a central server, each user runs a local Node.js daemon that communicates directly with other peers. A Laravel backend is used only for:

- User authentication
- User registration
- Peer discovery
- Public key distribution

The Laravel server **never receives, stores, or forwards chat messages**.

This architecture provides a simplified blueprint for larger decentralized systems such as secure mesh networks and distributed communication platforms.

---

# Key Features

- Distributed peer-to-peer messaging
- Direct encrypted communication between users
- RSA/ECC asymmetric encryption
- Local private key storage
- Public key publishing
- Laravel Sanctum authentication
- Peer discovery service
- React single-page application
- No centralized message storage
- Modular architecture for future expansion

---

# System Architecture

```
                    Authentication
                         &
                  Peer Discovery
                         │
                         ▼
          ┌────────────────────────────┐
          │ Laravel Backend            │
          │ PostgreSQL Database        │
          │----------------------------│
          │ • User Accounts            │
          │ • Public Keys              │
          │ • Peer Directory           │
          │ • Sanctum Authentication   │
          └──────────────┬─────────────┘
                         │
              REST API   │
                         │
          ┌──────────────▼─────────────┐
          │ React + Vite Frontend      │
          │----------------------------│
          │ Login                      │
          │ Registration               │
          │ Peer Browser               │
          │ Chat Interface             │
          └───────┬───────────┬────────┘
                  │           │
                  │           │
                  ▼           ▼
        ┌────────────────┐   ┌────────────────┐
        │ Node Daemon A  │──▶│ Node Daemon B  │
        │                │   │                │
        │ Private Key    │   │ Private Key    │
        │ HTTP Listener  │   │ HTTP Listener  │
        └────────────────┘   └────────────────┘

          Direct Encrypted P2P Communication
```

---

# Technology Stack

## Backend

- Laravel
- Laravel Sanctum
- PostgreSQL
- PHP

## Frontend

- React
- Vite
- JavaScript
- Axios

## P2P Daemon

- Node.js
- Native HTTP Server
- Node Crypto API

---

# Project Structure

```
NodeChat/
│
├── backend-laravel/
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── ...
│
├── frontend-react/
│   ├── src/
│   ├── public/
│   └── ...
│
├── p2p-daemon-node/
│   ├── server.js
│   ├── crypto/
│   ├── routes/
│   └── ...
│
└── README.md
```

---

# How It Works

## 1. User Authentication

Users register and log in through the Laravel backend.

Laravel provides:

- authentication
- API tokens
- user profile
- peer information

---

## 2. Key Generation

Each Node.js daemon automatically generates a cryptographic key pair when it starts.

```
Public Key
        │
        ▼
Published to Laravel

Private Key
        │
        ▼
Stored locally only
```

Only the public key is uploaded.

The private key never leaves the user's computer.

---

## 3. Peer Discovery

When a user opens the chat interface:

```
React
   │
   ▼
Laravel API
   │
   ▼
Returns:

- Username
- IP Address
- Port
- Public Key
```

The frontend now knows how to contact the target peer.

---

## 4. Message Encryption

Before sending a message:

```
Plain Text
      │
      ▼
Encrypt using recipient's Public Key
      │
      ▼
Ciphertext
```

Only the recipient can decrypt the message.

---

## 5. Direct Peer Communication

Instead of sending:

```
User A
   │
Laravel
   │
User B
```

PeerMail sends:

```
User A

   │

Direct HTTP

   │

User B
```

The Laravel server is completely bypassed.

---

## 6. Message Decryption

Upon receiving the encrypted payload:

```
Ciphertext
      │
      ▼
Private Key
      │
      ▼
Original Message
```

The plaintext becomes available only on the recipient's machine.

---

# Data Flow

```
Step 1

React
      │
      ▼
Request Peer Directory

      │
      ▼

Laravel
returns

IP Address
Port
Public Key

────────────────────────────

Step 2

React

encrypts message

using

Recipient Public Key

────────────────────────────

Step 3

Node Daemon A

────────────►

Node Daemon B

Direct HTTP Request

────────────────────────────

Step 4

Node Daemon B

decrypts message

using

Private Key

────────────────────────────

Step 5

React displays message
```

---

# Installation

Clone the repository.

```bash
git clone <your-repository-url> peermail

cd peermail
```

---

# Configuration

## Laravel

```bash
cd backend-laravel

composer install

cp .env.example .env

php artisan key:generate
```

Configure your PostgreSQL credentials inside `.env`.

Example:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=peermail
DB_USERNAME=postgres
DB_PASSWORD=password
```

Run migrations.

```bash
php artisan migrate
```

---

## Node Daemon

```bash
cd p2p-daemon-node

npm install
```

---

## React

```bash
cd frontend-react

npm install
```

---

# Running the Project

## 1. Start Laravel

```bash
cd backend-laravel

php artisan serve --port=8000
```

---

## 2. Start Node Daemon

```bash
cd p2p-daemon-node

node server.js
```

---

## 3. Start React

```bash
cd frontend-react

npm run dev
```

---

The application should now be running:

| Service | URL |
|----------|-----|
| React | http://localhost:5173 |
| Laravel | http://localhost:8000 |
| Node Daemon | Configurable (example: http://localhost:3001) |

---

# API Responsibilities

## Laravel

Responsible for:

- User registration
- Login
- Authentication
- Peer discovery
- Public key storage
- Network address storage

Not responsible for:

- Chat messages
- Message routing
- Message storage
- Encryption

---

## Node Daemon

Responsible for:

- Key generation
- Message encryption
- Message decryption
- Signature verification
- HTTP communication
- Local private key storage

---

## React

Responsible for:

- User interface
- Authentication screens
- Peer browser
- Chat interface
- Sending encrypted payloads

---

# Security Model

PeerMail uses asymmetric cryptography.

```
Sender

Recipient Public Key

        │

Encrypt

        │

Ciphertext

        │

────────────►

Recipient

        │

Private Key

        │

Decrypt

        ▼

Plain Text
```

### Security Properties

- Private keys never leave the local machine.
- Laravel stores only public keys.
- Messages are never stored centrally.
- Communication occurs directly between peers.
- Encryption occurs before transmission.

---

# Future Improvements

Potential enhancements include:

- End-to-end digital signatures
- Message acknowledgements
- Offline message relay
- NAT traversal (STUN/TURN)
- UDP transport
- WebRTC data channels
- Group messaging
- Message history persistence
- Contact management
- File transfer
- Presence detection
- Docker deployment
- TLS-secured peer communication
- IPv6 support

---

# License

This project is intended for educational purposes and distributed systems research.

Feel free to modify, extend, and experiment with the architecture.
