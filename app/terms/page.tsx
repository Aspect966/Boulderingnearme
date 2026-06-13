import type { Metadata } from "next";
import {
  LEGAL,
  LegalDocument,
  LegalSection,
} from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Terms of Service & User Agreement",
  description:
    "Terms of Service and User Agreement governing use of BoulderingNearMe.com.",
};

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service & User Agreement">
      <LegalSection id="agreement" title="1. Agreement to Terms">
        <p>
          These Terms of Service and User Agreement (collectively, the
          &ldquo;Terms&rdquo;) constitute a binding legal agreement between you
          (&ldquo;you,&rdquo; &ldquo;User&rdquo;) and the operator of{" "}
          {LEGAL.domain} (&ldquo;{LEGAL.siteName},&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing, browsing, or
          using {LEGAL.domain} (the &ldquo;Service&rdquo;), including creating
          an account, submitting content, or using geolocation features, you
          acknowledge that you have read, understood, and agree to be bound by
          these Terms and our{" "}
          <a href="/privacy" className="font-medium text-amber-700 hover:underline">
            Privacy Policy
          </a>
          , which is incorporated herein by reference.
        </p>
        <p>
          If you do not agree to these Terms, you must not access or use the
          Service. Continued use after we post revised Terms constitutes
          acceptance of those changes.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>
          You must be at least thirteen (13) years of age to use the Service. If
          you are between 13 and the age of majority in your jurisdiction, you
          may use the Service only with the consent and supervision of a parent
          or legal guardian who agrees to these Terms on your behalf.
        </p>
        <p>
          You represent that you have the legal capacity to enter into this
          agreement, that you are not barred from using the Service under
          applicable law, and that all registration information you submit is
          accurate and current.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="3. Accounts & Security">
        <p>
          Certain features require an account. You are responsible for
          maintaining the confidentiality of your credentials and for all
          activity under your account. Notify us promptly at{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>{" "}
          if you suspect unauthorized access.
        </p>
        <p>
          We may suspend or terminate accounts that violate these Terms, pose
          security risks, or remain inactive for extended periods, subject to
          applicable law.
        </p>
      </LegalSection>

      <LegalSection id="service" title="4. Description of the Service">
        <p>
          {LEGAL.siteName} is a community platform for discovering, documenting,
          and discussing outdoor bouldering locations. The Service may include
          user-submitted boulder listings, photographs, difficulty ratings,
          comments, geolocation-based sorting, and consensus grade calculations.
        </p>
        <p>
          We may modify, suspend, or discontinue any part of the Service at any
          time, with or without notice, to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection id="user-content" title="5. User-Generated Content">
        <p>
          You may submit content including text, images, ratings, coordinates,
          and comments (&ldquo;User Content&rdquo;). You retain ownership of
          your User Content, subject to the license granted below.
        </p>
        <p>You represent and warrant that:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>You own or have all rights necessary to submit the User Content;</li>
          <li>
            Your User Content does not infringe intellectual property, privacy,
            publicity, or other rights of any person or entity;
          </li>
          <li>
            Your User Content complies with these Terms and all applicable local,
            state, national, and international laws;
          </li>
          <li>
            Location data and descriptions you provide are submitted in good
            faith and you understand they may affect others&apos; safety decisions.
          </li>
        </ul>
        <p>
          We do not endorse User Content and are not responsible for its accuracy,
          completeness, legality, or safety implications.
        </p>
      </LegalSection>

      <LegalSection id="license" title="6. License Grant">
        <p>
          By submitting User Content, you grant {LEGAL.siteName} a worldwide,
          non-exclusive, royalty-free, sublicensable, and transferable license
          to use, host, store, reproduce, modify (for formatting and technical
          purposes), display, and distribute your User Content in connection
          with operating, promoting, and improving the Service.
        </p>
        <p>
          This license continues for commercially reasonable time after you
          remove content where backups, caching, or legal obligations require
          retention.
        </p>
      </LegalSection>

      <LegalSection id="prohibited" title="7. Prohibited Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Violate any applicable law, regulation, or third-party right;</li>
          <li>
            Post false, misleading, or dangerous location or safety information;
          </li>
          <li>
            Upload malware, scrape the Service without permission, or interfere
            with its operation;
          </li>
          <li>Harass, threaten, defame, or discriminate against others;</li>
          <li>
            Impersonate any person or misrepresent your affiliation with any
            entity;
          </li>
          <li>
            Post content that is unlawful, obscene, exploitative of minors, or
            promotes illegal activity;
          </li>
          <li>
            Circumvent access controls, rate limits, or security measures;
          </li>
          <li>
            Use the Service for commercial solicitation without our prior written
            consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="outdoor-risk"
        title="8. Outdoor Recreation, Assumption of Risk & Safety"
      >
        <p>
          <strong className="text-stone-900">
            Bouldering and outdoor recreation involve inherent and serious
            risks, including injury, permanent disability, and death.
          </strong>{" "}
          Conditions change due to weather, rock quality, wildlife, land access
          rules, and other factors beyond our control.
        </p>
        <p>
          THE SERVICE IS AN INFORMATIONAL COMMUNITY TOOL ONLY. IT IS NOT A
          SUBSTITUTE FOR PROFESSIONAL GUIDANCE, GUIDEBOOKS, LOCAL KNOWLEDGE,
          PROPER TRAINING, APPROPRIATE EQUIPMENT, OR YOUR OWN JUDGMENT.
        </p>
        <p>
          You voluntarily assume all risks associated with visiting, locating,
          or climbing at any area referenced on the Service. You agree that{" "}
          {LEGAL.siteName}, its operators, contributors, and affiliates are not
          responsible for accidents, injuries, property damage, fines, trespass
          claims, environmental harm, or other losses arising from your outdoor
          activities or reliance on User Content.
        </p>
        <p>
          You are solely responsible for verifying land ownership, access
          permissions, seasonal closures, local regulations, environmental
          protections, and applicable climbing ethics before visiting any
          location.
        </p>
      </LegalSection>

      <LegalSection id="grades" title="9. Grades, Ratings & No Professional Advice">
        <p>
          Difficulty ratings, consensus grades, comments, and beta on the
          Service reflect community opinions and algorithms, not professional
          assessments. Grades may be wrong, outdated, or inappropriate for your
          skill level.
        </p>
        <p>
          Nothing on the Service constitutes professional climbing instruction,
          guide services, engineering survey, or safety certification. Always
          assess conditions and your abilities independently.
        </p>
      </LegalSection>

      <LegalSection id="location" title="10. Location & Mapping Disclaimer">
        <p>
          GPS coordinates, maps, and &ldquo;near me&rdquo; features are provided
          for convenience and may be inaccurate. Device permissions, network
          conditions, and user-submitted data can affect results.
        </p>
        <p>
          Do not rely solely on the Service for navigation in remote or hazardous
          terrain. Use appropriate maps, communication tools, and safety
          planning.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="11. Intellectual Property">
        <p>
          The Service, including its design, branding, software, and original
          content (excluding User Content), is owned by {LEGAL.siteName} or its
          licensors and protected by United States and international intellectual
          property laws.
        </p>
        <p>
          Except as expressly permitted, you may not copy, modify, distribute,
          sell, or create derivative works from the Service without our prior
          written consent.
        </p>
      </LegalSection>

      <LegalSection id="dmca" title="12. Copyright & DMCA Policy">
        <p>
          We respect intellectual property rights. If you believe content on the
          Service infringes your copyright, send a notice to{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>{" "}
          including: (1) identification of the copyrighted work; (2)
          identification of the infringing material and its location; (3) your
          contact information; (4) a statement of good-faith belief; (5) a
          statement under penalty of perjury that your notice is accurate and
          you are authorized to act; and (6) your physical or electronic
          signature.
        </p>
        <p>
          Repeat infringers may have their accounts terminated consistent with
          the Digital Millennium Copyright Act (17 U.S.C. § 512) and applicable
          law.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="13. Privacy & Data Protection">
        <p>
          Our collection and use of personal information is described in our{" "}
          <a href="/privacy" className="font-medium text-amber-700 hover:underline">
            Privacy Policy
          </a>
          . That policy addresses requirements under U.S. federal law and state
          privacy statutes (including California, Virginia, Colorado, Connecticut,
          Utah, and other states with comprehensive privacy laws), the EU General
          Data Protection Regulation (GDPR), the UK GDPR, and other applicable
          frameworks.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="14. Third-Party Services">
        <p>
          The Service relies on third-party providers (such as hosting,
          authentication, database, and storage services). Your use of those
          services may be subject to their terms and privacy practices. We are
          not responsible for third-party services outside our reasonable
          control.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="15. Changes to Terms">
        <p>
          We may update these Terms to reflect legal, technical, or business
          changes. Material changes will be posted on this page with an updated
          effective date. Where required by law, we will provide additional
          notice or request renewed consent.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="16. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate your access if you breach these Terms or if required for
          legal, security, or operational reasons. Sections that by their nature
          should survive termination will survive, including disclaimers,
          limitations of liability, indemnification, and dispute provisions.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="17. Disclaimers of Warranties">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS
          PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
          WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
          INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
        </p>
        <p>
          WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE,
          ERROR-FREE, OR FREE OF HARMFUL COMPONENTS, OR THAT USER CONTENT OR
          LOCATION DATA WILL BE ACCURATE OR RELIABLE.
        </p>
        <p>
          Some jurisdictions do not allow exclusion of certain warranties, so
          some of the above exclusions may not apply to you.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="18. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL{" "}
          {LEGAL.siteName}, ITS OWNERS, OPERATORS, OFFICERS, EMPLOYEES,
          CONTRACTORS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR
          RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF WE
          HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY
          CLAIM ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS WILL NOT
          EXCEED THE GREATER OF (A) ONE HUNDRED U.S. DOLLARS (US $100) OR (B)
          THE AMOUNT YOU PAID US, IF ANY, IN THE TWELVE (12) MONTHS BEFORE THE
          EVENT GIVING RISE TO THE CLAIM.
        </p>
        <p>
          Nothing in these Terms limits liability that cannot be limited under
          applicable law, including liability for fraud or willful misconduct
          where prohibited.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" title="19. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless {LEGAL.siteName} and
          its operators from and against any claims, damages, losses,
          liabilities, costs, and expenses (including reasonable attorneys&apos;
          fees) arising out of or related to: (a) your use of the Service; (b)
          your User Content; (c) your violation of these Terms; (d) your
          violation of any law or third-party right; or (e) injury, death, or
          property damage connected to your outdoor activities or reliance on
          information from the Service.
        </p>
      </LegalSection>

      <LegalSection id="disputes" title="20. Dispute Resolution & Governing Law">
        <p>
          These Terms are governed by the laws of the United States and, to the
          extent not preempted by federal law, the laws of the state in which the
          operator of {LEGAL.siteName} maintains its principal place of
          business, without regard to conflict-of-law rules.
        </p>
        <p>
          Before filing a claim, you agree to contact us at{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="font-medium text-amber-700 hover:underline"
          >
            {LEGAL.contactEmail}
          </a>{" "}
          and attempt to resolve the dispute informally for at least thirty (30)
          days.
        </p>
        <p>
          Except where prohibited by applicable law, you and {LEGAL.siteName}{" "}
          agree that any dispute not resolved informally will be brought
          exclusively in the state or federal courts located in the United
          States, and you consent to personal jurisdiction in those courts.
        </p>
        <p>
          If you are a consumer in the European Economic Area or United Kingdom,
          you may also have mandatory rights under local law, including the
          right to bring proceedings in your country of residence where required
          by applicable consumer protection law.
        </p>
      </LegalSection>

      <LegalSection id="international" title="21. International Users">
        <p>
          The Service is operated from the United States. If you access the
          Service from outside the United States, you do so at your own risk and
          are responsible for compliance with local laws. Personal data
          transfers are described in our Privacy Policy, including safeguards
          relevant to GDPR and UK data protection requirements.
        </p>
      </LegalSection>

      <LegalSection id="misc" title="22. General Provisions">
        <p>
          <strong className="text-stone-900">Severability:</strong> If any
          provision is held invalid, the remaining provisions remain in effect.
        </p>
        <p>
          <strong className="text-stone-900">No waiver:</strong> Failure to
          enforce a provision is not a waiver of future enforcement.
        </p>
        <p>
          <strong className="text-stone-900">Assignment:</strong> You may not
          assign these Terms without our consent. We may assign these Terms in
          connection with a merger, acquisition, or asset sale.
        </p>
        <p>
          <strong className="text-stone-900">Entire agreement:</strong> These
          Terms and the Privacy Policy constitute the entire agreement between
          you and {LEGAL.siteName} regarding the Service.
        </p>
        <p>
          <strong className="text-stone-900">Electronic communications:</strong>{" "}
          You consent to receive communications electronically and agree that
          electronic agreements satisfy any legal writing requirements to the
          extent permitted by law, including the U.S. Electronic Signatures in
          Global and National Commerce Act (E-SIGN) and applicable state
          counterparts.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="23. Contact">
        <p>
          For questions about these Terms, contact{" "}
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
