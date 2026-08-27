# Lexa — Living Specification

## What it does
Lexa is a public Brazilian legal directory. Visitors can search offices and lawyers by name, legal specialty, and city; open a detailed profile; call the listed phone; open a map location; and start a WhatsApp conversation with a pre-filled message.

## Data model
Profiles contain: `id`, `name`, `type`, `specialties[]`, `city`, `address`, `phone`, `whatsapp`, `hours`, `description`, `photo`, and `featured`. Six representative profiles are seeded in `script.js`. New profiles can be added from the professional form and are stored in browser `localStorage` for this static demonstration.

## Key flows
1. Home → “Encontrar um advogado” → directory search/filter → profile card.
2. Profile card → detail dialog → phone, Google Maps location, or WhatsApp click-to-chat.
3. “Adicionar perfil” → profile form → optional image upload → publish → profile appears in directory and persists locally.

## Integrations and limitations
- WhatsApp click-to-chat is implemented with `https://wa.me/` and URL-encoded text.
- The official WhatsApp Business Cloud API is **MOCKED** in this static build: no Meta token is stored or used. Enabling programmatic sending requires a secure backend and Meta credentials (`PHONE_NUMBER_ID`, access token, app secret, verify token).
- Photo uploads are **MOCKED AS LOCAL BROWSER STORAGE** and are not uploaded to a server.
- Location uses a Google Maps search URL, no maps API key required.

## Auth and roles
There is no authentication in this public demo. All visitors can search profiles; the add-profile form is a local demonstration and is not a protected professional dashboard.