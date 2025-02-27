<template>
  <CDropdown inNav class="c-header-nav-items" add-menu-classes="pt-0">
    <template #toggler>
      <CHeaderNavLink>
        <CIcon name="cilSettings"/>Configuración
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center text-light" color="dark">
      <strong>Configuración del Sistema</strong>
    </CDropdownHeader>
    <div v-if="$store.state.idRol == 1">
      <CDropdownDivider/>
      <CDropdownItem to="/configuracion/superadmin">
        <CIcon name="cilSpeedometer" />Super Administrador
      </CDropdownItem>
    </div>
  </CDropdown>
</template>

<script>
  export default {
    name: 'MenuConfiguracion',
    data () {
      return { 
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>