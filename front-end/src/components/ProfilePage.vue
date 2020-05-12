<template>
    <div class="profilepage">
        <b-table
        :items="items"
        :fields="fields"
        striped
        hover
        responsive
        thead-class="hidden"
        >
            <template v-slot:cell(comp)="row">
                <ProfileInfoDisplayEdit :infoname="row.item.head"/>
            </template>
        </b-table>
    </div>
</template>

<script>
import ProfileInfoDisplayEdit from "@/components/ProfileInfoDisplayEdit.vue"
export default {
    name: "ProfilePage",
    components: {
        ProfileInfoDisplayEdit
    },
    data() {
        return {
            fields: [
                {key: "head", tdClass:"headcol"},
                {key: "comp",}
            ],
            items: [
                {head: "Email"},
                {head: "Altezza"}
            ]
        }
    }
}
</script>

<style>
.profilepage .hidden {
  display: none;
}
.profilepage .headcol {
  font-weight: bold;
  width: 10%;
}
</style>