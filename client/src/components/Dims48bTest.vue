<template>
  <v-layout justify-center align-center fill-height v-if="loaded">
    <ConfirmIdForm v-on:registerId="registerId" v-show="!hasId"/>
    <InstructionsForm v-show="!hasStarted && !hasFinished && hasId"/>
    <SingleQuestion v-show="hasStarted"/>
    <TestEndPanel v-show="hasFinished" :id="registeredId"/>
  </v-layout>
  <v-layout justify-center align-center fill-height v-else>
    <v-progress-circular :size="65" color="primary" indeterminate></v-progress-circular>
  </v-layout>
</template>

<script>
import InstructionsForm from "@/components/InstructionsForm.vue";
import SingleQuestion from "@/components/SingleQuestion.vue";
import InterferenceTest from "@/components/InterferenceTest.vue";
import TestEndPanel from "@/components/TestEndPanel.vue";
import ConfirmIdForm from "@/components/ConfirmIdForm.vue";

export default {
  data() {
    return {
      valid: true,
      hasId: false,
      registeredId: ""
    };
  },
  components: {
    InstructionsForm,
    SingleQuestion,
    InterferenceTest,
    TestEndPanel,
    ConfirmIdForm
  },
  methods: {
    registerId: function(id) {
      this.resetTestData();
      this.registeredId = id;
      this.hasId = true;
    },
    resetTestData: function() {
      this.$store.commit("dimsTestData/resetState");
    }
  },
  computed: {
    hasStarted() {
      return this.$store.state.dimsManager.started;
    },
    hasFinished() {
      return this.$store.state.dimsManager.finished;
    },
    loaded() {
      return this.$store.getters["dimsManager/isLoaded"];
    }
  },
  beforeMount() {
    this.$store.dispatch("dimsManager/initDims48b");
  }
};
</script>

<style>
</style>
