<template>
  <div>
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
          <b-form-select v-model="params.role" :options="roles"></b-form-select>
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

        <b-row class="mt-5">
          <b-col sm="2" class="text-sm-left"><b-button variant="danger" @click="deleteUserConfirmation(row.item._id)">Delete user</b-button></b-col>
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
  auth: false,
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
      roles: [
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
    }
  },
  created () {
    this.$store.dispatch('ui/changeView', this.types.MenuItems.USERS);
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
        // console.log(error);
      } finally {
        this.loadingPage = false;
      }
    },
    deleteUserConfirmation (userId) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this user? This action cannot be undone.', {
        title: 'Delete confirmation',
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: 'Yes',
        cancelTitle: 'No',
        footerClass: 'p-2 no-',
        hideHeaderClose: false,
        centered: true
      })
      .then((value) => {
        if (value) {
          this.deleteUser(userId);
        }
      })
      .catch((error) => {
        // console.log(error);
      })
    },
    async deleteUser (userId) {
      try {
        await this.$axios.delete(`/users/${userId}`);
        this.getUsers();
      } catch (error) {
        // console.log(error);
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

</style>
