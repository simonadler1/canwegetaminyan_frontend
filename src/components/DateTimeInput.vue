<template>
  <v-menu
    ref="menu"
    :value="menuOpen"
    @input="setMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
    content-class="my-menu"
    @close="pickerTab = 0"
    v-bind="$attrs"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-col cols="10" v-if="false">
        <div class="filter-title" :class="{ active: date }">
          {{ label }}
        </div>
        <div>
          {{ date }}
        </div>
        <div>
          {{ time }}
        </div>
      </v-col>
      <v-text-field
        :label="label"
        :value="dateTime"
        placeholder="mm/dd/yyyy  hh:mm:ss"
        @change="setFromFreeInput"
        :rules="[isValidDtString]"
        hint=" "
      >
        <template v-slot:append>
          <v-icon v-bind="attrs" v-on="on">mdi-calendar-cursor</v-icon>
        </template>
        <template v-slot:message="{ message }">
          <div>
            <div v-text="message" />
            Valid formats:<br />
            <div v-for="eg in dateFormatExamples" :key="eg">
              {{ eg }}
            </div>
          </div>
        </template>
      </v-text-field>
    </template>
    <v-tabs v-model="pickerTab" class="my-tabs">
      <v-tab>
        <v-icon>mdi-calendar</v-icon>
      </v-tab>
      <v-tab :disabled="!model.date">
        <v-icon>mdi-clock</v-icon>
      </v-tab>
      <v-tab
        :disabled="!model.date"
        @click.prevent.stop="applyAndClose"
        class="v-tab"
        link
      >
        <v-icon dense color="primary">mdi-check-outline</v-icon>
      </v-tab>
      <v-tab
        @click.prevent.stop="clearAndClose()"
        class="v-tab"
        :disabled="!model.date"
      >
        <v-icon dense color="secondary">mdi-close</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="pickerTab">
      <v-tab-item>
        <v-date-picker
          show-current
          v-model="model.date"
          title
          @input="pickerTab = 1"
        ></v-date-picker>
      </v-tab-item>
      <v-tab-item>
        <v-time-picker ampm-in-title v-model="model.time"> </v-time-picker>
      </v-tab-item>
    </v-tabs-items>
  </v-menu>
</template>

<script>
const time12HRRegexStr =
  "(?<hour12>0?[1-9]|1[0-2])[:-](?<minute12>[0-5][0-9])(?:[:-](?<second12>[0-5][0-9]))?\\s+(?<ampm>AM|PM)";
const time24HRRegexStr =
  "(?<hour24>0?[1-9]|1[0-9]|2[0-3])[:-](?<minute24>[0-5][0-9])(?:[:-](?<second24>[0-5][0-9]))?";
const dateYYYYMMDDRegexStr =
  "^(?<year1>\\d{2}|\\d{4})[/-](?<month1>\\d{1,2})[/-](?<day1>\\d{1,2})";
const dateMMDDYYYYRegexStr =
  "^(?<month2>\\d{1,2})[/-](?<day2>\\d{1,2})[/-](?<year2>\\d{2}|\\d{4})";

// const timeRegex = new RegExp(
//   `\\s*(?:${time12HRRegexStr}|${time24HRRegexStr})\\s*`,
//   "i"
// );
// const dateRegex = new RegExp(
//   `\\s*(?:${dateMMDDYYYYRegexStr}|${dateYYYYMMDDRegexStr})\\s*`
// );

const timeRegexStr = `(?:${time12HRRegexStr}|${time24HRRegexStr})`;
const dateRegexStr = `(?:${dateMMDDYYYYRegexStr}|${dateYYYYMMDDRegexStr})`;
// const dateTimeRegex = new RegExp(
//   `^\\s*${dateRegexStr}\\s+${timeRegexStr}\\s*$`,
//   "i"
// );
const dateOptionalTimeRegex = new RegExp(
  `^\\s*${dateRegexStr}(?:\\s+${timeRegexStr})?\\s*$`,
  "i"
);

function parseDateTime(stringInput) {
  const match = dateOptionalTimeRegex.exec(stringInput);
  if (!match) return null;
  const groups = match.groups;
  if (!groups) throw Error("invalid REGEX groups");
  let year = groups.year1 || groups.year2;
  if (year.length === 2) {
    year = `20${year}`;
  }
  const hour = groups.hour12 || groups.hour24;
  const minute = groups.minute12 || groups.minute24;
  const second = groups.second12 || groups.second24;
  const obj = {
    year: Number(year),
    month: Number(groups.month1 || groups.month2),
    day: Number(groups.day1 || groups.day2),
    hour: hour,
    minute: minute,
    second: second,
    ampm: groups.ampm,
  };
  obj.date = function (sep = "-") {
    return `${this.year}${sep}${this.month}${sep}${this.day}`;
  };
  obj.time = function (sep = ":") {
    if (!this.hour) return null;
    let time = [this.hour, this.minute, this.second].filter((x) => x).join(sep);
    if (this.ampm) {
      time += ` ${this.ampm.toUpperCase()}`;
    }
    return time;
  };
  obj.dateTime = function (dSep = "/", tSep = ":") {
    let date = this.date(dSep);
    let time = this.time(tSep);
    let dt = `${date}`;
    if (time) {
      dt += ` ${time}`;
    }
    return dt;
  };
  obj.dateTimeObj = validDateObjOrNull(obj.dateTime());
  console.log(obj);
  if (!obj.dateTimeObj) return null;
  return obj;
}

