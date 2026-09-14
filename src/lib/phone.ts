// Genius fx logs users in by phone number, but Better Auth's email/password
// provider needs an email. We derive a stable synthetic email from the phone
// number so the UI can keep the "Nomor HP" label while auth works normally.

export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "")
}

export function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@geniusfx.app`
}

export function emailToPhone(email: string): string {
  return email.replace(/@geniusfx\.app$/, "")
}
