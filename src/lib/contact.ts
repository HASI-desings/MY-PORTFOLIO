import { site } from "@/content/site";

/**
 * Every contact URL is built here, and only here (Structure.md). Every parameter goes
 * through encodeURIComponent; the phone number is digits only (Security.md §3).
 */
export function mailtoUrl() {
  const { email } = site.contact;
  const subject = encodeURIComponent(site.prefill.emailSubject);
  const body = encodeURIComponent(site.prefill.emailBody);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function whatsappUrl() {
  const digits = site.contact.whatsappDigits.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(site.prefill.whatsapp)}`;
}

/**
 * Copies text with the Clipboard API, falling back to a hidden input + execCommand.
 * Returns false only if both fail (the caller then leaves the text selected for manual copy).
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or unsupported — try the legacy path.
  }
  try {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand("copy");
    input.remove();
    return ok;
  } catch {
    return false;
  }
}
