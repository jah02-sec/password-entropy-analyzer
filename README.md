# Password Entropy Analyzer

**Live Demo:** https://jah02-sec.github.io/password-entropy-analyzer/

A client-side password strength analyzer that estimates password entropy based on length and effective character set size.  
The tool provides real-time feedback and visualizes password strength without storing or transmitting any data.

---

## Overview

This project demonstrates how password strength can be **quantitatively estimated** using entropy rather than arbitrary scoring systems.

Key goals:
- Clear and explainable security logic
- No backend, no storage, no network requests
- Transparent assumptions and limitations

The password is analyzed **entirely within the browser** and never leaves the client.

---

## Features

- Live password strength analysis
- Entropy calculation in bits
- Effective character set size detection
- Visual strength meter
- Detection of common weak patterns:
  - repeated characters
  - simple sequences
  - common passwords
- Password visibility toggle
- Accessible and responsive UI