function validDateObjOrNull(d) {
  if (typeof d === "string") {
    d = new Date(d);
  }
  if (d && d.getTime && !isNaN(d.getTime())) {
    return d;
  }
  return null;
}

function padded(val) {
  return val.toString().padStart(2, "0");
}

function formattedDate(d) {
  return `${d.getFullYear()}-${padded(d.getMonth() + 1)}-${padded(
    d.getDate()
  )}`;
}

function formattedTime(d) {
  return d.toLocaleTimeString("en-UK");
}

/*
DateTimeInput accepts a `value` prop with the value to be set.
This value may be a string, Date Object. the value is parsed and validated.

When the value changes, a `input` event is emitted with the new value.

 */

export default {
  name: "DateTimeInput",
  props: {
    menuOpen: {},
    label: {
      default: "DateTime",
    },

    value: {
      default: null,
    },
  },

  watch: {
    value: {
      handler(val) {
        this.setFromValue(val);
      },
    },
  },

  mounted() {
    this.setFromValue(this.value);
  },

  data() {
    return {
      dateFormatExamples: ["12/29/2021 5:03 AM", "12/29/2021 19:03"],
      error: "",
      pickerTab: 0,
      date: null,
      time: null,
      dateTime: null,
      model: {
        date: null,
        time: null,
      },
      dateTimeObj: null,
      ready: false,
      invalid: null,
    };
  },

  computed: {
    window: () => window,
  },

  methods: {
    setMenu(open) {
      this.$emit("update:menu-open", open);
    },

    parseDateTimeString(stringVal) {
      if (!stringVal) {
        return null;
      } else {
        let myDt = parseDateTime(stringVal);
        if (!myDt) return null;
        const d = myDt.dateTimeObj;
        const obj = {};
        obj.date = formattedDate(d);
        obj.time = formattedTime(d);
        return obj;
      }
    },

    isValidDtString(stringVal) {
      if (!stringVal || parseDateTime(stringVal)) {
        if (this.invalid) {
          this.invalid = false;
          this.$emit("validity", true);
        }
        return true;
      } else {
        this.error = "Invalid date time";
        if (this.invalid !== true) {
          this.invalid = true;
          this.$emit("validity", false);
        }
        return this.error;
      }
    },

    setFromFreeInput(event) {
      const stringVal = event;
      console.error("blurred", stringVal);
      if (!stringVal) {
        return this.clear(true);
      }

      const obj = this.parseDateTimeString(stringVal);
      if (!obj) {
        this.error = "Invalid date time";
      } else {
        this.model.date = obj.date;
        this.model.time = obj.time;
        this.applyDateTime(true);
      }
    },

    setFromValue(stringVal) {
      const d = validDateObjOrNull(stringVal);
      if (!d) {
        return this.clear();
      } else {
        this.model.date = formattedDate(d);
        this.model.time = formattedTime(d);
        this.applyDateTime(false);
      }
    },

    clear(emit) {
      this.error = false;
      this.dateTimeObj =
        this.dateTime =
        this.model.date =
        this.model.time =
        this.time =
        this.date =
          null;
      if (emit) {
        this.$emit("input", null);
      }
    },

    applyDateTime(emit = true) {
      this.error = false;
      let date = this.model.date;
      let time = this.model.time || "";
      let d = new Date(`${date} ${time}`);
      this.dateTimeObj = d;
      this.date = d.toLocaleDateString();
      this.time = d.toLocaleTimeString();
      this.dateTime = `${this.date} ${this.time}`;
      console.log(this.dateTime);

      if (emit) {
        this.$emit("input", this.dateTimeObj.toISOString());
      }
    },

    applyAndClose() {
      this.applyDateTime(true);
      this.close();
    },

    close() {
      this.$nextTick(() => (this.pickerTab = 0));
      this.setMenu(false);
    },

    clearAndClose() {
      this.clear(true);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
col {
  cursor: pointer;
  position: relative;

  max-width: 50%;
  padding: 1px;

  display: flex;
  flex-direction: column;
  align-items: center;

  .filter-title {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  & .filter-title.active {
    font-size: xx-small;
    //position: absolute;
    //top: 2px;
    right: 0;
    left: 0;
  }

  &:hover {
    filter: contrast(30%);
  }
}

.my-tabs .v-tab {
  min-width: initial;
  flex-grow: 1;
}
</style>
