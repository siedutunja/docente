<template>
  <div class="mt-2">
    <div v-if="btnCargando">
      <div class="text-center m-5 text-primary">
        <b-spinner style="width: 3rem; height: 3rem;" label="Spinner"></b-spinner>
        <br><strong>Cargando planilla...</strong>
      </div>
    </div>
    <div v-else>
      <b-row class="mt-2">
        <b-col lg="12">
          <b-alert v-if="cambioActivo==true" variant="danger" show><b>Advertencia: </b>La planilla se ha modificado, se recomienda guardar la planilla.</b-alert>
        </b-col>
      </b-row>
      <b-row v-if="planillita == 1" class="mt-2">
        <b-col>
          <vue-good-table ref="table" :columns="encabColumnas" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'estudiante'">
                <span>{{props.row.estudiante}}</span>
              </span>
              <span v-if="props.column.field == 'diversa'">
                <span>{{props.row.diversa}}</span>
              </span>
              <span v-if="props.column.field == 'definitiva'">
                <span>{{props.row.definitiva}}</span>
              </span>
              <span v-if="props.column.field == 'concepto'">
                <span><strong>{{props.row.concepto}}</strong></span>
              </span>
              <span v-if="props.column.field == 'habilitacion'">
                <b-form-input v-model="props.row.habilitacion" @blur="actualizarItemNota(props.row)" @change="cambioPlanilla" autocomplete="off" maxlength="3" @keydown="handleKeyNavigation($event, props.row.originalIndex, 'habilitacion'),soloDecimales($event)" :ref="'habilitacion-' + props.row.originalIndex"></b-form-input>
              </span>
              <span v-if="props.column.field == 'acta'">
                <b-form-input v-model="props.row.acta" @blur="actualizarItemActa(props.row)" @change="cambioPlanilla" autocomplete="off" maxlength="100" @keydown="handleKeyNavigation($event, props.row.originalIndex, 'acta')" :ref="'acta-' + props.row.originalIndex"></b-form-input>
              </span>
              <span v-if="props.column.field == 'fecha'">
                <b-form-input type="date" v-model="props.row.fecha" @blur="actualizarItemFecha(props.row)" @change="cambioPlanilla" autocomplete="off" @keydown="handleKeyNavigation($event, props.row.originalIndex, 'fecha'),soloDecimales($event)" :ref="'fecha-' + props.row.originalIndex"></b-form-input>
              </span>
            </template>
            <div slot="emptystate">
              <h5 class="text-danger ml-5">No existen estudiantes en la planilla</h5>
            </div>
          </vue-good-table>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col lg="12">
          <b-alert v-if="cambioActivo==true" variant="danger" show><b>Advertencia: </b>La planilla se ha modificado, se recomienda guardar la planilla.</b-alert>
        </b-col>
      </b-row>
      <b-row v-if="notasPlanilla">
        <b-col v-if="!botonGuardando">
          <b-button class="small mx-1 mt-4" variant="success" @click="botonGuardando = true,guardarPlanilla()" :disabled="!cambioActivo">Guardar Planilla Superaciones Finales</b-button>
          <!--<b-button class="small mx-1 mt-4 float-right" variant="success" @click="procesarPlanila">Procesar y Generar Planilla Final del Periodo</b-button>-->
        </b-col>
        <b-col v-else>
          <b-button class="mx-1 mt-4" variant="primary" disabled>
            <b-spinner small type="grow"></b-spinner>
            Guardando la planilla...
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table'

  export default {
    name: 'superacionesfinales',
    props: {
      configuracionPlanilla: Object
    },
    components: {
      VueGoodTable
    },
    data () {
      return {
        notasPlanilla: [],
        botonGuardando: false,
        encabColumnas: [],
        encabezados: {},
        planillita: 0,
        idColumnaCopiar: null,
        comboColumnas: [],
        cambioActivo: false,
        btnCargando: false
      }
    },
    methods: {
      async guardarPlanilla() {
        this.btnCargando = true
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/planilla/superaciones', JSON.stringify(this.notasPlanilla), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Superaciones')
            this.btnCargando = false
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla de superaciones finales se ha guardado satisfactoriamente.')
            this.btnCargando = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Superaciones. Intente más tarde. ' + err)
          this.btnCargando = false
        })
        this.botonGuardando = false
        this.cambioActivo = false
        this.btnCargando = false
      },
      actualizarItemActa(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.acta == '' || item.acta == null) {
          this.notasPlanilla[indice].acta = null
          item.acta = null
        } else  {
          this.notasPlanilla[indice].acta = item.acta
        }
      },
      actualizarItemFecha(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.fecha == '' || item.fecha == null || item.fecha == 0) {
          this.notasPlanilla[indice].fecha = null
          item.fecha = null
        } else  {
          this.notasPlanilla[indice].fecha = item.fecha.substr(0,10)
        }
      },
      actualizarItemNota(item) {
        let notaMinima = 0
        let notaMaxima = 99
        notaMinima = this.configuracionPlanilla.minBaj
        notaMaxima = this.configuracionPlanilla.maxSup
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.habilitacion == '' || item.habilitacion == null || item.habilitacion == 0) {
          this.notasPlanilla[indice].habilitacion = null
          item.habilitacion = null
        } else  {
          if (item.habilitacion >= notaMinima && item.habilitacion <= notaMaxima) {
            this.notasPlanilla[indice].habilitacion = item.habilitacion
          } else {
            this.notasPlanilla[indice].habilitacion = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.habilitacion  + ' no es válida.')
            item.habilitacion = null
          }
        }
      },
      cambioPlanilla() {
        this.cambioActivo = true
      },
      async cargarHabilitaciones() {
        this.btnCargando = true
        this.notasPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planilla/superaciones', {params: {idCurso: this.configuracionPlanilla.idCurso, idPlanilla: this.configuracionPlanilla.idPlanilla, vigencia: this.$store.state.aLectivo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Superaciones')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              response.data.datos.forEach(element => {
                element.idPlanilla = this.configuracionPlanilla.idPlanilla
                element.vigencia = this.$store.state.aLectivo
                if (element.fecha == '' || element.fecha == null || element.fecha == 0) {
                  element.fecha = null
                } else {
                  element.fecha = element.fecha.substr(0,10)
                }
              })
              this.notasPlanilla = response.data.datos
              //console.log(JSON.stringify(this.notasPlanilla))
              this.btnCargando = false
            } else {
              this.btnCargando = false
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Superaciones. Intente más tarde.' + err)
        })
        this.btnCargando = false
      },
      async construirPlanillaNotas() {
        this.planillita = 1
        this.encabColumnas = [
          { label: 'Apellidos y Nombres Estudiante', width: '30%', field: 'estudiante', sortable: false },
          { label: '', field: 'diversa', sortable: false, tdClass: this.tdClassFuncDiversa },
          { label: 'Superación Final', field: 'habilitacion', sortable: false },
          { label: 'Acta', field: 'acta', sortable: false },
          { label: 'Fecha Superación', field: 'fecha', sortable: false },
        ]
      },
      soloDecimales(e) {
        let key = window.Event ? e.which : e.keyCode
        if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 8) || (key == 9) || (key == 37) || (key == 39) || (key == 110) || (key == 189) || (key == 190))) {
            e.preventDefault()
        }
      },
      tdClassFuncDiversa(fila) {
        if (fila.id_diversa == 'S') {
          return 'text-center alert alert-warning'
        }
      },
      handleKeyNavigation(event, i, col) {
        if (event.key === "ArrowDown") {
          const nextInput = this.$refs[`${col}-${i + 1}`]
          if (nextInput) nextInput.focus()
        } else if (event.key === "ArrowUp") {
          const previousInput = this.$refs[`${col}-${i - 1}`]
          if (previousInput) previousInput.focus()
        }
      },
      cancelarVentana() {
        this.idColumnaCopiar = null
        this.$refs['modalSeleccionarColumna'].hide()
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.cargarHabilitaciones()
      this.construirPlanillaNotas()
    }
  }
</script>

<style>
  .condensed thead th{
    padding-left:.1em;
    padding-right:.1em;
    font-size: 12px;
    text-align: center;
    /*writing-mode: vertical-lr;
    text-orientation: upright;*/
  }
  .condensed tbody{
    padding-left:.1em;
    padding-right:.1em;
    font-size: 12px;
    text-align: center;
    height: 10px;
  }
  .condensed input{
    padding-left:.1em;
    padding-right:.1em;
    padding-top:.1em;
    padding-bottom:.1em;
    height: 18px;
    font-size: 12px;
    text-align: center;
  }

</style>