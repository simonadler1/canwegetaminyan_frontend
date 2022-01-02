<template>
  <div>
    <v-card>
      <v-card-title v-if="this.minyan.twoManMinyanMode">
        WARNING TWO MAN MINYAN MODE ENABLED. FOR TESTING ONLY</v-card-title
      >
      <v-row>
        <v-col cols="12">
          <v-card-title v-if="greenlightMinyan"
            >Minyan is happening!</v-card-title
          ></v-col
        >
      </v-row>
      <v-row
        ><v-card-title v-if="!greenlightMinyan"
          >No Minyan Yet</v-card-title
        ></v-row
      >
      <v-row>
        <v-card-text>
          Number of Attending so far: {{ minyan.numberOfAttending }}
        </v-card-text></v-row
      >
    </v-card>
    <v-card class="d-flex flex-column align-center">
      <v-card-title>
        <span class="headline">{{ minyan.minyanName }}</span>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-calendar</v-icon>
                {{ minyan.minyanTime }} {{ minyan.minyanDate }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-map-marker</v-icon>
                {{ minyan.minyanLocation }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-account-group</v-icon>
                {{ minyan.organizerName }} - {{ minyan.organizerContact }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-account-group</v-icon>
                {{ minyan.numberOfAttending }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card class="d-flex flex-column align-center" v-if="isOrganizer">
      <v-row><v-btn>Cancel Minyan</v-btn></v-row>
    </v-card>
    <v-card class="d-flex flex-column align-center" v-if="!isOrganizer">
      <v-form ref="form">
        <v-text-field
          v-model="form.attendeeName"
          label="Your Name"
          required
        ></v-text-field>
      </v-form>
      <v-btn @click="joinMinyan()">Join Minyan</v-btn></v-card
    >

    <v-card class="d-flex flex-column align-center"
      ><v-card-title>Share this Minyan </v-card-title>
      <a :href="currentUrl">{{ currentUrl }}</a></v-card
    >
  </div>
</template>
<script>
import api from "@/utils/api";
export default {
  computed: {
    greenlightMinyan() {
      if (this.minyan.twoManMinyanMode && this.minyan.numberOfAttending >= 2) {
        return true;
      }
      if (this.minyan.numberOfAttending >= 10) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.currentUrl = window.location;
    if (localStorage.getItem("attendingMinyan") == this.minyanId) {
      this.alreadyAttending = true;
    }
    api.GetMinyan(this.$route.params.minyanid).then((minyan) => {
      this.minyan = minyan.data.data;
    });
  },

  data() {
    return {
      form: {
        attendeeName: "",
      },
      minyan: {},
      minyanId: this.$route.params.minyanid,
      isOrganizer: localStorage.getItem("isOrganizer"),
      currentUrl: "default",
      alreadyAttending: false,
    };
  },
  methods: {
    joinMinyan() {
      this.minyan.numberOfAttending++;
      this.minyan.attending.push(this.form.attendeeName);
      api.UpdateMinyan(this.minyanId, this.minyan).then((minyan) => {
        localStorage.setItem("attendingMinyan", this.minyanId);
        this.minyan = minyan.data.data;
      });
    },
  },
};
</script>

<style></style>
