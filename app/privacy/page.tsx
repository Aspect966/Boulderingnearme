import type { Metadata } from "next";
import {
  LEGAL,
  LegalDocument,
  LegalSection,
} from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BoulderingNearMe.com collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <LegalSection id="introduction" title="1. Introduction">
        <p>
          {LEGAL.siteName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) operates {LEGAL.domain} (the &ldquo;Service&rdquo;).
          This Privacy Policy explains how we collect, use, disclose, and
          protect personal information when you visit or use the Service.
        </p>
        <p>
          By using the Service, you acknowledge this Privacy Policy. If you do
          not agree, please do not use the Service. This policy works together
          with our{" "}
          <a href="/terms" className="font-medium text-amber-700 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="collection" title="2. Information We Collect">
        <p>
          <strong className="text-stone-900">Information you provide:</strong>{" "}
          account email, password (stored in hashed form by our authentication
          provider), display name, boulder listings, descriptions, photographs,
          difficulty ratings, comments, and any other content you submit.
        </p>
        <p>
          <strong className="text-stone-900">Information collected automatically:</strong>{" "}
          device and browser type, IP address, general usage data, cookies or
          similar technologies, and approximate location when you use
          &ldquo;near me&rdquo; or similar features (with your device
          permission).
        </p>
        <p>
          <strong className="text-stone-900">Information from third parties:</strong>{" "}
          we use service providers for authentication, hosting, database, and
          file storage. Those providers may process personal information on our
          behalf as described below.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. How We Use Information">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Provide, operate, and maintain the Service;</li>
          <li>Create and manage user accounts;</li>
          <li>Display user-submitted boulders, photos, ratings, and comments;</li>
          <li>Calculate and display consensus grades;</li>
          <li>Enable geolocation-based features you request;</li>
          <li>Communicate with you about the Service;</li>
          <li>Detect, prevent, and address fraud, abuse, and security issues;</li>
          <li>Comply with legal obligations and enforce our Terms;</li>
          <li>Improve the Service through analytics and troubleshooting.</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-bases" title="4. Legal Bases (EEA, UK & Similar Jurisdictions)">
        <p>
          If you are in the European Economic Area, United Kingdom, or a
          jurisdiction with similar requirements, we process personal data based
          on:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-stone-900">Contract:</strong> to provide the
            Service you request, including account features;
          </li>
          <li>
            <strong className="text-stone-900">Legitimate interests:</strong> to
            secure, improve, and promote the Service, balanced against your
            rights;
          </li>
          <li>
            <strong className="text-stone-900">Consent:</strong> where required,
            such as for certain optional location features or non-essential
            cookies;
          </li>
          <li>
            <strong className="text-stone-900">Legal obligation:</strong> when
            we must comply with applicable law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="5. How We Share Information">
        <p>We may share personal information with:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-stone-900">Service providers</strong> who
            assist with hosting, infrastructure, authentication, storage, and
            analytics, under contractual confidentiality and data protection
            obligations;
          </li>
          <li>
            <strong className="text-stone-900">Other users</strong> when you
            submit public content (e.g., display name on comments, uploaded
            photos, boulder listings);
          </li>
          <li>
            <strong className="text-stone-900">Legal and safety recipients</strong>{" "}
            when required by law, court order, or governmental request, or when
            we believe disclosure is necessary to protect rights, safety, or
            investigate fraud or security issues;
          </li>
          <li>
            <strong className="text-stone-900">Business transfers</strong> in
            connection with a merger, acquisition, or sale of assets, subject to
            this Privacy Policy.
          </li>
        </ul>
        <p>We do not sell your personal information for money.</p>
      </LegalSection>

      <LegalSection id="cookies" title="6. Cookies & Similar Technologies">
        <p>
          We and our providers may use cookies, local storage, and similar
          technologies for authentication, session management, preferences, and
          analytics. You can control cookies through your browser settings.
          Disabling certain cookies may limit Service functionality.
        </p>
        <p>
          Where required by law (including EU ePrivacy rules and certain U.S.
          state laws), we will obtain consent before using non-essential cookies
          or similar tracking technologies.
        </p>
      </LegalSection>

      <LegalSection id="geolocation" title="7. Geolocation Data">
        <p>
          &ldquo;Near me&rdquo; and related features may request access to your
          device&apos;s location. We use this data only to provide the requested
          functionality (such as sorting nearby boulders) and do not continuously
          track your location in the background unless clearly disclosed and
          consented to.
        </p>
        <p>
          You can revoke location permissions through your device or browser
          settings at any time.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="8. Data Retention">
        <p>
          We retain personal information for as long as needed to provide the
          Service, comply with legal obligations, resolve disputes, and enforce
          agreements. When information is no longer needed, we delete or
          anonymize it within a reasonable period, subject to backup and legal
          retention requirements.
        </p>
      </LegalSection>

      <LegalSection id="security" title="9. Security">
        <p>
          We implement reasonable administrative, technical, and organizational
          safeguards designed to protect personal information. No method of
          transmission or storage is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection id="us-rights" title="10. U.S. State Privacy Rights">
        <p>
          Depending on where you live, you may have rights under state privacy
          laws, including but not limited to:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-stone-900">California (CCPA/CPRA):</strong>{" "}
            rights to know, access, delete, correct, and opt out of certain
            sharing; non-discrimination for exercising rights;
          </li>
          <li>
            <strong className="text-stone-900">Virginia (VCDPA), Colorado
            (CPA), Connecticut (CTDPA), Utah (UCPA), and other state laws:</strong>{" "}
            rights to access, correct, delete, obtain a copy, and opt out of
            targeted advertising, sale, or certain profiling where applicable.
          </li>
        </ul>
        <p>
          To exercise applicable rights, email{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          . We will verify your request as required by law. You may designate an
          authorized agent where permitted. California residents may also contact
          us regarding Shine the Light requests as applicable.
        </p>
      </LegalSection>

      <LegalSection id="gdpr-rights" title="11. EEA & UK Rights (GDPR)">
        <p>If GDPR or UK GDPR applies to you, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Access and receive a copy of your personal data;</li>
          <li>Rectify inaccurate data;</li>
          <li>Request erasure in certain circumstances;</li>
          <li>Restrict or object to processing in certain circumstances;</li>
          <li>Data portability where applicable;</li>
          <li>Withdraw consent where processing is consent-based;</li>
          <li>
            Lodge a complaint with your local supervisory authority.
          </li>
        </ul>
        <p>
          Contact{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>{" "}
          to exercise these rights.
        </p>
      </LegalSection>

      <LegalSection id="transfers" title="12. International Data Transfers">
        <p>
          We are based in the United States. If you access the Service from
          outside the U.S., your information may be transferred to, stored in,
          and processed in the United States or other countries that may have
          different data protection laws.
        </p>
        <p>
          Where required, we rely on appropriate safeguards such as Standard
          Contractual Clauses or equivalent mechanisms for cross-border transfers.
        </p>
      </LegalSection>

      <LegalSection id="children" title="13. Children's Privacy">
        <p>
          The Service is not directed to children under 13, and we do not
          knowingly collect personal information from children under 13 in
          violation of the U.S. Children&apos;s Online Privacy Protection Act
          (COPPA). If you believe we have collected information from a child
          under 13, contact us and we will take appropriate steps to delete it.
        </p>
        <p>
          Users between 13 and the age of majority should use the Service only
          with parental or guardian consent where required by local law.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. The effective
          date at the top of this page indicates when it was last revised.
          Material changes will be posted on the Service, and where required by
          law we will provide additional notice or obtain consent.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact Us">
        <p>
          For privacy questions or to exercise your rights, contact{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
