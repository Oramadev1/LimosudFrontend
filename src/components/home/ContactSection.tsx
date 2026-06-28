"use client";

import { FormEvent, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { submitContactMessage } from "@/lib/api/public";
import { ApiError } from "@/lib/api/client";
import { siteConfig } from "@/config/site";

export function ContactSection({ showHeading = true }: { showHeading?: boolean }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message,
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible d'envoyer le message. Réessayez dans un instant.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        {showHeading ? (
          <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
            Contact
          </h2>
        ) : null}

        <div className={`grid grid-cols-1 items-start gap-12 lg:grid-cols-2 ${showHeading ? "" : "pt-2"}`}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {sent ? (
              <p className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                Message envoyé ! Nous vous répondrons sous 24h.
              </p>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="Votre nom"
                className="w-full rounded-lg border border-[#E5E5E5] px-4 py-3 text-sm text-[#333] outline-none transition focus:border-[#E8192C]"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                placeholder="Votre email"
                className="w-full rounded-lg border border-[#E5E5E5] px-4 py-3 text-sm text-[#333] outline-none transition focus:border-[#E8192C]"
              />
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
              placeholder="Téléphone"
              className="w-full rounded-lg border border-[#E5E5E5] px-4 py-3 text-sm text-[#333] outline-none transition focus:border-[#E8192C]"
            />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
              placeholder="Votre message"
              className="w-full rounded-lg border border-[#E5E5E5] px-4 py-3 text-sm text-[#333] outline-none transition focus:border-[#E8192C]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-[#E8192C] py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Envoyer le message"}
            </button>
          </form>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1A1A1A]">Nos coordonnées</h3>

            {[
              {
                icon: MapPin,
                title: "Adresse",
                text: siteConfig.address,
              },
              {
                icon: Phone,
                title: "Téléphone",
                text: `${siteConfig.phone} · ${siteConfig.secondaryPhone}`,
              },
              {
                icon: Mail,
                title: "Email",
                text: siteConfig.contactEmail,
              },
              {
                icon: Clock,
                title: "Horaires",
                text: "Lun–Sam : 8h00–19h00",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#E8192C]" />
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{title}</p>
                  <p className="text-sm text-[#666]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
