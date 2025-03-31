<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> EVALUACIÓN PARCIAL POR PERIODO</h5>
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
            <div v-if="planillita == 1">
              <NotasParcialPeriodo :configuracionPlanilla="configuracionPlanilla"/>
            </div>
            <div v-else-if="planillita == 2">
              <PreeParcialPeriodo :configuracionPlanilla="configuracionPlanilla"/>
            </div>
            <div v-else-if="planillita == 3">
              <ComportamientoParcialPeriodo :configuracionPlanilla="configuracionPlanilla"/>
            </div>
          </b-card-text>
          <template #footer>
            <em>Planilla de evaluación parcial por periodo.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import ComportamientoParcialPeriodo from '@/views/evaluaciones/ComportamientoParcialPeriodo'
  import NotasParcialPeriodo from '@/views/evaluaciones/NotasParcialPeriodo'
  import PreeParcialPeriodo from '@/views/evaluaciones/PreeParcialPeriodo'

  export default {
    name: 'planillaparcialperiodo',
    components: {
      ComportamientoParcialPeriodo,
      NotasParcialPeriodo,
      PreeParcialPeriodo
    },
    data () {
      return {
        idPeriodo: null,
        comboPeriodos: [],
        idPlanilla: null,
        comboPlanillas: [],
        configuracionPlanilla: {},
        planillita: null,
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
            this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, algo salio mal con la planilla seleccionada.')
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
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        this.$store.state.datosTablas.periodos.forEach(element => {
          this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
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