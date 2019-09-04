<template>
  <div>
      <b-modal hide-footer title="Delete confirmation" centered id="delete-user-confirmation">
        <div class="row ml-1 mr-1 mb-3">
          <h3> Are you sure you want to <strong>delete</strong> this user? This action cannot be undone. </h3>
        </div>
        <div class="row ml-1 mr-1 mt-4">
          <b-button @click="$bvModal.hide('delete-user-confirmation')" class="mr-2" variant="info">Cancel</b-button>
          <b-button @click="deleteUser()" variant="danger">Delete user</b-button>
        </div>
      </b-modal>
     <b-modal hide-footer hide-header centered id="user-roles-modal">
      <div class="row ml-1 mr-1 mb-3">
        <h2> Select user roles </h2>
      </div>
      <div class="row ml-1 mr-1 roles-container p-1">
        <h4><b-badge class="role-badge m-1" @click="changeUserRole(role)" v-for="(role, index) in roles" :key="index" :variant="hasRole(role) ? 'success' : 'secondary'">{{ role }}</b-badge></h4>
      </div>
      <div class="row ml-1 mr-1 mt-4">
        <b-button @click="saveUsersRoles()" variant="primary">Save roles</b-button>
      </div>
    </b-modal>
    <div class="row m-5 filters">
      <h2 class="col-12 mb-4">Filtering options</h2>
      <div class="col-12 col-md-4">
        <b-form-group
          label="User ID"
          description="Find user with specific user ID.">
          <b-form-input
            v-model="params.userId">
          </b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 col-md-4">
        <b-form-group
          label="Email"
          description="Find user with specific email.">
          <b-form-input
            v-model="params.email"
            v-validate="'email'"
            name="email"
            data-vv-as="email">
          </b-form-input>
          <span class="error-span">{{ errors.first('email') }}</span>
        </b-form-group>
      </div>
      <div class="col-12 col-md-4">
        <b-form-group label="Role" description="Show only users with specific roles.">
          <b-form-select v-model="params.role" :options="optionRoles"></b-form-select>
        </b-form-group>
      </div>
    </div>
    <b-table class="requests-table pl-3 pr-3"
      :busy="loadingPage"
      :items="items"
      :fields="fields" 
      flex
      bordered
      responsive
      caption-top
      striped 
      hover
      @row-clicked="expandAdditionalInfo"
    >
    <template v-if="items.length > 0" slot="table-caption">Found {{ totalRecords }} users that matches your criteria.</template>
    <div slot="table-busy" class="text-center my-2">
      <b-spinner class="align-middle"></b-spinner>
      <strong>Loading...</strong>
    </div>
    <template slot="row-details" slot-scope="row">
      <b-card>
        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>ID:</b></b-col>
          <b-col sm="2">{{ row.item._id || '/' }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Email:</b></b-col>
          <b-col sm="2">{{ row.item.email || '/' }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Username:</b></b-col>
          <b-col sm="2">{{ row.item.username || '/' }}</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>First name:</b></b-col>
          <b-col sm="2">{{ row.item.firstName || '/' }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Last name:</b></b-col>
          <b-col sm="2">{{ row.item.lastName || '/' }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Google ID:</b></b-col>
          <b-col sm="2">{{ row.item.googleId || '/' }}</b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col sm="2" class="text-sm-left"><b>Facebook ID:</b></b-col>
          <b-col sm="2">{{ row.item.facebookId || '/' }}</b-col>
          <b-col sm="2" class="text-sm-left"><b> Created at:</b></b-col>
          <b-col sm="2">{{ row.item.createdAt || '/' }}</b-col>
          <b-col sm="2" class="text-sm-left"><b>Updated at:</b></b-col>
          <b-col sm="2">{{ row.item.updatedAt || '/' }}</b-col>
        </b-row>

        <b-row class="pl-2">
          <b-button variant="danger" class="mr-2" @click="deleteUserConfirmation(row.item)">Delete user</b-button>
          <b-button variant="info" @click="showManageRolesModal(row.item)">Manage user roles</b-button>
        </b-row>

      </b-card>
    </template>
    </b-table>
    <h2 v-if="!loadingPage && items.length === 0" class="text-center mt-3 mb-3"> There are no users found that matches your criteria. </h2>
    <ul v-if="!loadingPage && items.length > 0" class="pagination justify-content-center">
      <li class="page-item" v-bind:class="{ disabled: currentPage === 0 }">
        <a class="page-link" @click="changePage(false)"><i class="fa fa-caret-left fa-lg"></i></a>
      </li>
      <li class="page-item disabled"><span class="page-link">{{ currentPage + 1 }} / {{ totalPages }}</span></li>
      <li class="page-item" v-bind:class="{ disabled: (currentPage + 1) === totalPages }">
        <a class="page-link" @click="changePage(true)"><i class="fa fa-caret-right fa-lg"></i></a>
      </li>
    </ul>
  </div>
</template>

<script>
import { setMenuMargin } from '~/mixins/set-menu-margin';

export default {
  mixins: [ setMenuMargin ],
  data () {
    return {
      fields: [
        { key: '_id', sortable: true },
        { key: 'email', sortable: true },
        { key: 'firstName', sortable: true },
        { key: 'lastName', sortable: true },
        { key: 'createdAt', sortable: true },
      ],
      items: [],
      optionRoles: [
        '',
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      neki: 0,
      params: {
        role: '',
        userId: '',
        email: '',
      },
      currentPage: 0,
      loadingPage: false,
      totalPages: 0,
      totalRecords: 0,
      selectedUser: {},
      selectedUserRoles: [],
      roles: [],
    }
  },
  created () {
    this.$store.dispatch('ui/changeView', this.types.MenuItems.USERS);
    this.getRoles();
    this.getUsers();
  },
  mounted () {
    this.setMenuMargin();
  },
  watch: {
    params: {
      handler() {
        this.currentPage = 0;
        this.getUsers();
      },
      deep: true
    }
  },
  methods: {
    async saveUsersRoles() {
      try {
        const res = await this.$axios.patch(`/users/${this.selectedUser._id}/roles`, { roles: this.selectedUserRoles });
        this.selectedUser.roles = this.selectedUserRoles;
        this.$bvModal.hide('user-roles-modal');
        this.createToast('success', 'User\'s roles successfully updated!');
      } catch (error) {
        this.createToast('danger', 'There was an error while updating user roles. Please try again.');
      }
    },
    async getRoles() {
      try {
        const res = await this.$axios.get('/admin/roles');
        this.roles = res.data;
        this.roles.map((role) => this.optionRoles.push({ text: role.toUpperCase(), value: role }))
      } catch (error) {
        this.createToast('danger', 'There was an error while getting roles. Please try again.');
      }
    },
    changeUserRole(role) {
      if (this.hasRole(role)) {
        this.selectedUserRoles = this.selectedUserRoles.filter((r) => r !== role);
      } else {
        this.selectedUserRoles.push(role);
      }
    }, 
    hasRole(role) {
      return this.selectedUserRoles.find((r) => r === role);
    },
    showManageRolesModal(user) {
      this.selectedUser = user;
      this.selectedUserRoles = user.roles;
      this.$bvModal.show('user-roles-modal');
    },
    expandAdditionalInfo(row) {
      row._showDetails = !row._showDetails;
    },
    changePage(next) {
      next ? this.currentPage++ : this.currentPage--;
      this.getUsers();
    },
    async getUsers () {
      if (!await this.$validator.validateAll()) return;
      this.loadingPage = true;
      try {
        const res = await this.$axios.get('/users', {
          params: {
            ...this.params.role ? { role: this.params.role } : {},
            ...this.params.userId ? { userId: this.params.userId } : {},
            ...this.params.email ? { email: this.params.email } : {},
            page: this.currentPage,
          }
        });
        this.items = res.data.data.map((d) => Object.assign(d, { _showDetails: false }));
        this.totalPages = res.data.meta.totalPages;
        this.totalRecords = res.data.meta.totalRecords;
      } catch (error) {
        this.createToast('danger', 'There was an error while getting users. Please try again.');
      } finally {
        this.loadingPage = false;
      }
    },
    deleteUserConfirmation (user) {
      this.selectedUser = user;
      this.$bvModal.show('delete-user-confirmation');
    },
    async deleteUser () {
      this.$bvModal.hide('delete-user-confirmation')

      try {
        await this.$axios.delete(`/users/${this.selectedUser._id}`);
        this.getUsers();
        this.createToast('success', 'User successfully deleted!');
      } catch (error) {
        this.createToast('danger', 'There was an error while deleting user. Please try again.');
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~/assets/scss/styles';

  .main {
    background-color: white;
  }

  .content {
    background-color: white;
    border: 0.5px solid #e8e8e8;
  }

  @include media('<560px') {
    .content {
      margin: 0 !important;
    }
  }

  .form-title {
    font-size: 1.5rem;
    color: $gray;
  }

  .group {
    border-bottom: 0.5px solid #e8e8e8;
  }

  .requests-table {
    cursor: pointer;
  }

  @include media('<560px') {
    .filters {
      margin: 0 !important;
      margin-top: 90px !important;
    }
  }

  .roles-container {
    border-radius: 5px;
    background-color: #f0eeee;
    text-transform: uppercase;
  }

  .role-badge {
    cursor: pointer;
  }

</style>
