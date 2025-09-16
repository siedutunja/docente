<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CCard>
              <CCardFooter style="background: rgb(8, 204, 34, 0.879); margin-top: -40; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);">
                <CRow>
                  <CCol lg="2" md="3">
                    <div class="text-center">
                      <b-avatar class="c-sidebar-brand-minimized" variant="light" :src="escudoInstitucion"  size="6rem"></b-avatar>
                    </div>
                  </CCol>
                  <CCol lg="8" md="6">
                    <div class="mt-2 text-center">
                      <h5 style="margin-top: -5" class="text-white">{{ secretaria }}</h5>
                      <h3 style="margin-top: -1" class="text-white">{{ $store.state.nombreInstitucion }}</h3>
                      <h6 style="margin-top: -1" class="text-white">DANE: {{ $store.state.daneInstitucion }} - NIT: {{ $store.state.nitInstitucion }}</h6>
                    </div>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
            <b-card-group deck class="mt-5">
              <b-card border-variant="light" class="text-center linkini" @click="irAusencias">
                <b-card-text>
                  <span><b-icon icon="person-x-fill" font-scale="3"></b-icon></span>
                  <h5 class="mt-2">Ausencias</h5>
                </b-card-text>
                <b-card-text>Consulte y registre las ausencias de los estudiante</b-card-text>
              </b-card>
              <b-card border-variant="light" class="text-center linkini" @click="irObservador">
                <b-card-text>
                  <span><b-icon icon="person-badge" font-scale="3"></b-icon></span>
                  <h5 class="mt-2">Observador</h5>
                </b-card-text>
                <b-card-text>Consulte y actualice el observador del estudiante</b-card-text>
              </b-card>
              <b-card border-variant="light" class="text-center linkini" @click="irFichaMatricula">
                <b-card-text>
                  <span><b-icon icon="journal-bookmark-fill" font-scale="3"></b-icon></span>
                  <h5 class="mt-2">Consulta Estudiante</h5>
                </b-card-text>
                <b-card-text>Consulte la ficha de matricula de estudiantes</b-card-text>
              </b-card>
              <b-card border-variant="light" class="text-center linkini" @click="irListados">
                <b-card-text>
                  <span><b-icon icon="card-list" font-scale="3"></b-icon></span>
                  <h5 class="mt-2">Listados</h5>
                </b-card-text>
                <b-card-text>Genere listados o planillas de estudiantes</b-card-text>
              </b-card>
            </b-card-group>
            <!--
            <b-card-group deck class="mt-5">
              <b-card border-variant="light" class="text-center linkini" @click="irManuales">
                <b-card-text>
                  <span><b-icon icon="book" font-scale="3"></b-icon></span>
                  <h5 class="mt-2">Manuales</h5>
                </b-card-text>
                <b-card-text>Consulte los manuales de usuario del docente</b-card-text>
              </b-card>
            </b-card-group>
            <b-row>
              <b-col lg="12"><hr></b-col>
              <b-col>
                <span class="text-muted" v-if="$store.state.idRol == 1">ID Institución: {{$store.state.idInstitucion}}</span>
              </b-col>
            </b-row>
            -->
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
  import * as CONFIG from '@/assets/config.js'

  export default {
    name: 'Inicio',
    data () {
      return {
        escudoInstitucion: null,
        secretaria: null
      }
    },
    methods: {
      irFichaMatricula() {
        this.$router.push('/estudiantes/buscarestudiante')
      },
      irObservador() {
        this.$router.push('/estudiantes/listaobservadores')
      },
      irAusencias() {
        this.$router.push('/evaluaciones/ausencias')
      },
      irListados() {
        this.$router.push('/listados/listadosestudiantes')
      },
      /*
      irManuales() {
        this.$router.push('/manuales')
      }
      */
    },
    beforeMount() {
      this.escudoInstitucion = CONFIG.ROOT_ESCUDOS + this.$store.state.escudoInstitucion
      this.secretaria = CONFIG.SECRETARIA
    }
  }
</script>

<style>
  .linkini:hover {
    position: relative;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    background: rgba(149, 195, 247, 0.108);
    cursor: pointer;
    color: rgba(8, 204, 34, 0.879);
    /*background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);*/
  }
</style>
