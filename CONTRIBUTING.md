# Contributing to RyperDeck

Thank you for your interest in contributing to RyperDeck! Whether you are fixing bugs, improving docs, adding new macro presets, or suggesting features, your help is appreciated.

---

## 🌟 How to Contribute

### 1. Reporting Bugs
- Use the **Report a Bug** modal on the website or open an issue on GitHub.
- Include your OS version (Windows 10/11, Android version), steps to reproduce, and any relevant logs or screenshots.

### 2. Suggesting Features
- Use the **Request a Feature** form on the website or open a feature request issue.
- Explain the workflow improvement or integration you'd like to see.

### 3. Submitting Pull Requests
1. **Fork the repository** to your own GitHub account.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/ryperdeck.git
   cd ryperdeck
   ```
3. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Run the local development server**:
   ```bash
   npm run dev
   ```
6. **Verify build before committing**:
   ```bash
   npm run build
   ```
   Ensure TypeScript passes with zero errors.
7. **Commit and push**:
   ```bash
   git commit -m "feat: add support for custom macro animations"
   git push origin feature/my-new-feature
   ```
8. **Open a Pull Request** to the `main` branch.

---

## 🎨 Code Style & Guidelines
- **TypeScript**: Strict type checking; avoid `any` wherever possible.
- **Tailwind CSS**: Follow mobile-first utility classes and glassmorphism design tokens.
- **Components**: Modular, reusable components under `src/components/`.
- **Security**: Never commit API keys, service role credentials, or personal secrets.

---

## 📜 License
By contributing to RyperDeck, you agree that your contributions will be licensed under the [MIT License](LICENSE).
