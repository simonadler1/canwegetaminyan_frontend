<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined>
      <v-list-item three-line>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form.organizerName"
            label="Organizer Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.organizerContact"
            label="Organizer Contact"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.minyanName"
            label="Minyan Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.minyanLocation"
            label="Minyan Location"
            required
          ></v-text-field>
          <v-menu
            ref="menu2"
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
              format="ampm"
              @click:minute="$refs.menu2.save(form.minyanTime)"
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
            @click="CreateMinyan(form)"
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
        minyanName: "",
        minyanLocation: "",
        minyanTime: "",
        minyanDate: "",
        email: "",
        IsOrganizerPartOfMinyan: false,
        twoManMinyanMode: false,
      },
      menu: false,
      menu2: false,
    };
  },
  created() {},
  methods: {
    CreateMinyan(form) {
      let req = {
        organizerName: form.organizerName,
        organizerContact: form.organizerContact,
        minyanName: form.minyanName,
        minyanLocation: form.minyanLocation,
        minyanTime: form.minyanTime,
        minyanDate: form.minyanDate,
        numberOfAttending: 0,
        canceled: false,
        twoManMinyanMode: form.twoManMinyanMode,
      };
      if (form.IsOrganizerPartOfMinyan) {
        req.numberOfAttending++;
        req.attending = [`${form.organizerName}`];
      }
      api.CreateMinyan(req).then((res) => {
        this.setUserAsOrganizerinLocalStorage(res.data.data._id);
        this.handleNewlyCreatedMinyan(res.data);
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    handleNewlyCreatedMinyan(res) {
      this.$router.push({
        name: "Minyan",
        params: {
          minyanid: res.data._id,
        },
      });
    },
    setUserAsOrganizerinLocalStorage(minyanid) {
      localStorage.setItem("isOrganizer", true);
      localStorage.setItem("attendingMinyan", minyanid);
    },
  },
};
</script>

<style></style>
