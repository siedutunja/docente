<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> RECUPERACIONES POR PERIODO</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="3">
                <b-form-group label="Seleccione el Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="planillita=null,idPlanilla=null"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="7">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="planillita=null,cargarConfiguracionPlanilla()" :disabled="idPeriodo!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-button  style="margin-top: 28px" variant="primary" @click="verPlanilla">Ver Planilla</b-button>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <b-row class="mt-2">
              <b-col lg="12">
                <b-alert v-if="contPeriodos <= 0" variant="danger" show><b>Periodos Recuperaciones Cerrados:</b><hr>En el momento no tiene periodos activados para consultar o cargas recuperaciones.</b-alert>
              </b-col>
            </b-row>
            <div v-if="planillita == 1">
              <RecuperacionPeriodo :configuracionPlanilla="configuracionPlanilla"/>
            </div>
          </b-card-text>
          <template #footer>
            <em>Planilla de recuperaciones por periodo.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import RecuperacionPeriodo from '@/views/evaluaciones/RecuperacionPeriodo'

  export default {
    name: 'planillarecuperacionperiodo',
    components: {
      RecuperacionPeriodo,
    },
    data () {
      return {
        idPeriodo: null,
        comboPeriodos: [],
        idPlanilla: null,
        comboPlanillas: [],
        configuracionPlanilla: {},
        planillita: null,
        contPeriodos: 0
      }
    },
    methods: {
      verPlanilla() {
        if (this.configuracionPlanilla.orden == 99) {
          this.planillita = 3
        } else {
          if (this.configuracionPlanilla.id_nivel > 1 && this.configuracionPlanilla.id_nivel < 7) {
            this.planillita = 1
          } else if (this.configuracionPlanilla.id_nivel == 1) {
            this.planillita = 2
          } else {
            this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, debe seleccionar una planilla para consultar las valoraciones.')
          }
        }
      },
      async cargarConfiguracionPlanilla() {
        this.configuracionPlanilla = {}
        this.planillita = 0
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.idPlanilla == this.idPlanilla) {
            this.configuracionPlanilla = element
            this.configuracionPlanilla.idPeriodo = this.idPeriodo
          }
        })
        //console.log(JSON.stringify(this.configuracionPlanilla))
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
        })
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        let fechaVigencia = 0
        let restaVigencia = 0
        this.$store.state.datosTablas.periodos.forEach(element => {
          if (element.id == 1) {
            fechaVigencia = new Date(this.$store.state.recupP1_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 2) {
            fechaVigencia = new Date(this.$store.state.recupP2_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 3) {
            fechaVigencia = new Date(this.$store.state.recupP3_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 4) {
            fechaVigencia = new Date(this.$store.state.recupP4_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 5) {
            fechaVigencia = new Date(this.$store.state.recupP5_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
        })
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPlanillas()
      this.ocuparComboPeriodos()
    }
  }
</script>