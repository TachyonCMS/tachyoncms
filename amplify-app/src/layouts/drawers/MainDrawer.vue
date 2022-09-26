<template>
  <q-list bordered>
    <q-item-label header class="text-body1">TachyonCMS Benefits</q-item-label>
    <q-separator></q-separator>
    <q-expansion-item group="benefits" icon="code" label="Open Source">
      <q-card>
        <q-card-section>
          All of our code is open source and available on
          <a href="https://github.com/TachyonCMS/tachyoncms" class="nolink"
            >GitHub</a
          >.
          <ul>
            <li>Fork and customize the code.</li>
            <li>Run your own local server for development.</li>
            <li>Provide an internal, company CMS.</li>
            <li>Deploy your own SaaS offering.</li>
          </ul>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator></q-separator>

    <q-expansion-item
      group="benefits"
      icon="mdi-hexagon-multiple"
      label="Multi-Mode Editor Client"
    >
      <q-card>
        <q-card-section>
          The same user interface is used across the clients regardless of the
          backend.
          <ul>
            <li>
              Our hosted offering can manage cloud content, for a small fee.
            </li>
            <li>
              The same hosted offering can also manage local projects, for free.
            </li>
            <li>
              The Electron version allows accessing other OS services locally,
              as well as editing both free local projects and paid cloud
              content.
            </li>
            <li>
              The Android version will access the same cloud API as our hosted
              offering.
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator></q-separator>

    <q-expansion-item
      group="benefits"
      icon="mdi-currency-usd-off"
      label="Local Projects are Free"
      default-opened
    >
      <q-card>
        <q-card-section>
          Local projects are free because they remove a majority of the cost on
          our end.
          <ul>
            <li>No storage cost, you are providing the disk space.</li>
            <li>
              No ingress or egress network traffic for content while editing.
            </li>
            <li>No content delivery or global replication costs.</li>
            <li>No data backup or encryption is needed.</li>
          </ul>
          <p>We also benefit by having more users to discover bugs earlier.</p>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator></q-separator>

    <q-expansion-item
      group="benefits"
      icon="mdi-folder-multiple-plus-outline"
      label="Unlimited Local Projects"
      default-opened
    >
      <q-card>
        <q-card-section>
          <p>
            Because local projects cost us little and provide some benefit we
            don't put any limit on the number or size.
          </p>
          <p>
            Unlike most freemiums that result in a loss until the user converts
            to a paid customer, the low costs will allow us to continue this
            offer indefinitely without straining our finances.
          </p>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator></q-separator>

    <q-expansion-item
      group="benefits"
      icon="mdi-tools"
      label="Best-in-Class Tools"
    >
      <q-card>
        <q-card-section>
          <p>
            We aren't looking to reinvent the wheel, we want to make the best
            vehicle for managing and delivering your content. TachyonCMS is
            built on top of the best existing, cutting edge web technolgies and
            tools.
          </p>
          <ul>
            <li>JavaScript / TypeScript</li>
            <li>Quasar 2 / Vue 3</li>
            <li>AWS Amplify and AWS Services</li>
            <li>Editor.js</li>
            <li>JSON Editor</li>
            <li>Marked</li>
            <li>Apex Charts</li>
            <li>Reveal.js</li>
          </ul>
          <p></p>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator></q-separator>

    <q-item
      ><span class="text-italic text-caption"
        >* Local projects require the latest Chrome browser or the Electron
        client.</span
      ></q-item
    >
  </q-list>
</template>

<script setup>
</script>
