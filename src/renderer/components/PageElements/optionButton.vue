<template>
  <a
    class="btn btn-outline-info btn-sm"
    :class="{active: this.isSelected}"
    href="#"
    v-on:click="toggleState()"
  >
    <span>{{text}}</span>
  </a>
</template>

<script>
export default {
	name: 'optionButton',
	data() {
		return {
			isSelected: false
		}
	},
	props: {
		text: {
			type: String,
			required: true
		}
	},
	methods: {
		toggleState: function() {
			this.isSelected = !this.isSelected
			this.$parent.processFilterChange({ text: this.text, isSelected: this.isSelected })
		},
		select: function() {
			this.isSelected = true
			// Unnecesry to send the event back to optionLine because this method is used inside the optionLine component
		},
		clear: function() {
			this.isSelected = false
			// Unnecesry to send the event back to optionLine because this method is used inside the optionLine component
		}
	}
}
</script>