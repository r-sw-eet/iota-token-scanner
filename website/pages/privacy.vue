<script setup lang="ts">
useHead({ title: 'Privacy Policy — IOTA Trade Scanner' })
</script>

<template>
  <div class="p-6 md:p-10 max-w-3xl mx-auto">
    <NuxtLink to="/" class="text-scanner-accent text-sm hover:underline mb-6 inline-block">&larr; Back</NuxtLink>

    <h1 class="text-2xl font-bold text-[#f4f4f5] mb-1">Privacy Policy</h1>
    <p class="text-sm text-[#52525b] mb-8">Data Protection Declaration (GDPR)</p>

    <div class="space-y-8 text-sm text-[#a1a1aa]">
      <section>
        <p>
          Unless stated otherwise below, providing your personal data is neither legally nor contractually obligatory, nor required for conclusion of a contract. You are
          not obliged to provide your data, not providing it will have no consequences. This only applies as long as the processing procedures below do not state
          otherwise.
        </p>
        <p class="mt-2">"Personal data" is any information relating to an identified or identifiable natural person.</p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Server Log Files &amp; Retention</h2>
        <p>
          Each time you access our website, a server log file is created. This may include your IP address, request timestamps, requested URL, user-agent string and
          referrer URL. We retain server logs for a minimum of 7 and a maximum of 14 days, after which they are automatically deleted.
        </p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Data Subject Rights</h2>
        <p>Under Articles 15-21 of the EU General Data Protection Regulation (GDPR), you have the right to:</p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-[#71717a]">
          <li>Request confirmation as to whether and what personal data we process about you (Art. 15 GDPR)</li>
          <li>Obtain correction of inaccurate data or completion of incomplete data (Art. 16 GDPR)</li>
          <li>Request deletion ("right to be forgotten") (Art. 17 GDPR)</li>
          <li>Request restriction of processing (Art. 18 GDPR)</li>
          <li>Receive your personal data in a structured, commonly used and machine-readable format, and transmit it to another controller ("data portability") (Art. 20 GDPR)</li>
          <li>Object to processing based on our legitimate interests (Art. 21 (1) GDPR)</li>
        </ul>
        <p class="mt-3">To exercise any of these rights, please contact us at hello@iota-trade-scanner.net.</p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Cookies &amp; Browser Storage</h2>
        <p>
          We do not use cookies or comparable tracking technologies. Instead, any site preferences (e.g. theme or particle toggles) are stored locally in your browser's
          localStorage and are deleted automatically when you clear your browser data.
        </p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">External Data Sources</h2>
        <p>
          The website fetches on-chain data from public APIs to display network metrics and ecosystem information.
          These requests are made server-side by the backend — no personal data of website visitors is transmitted to these services:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-[#71717a]">
          <li>IOTA Mainnet RPC (api.mainnet.iota.cafe)</li>
          <li>IOTA Mainnet GraphQL (graphql.mainnet.iota.cafe)</li>
          <li>DefiLlama API (api.llama.fi)</li>
        </ul>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Web Hosting</h2>
        <p>
          This site is hosted by Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany. We have concluded a Data Processing Agreement with Hetzner under
          Art. 28 GDPR to ensure your data is processed in accordance with the GDPR.
        </p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Data Protection Officer</h2>
        <p>No Data Protection Officer has been appointed, as one is not required by law for the processing activities described.</p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Supervisory Authority</h2>
        <p>
          Under the GDPR, the competent supervisory authority is determined by the location of the party responsible for processing personal data — most by server
          location.
        </p>
      </section>

      <section>
        <h2 class="text-base font-semibold text-[#f4f4f5] mb-2">Contact</h2>
        <p>
          Ralf Süss<br />
          Selkentrop 23<br />
          57392 Schmallenberg<br />
          Germany<br />
          Email: hello@iota-trade-scanner.net
        </p>
      </section>
    </div>
  </div>
</template>
