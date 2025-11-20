<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> SUPERACIONES FINALES - HABILITACIONES</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="7">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="planillita=null,cargarConfiguracionPlanilla()" :disabled="contPeriodos!=0 ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-button  style="margin-top: 28px" variant="primary" @click="verPlanilla">Ver Planilla</b-button>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <b-row class="mt-2">
              <b-col lg="12">
                <b-alert v-if="contPeriodos <= 0" variant="danger" show><b>Periodo Superaciones Finales Cerrado:</b><hr>En el momento no tiene habilitado para cargar Superaciones Finales - Habilitaciones.</b-alert>
              </b-col>
            </b-row>
            <div v-if="planillita == 1">
              <SuperacionesFinales :configuracionPlanilla="configuracionPlanilla"/>
            </div>
            
          </b-card-text>
          <template #footer>
            <em>Planilla de Superaciones Finales - Habilitaciones.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import SuperacionesFinales from '@/views/evaluaciones/SuperacionesFinales'

  export default {
    name: 'planillasuperaciones',
    components: {
      SuperacionesFinales,
    },
    data () {
      return {
        idPlanilla: null,
        comboPlanillas: [],
        configuracionPlanilla: {},
        planillita: null,
        contPeriodos: 0
      }
    },
    methods: {
      verPlanilla() {
        this.planillita = 0
        if (this.configuracionPlanilla.orden == 99) {
          this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, la planilla no permite superaciones.')
        } else {
          if (this.configuracionPlanilla.id_nivel > 1 && this.configuracionPlanilla.id_nivel < 7) {
            this.planillita = 1
          } else if (this.configuracionPlanilla.id_nivel == 1) {
            this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, la planilla no permite superaciones.')
          } else {
            this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, debe seleccionar una planilla para consultar las superaciones finales.')
          }
        }
      },
      async cargarConfiguracionPlanilla() {
        this.configuracionPlanilla = {}
        this.planillita = 0
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.idPlanilla == this.idPlanilla) {
            this.configuracionPlanilla = element
          }
        })
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
        })
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
      },
      async iniciarVista() {
        let fechaVigencia = 0
        let restaVigencia = 0
        fechaVigencia = new Date(this.$store.state.superaFin_Fin)
        fechaVigencia = fechaVigencia.getTime()
        restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
        if (restaVigencia < 0) {
          this.contPeriodos++
        }
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.iniciarVista()
      this.ocuparComboPlanillas()
    }
  }
</script>