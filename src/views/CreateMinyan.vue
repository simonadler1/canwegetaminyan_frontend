<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined>
      <v-list-item three-line>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form.organizerName"
            :counter="10"
            label="Minyan Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.organizerContact"
            :counter="10"
            label="Organizer Contact"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.minyanLocation"
            :counter="10"
            label="Minyan Location"
            required
          ></v-text-field>
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="form.minyanTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.minyanTime"
                label="Minyan Time"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="form.minyanTime"
              full-width
              @click:minute="$refs.menu.save(form.minyanTime)"
            ></v-time-picker>
          </v-menu>

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="form.minyanDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.minyanDate"
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.minyanDate" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(form.minyanDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-text-field
            v-model="form.email"
            label="E-mail"
            required
          ></v-text-field>

          <v-checkbox
            v-model="form.IsOrganizerPartOfMinyan"
            :rules="[(v) => !!v || 'You must agree to continue! ']"
            label="Are you part of the minyan?"
            required
          ></v-checkbox>
          <v-checkbox
            v-model="form.twoManMinyanMode"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="FOR TESTING ONLY: two man minyan mode?"
            required
          ></v-checkbox>

          <v-btn
            :disabled="!valid"
            color="blue"
            class="mr-4"
            @click="CreateMinyan(this.$refs.form)"
          >
            Create Minyan
          </v-btn>
        </v-form>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  components: {},
  data() {
    return {
      valid: true,
      name: "",
      //   nameRules: [
      //     (v) => !!v || "Name is required",
      //     (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      //   ],
      //   email: "",
      //   emailRules: [
      //     (v) => !!v || "E-mail is required",
      //     (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      //   ],
      //   select: null,
      //   items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
      form: {
        organizerName: "",
        organizerContact: "",
        minyanLocation: "",
        minyanTime: "",
        minyanDate: "",
        email: "",
        IsOrganizerPartOfMinyan: false,
      },
      menu: false,
      menu2: false,
    };
  },
  created() {
    // api.CreateMinyan({
    //   name: "test minyan from inside app",
    //   organizerName: "shimon adler",
    //   organizerContact: "7326065965",
    //   minyanLocation: "Tel Aviv",
    //   minyanTime: "10:07:18 GMT-0500 (Central Daylight Time)",
    //   minyanDate: "Thu Aug 10 2021",
    //   numberOfAttending: 1,
    //   canceled: false,
    // });
  },
  methods: {
    CreateMinyan(form) {
      let req = {
        organizerName: form.organizerName,
        organizerContact: form.organizerContact,
        minyanLocation: form.minyanLocation,
        minyanTime: form.minyanTime,
        minyanDate: form.minyanDate,
        numberOfAttending: 0,
        canceled: false,
      };
      if (form.IsOrganizerPartOfMinyan) {
        req.numberOfAttending++;
      }
      api.CreateMinyan(req).then((res) => {
        this.handleNewlyCreatedMinyan(res);
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    handleNewlyCreatedMinyan(res) {
      this.$router.push({
        name: "Minyan",
        params: {
          id: res.data.id,
        },
      });
    },
  },
};
</script>

<style></style>
