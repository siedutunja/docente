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
              <span v-if="props.column.field == 'recuperacion'">
                <b-form-input v-model="props.row.recuperacion" @blur="actualizarItemNota(props.row)" @change="cambioPlanilla" autocomplete="off" maxlength="3" @keydown="handleKeyNavigation($event, props.row.originalIndex, 'recuperacion'),soloDecimales($event)" :ref="'recuperacion-' + props.row.originalIndex"></b-form-input>
              </span>
              <span v-if="props.column.field == 'fecha_recupera'">
                <b-form-input type="date" v-model="props.row.fecha_recupera" @blur="actualizarItemFecha(props.row)" @change="cambioPlanilla" autocomplete="off" maxlength="3" @keydown="handleKeyNavigation($event, props.row.originalIndex, 'fecha_recupera'),soloDecimales($event)" :ref="'fecharecupera-' + props.row.originalIndex" :disabled="props.row.definitiva>0 ? false : true"></b-form-input>
              </span>
            </template>
            <div slot="emptystate">
              <h5 class="text-danger ml-5">No existen notas parciales en la planilla</h5>
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
          <b-button class="small mx-1 mt-4" variant="success" @click="botonGuardando = true,guardarPlanilla()" :disabled="!cambioActivo">Guardar Planilla Recuperaciones</b-button>
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
    name: 'recuperacionperiodo',
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
        btnCargando: true
      }
    },
    methods: {
      actualizarItemFecha(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.fecha_recupera == '' || item.fecha_recupera == null || item.fecha_recupera == 0) {
          this.notasPlanilla[indice].fecha_recupera = null
          item.fecha_recupera = null
        } else  {
          this.notasPlanilla[indice].fecha_recupera = item.fecha_recupera.substr(0,10)
        }
      },
      async guardarPlanilla() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/planillarecuperacion', JSON.stringify(this.notasPlanilla), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Planilla')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla parcial de evaluaciones se ha guardado satisfactoriamente.')
            this.botonGuardando = false
            this.cambioActivo = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Planilla. Intente más tarde. ' + err)
        })
      },
      actualizarItemNota(item) {
        let notaMinima = 0
        let notaMaxima = 99
        if (this.configuracionPlanilla.id_tipo == 1) {
          notaMinima = this.configuracionPlanilla.minBaj
          notaMaxima = this.configuracionPlanilla.maxSup
        } else if (this.configuracionPlanilla.id_tipo == 2) {
          notaMinima = this.configuracionPlanilla.minBajT
          notaMaxima = this.configuracionPlanilla.maxSupT
        }
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.recuperacion == '' || item.recuperacion == null || item.recuperacion == 0) {
          this.notasPlanilla[indice].recuperacion = null
          item.recuperacion = null
        } else  {
          if (item.recuperacion >= notaMinima && item.recuperacion <= notaMaxima) {
            this.notasPlanilla[indice].recuperacion = item.recuperacion
          } else {
            this.notasPlanilla[indice].recuperacion = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.recuperacion  + ' no es válida.')
            item.recuperacion = null
          }
        }
      },
      cambioPlanilla() {
        this.cambioActivo = true
      },
      tdClassFuncConcepto(fila) {
        if (this.configuracionPlanilla.id_tipo == 1) {
          if (fila.definitiva >= this.configuracionPlanilla.minBaj && fila.definitiva <= this.configuracionPlanilla.maxBaj) {
            return 'text-danger text-center bg-secondary'
          } else if (fila.definitiva >= this.configuracionPlanilla.minBas && fila.definitiva <= this.configuracionPlanilla.maxBas) {
            return 'text-primary text-center bg-secondary'
          } else if (fila.definitiva >= this.configuracionPlanilla.minAlt && fila.definitiva <= this.configuracionPlanilla.maxAlt) {
            return 'text-warning text-center bg-secondary'
          } else if (fila.definitiva >= this.configuracionPlanilla.minSup && fila.definitiva <= this.configuracionPlanilla.maxSup) {
            return 'text-success text-center bg-secondary'
          }
          return 'text-secondary text-center bg-secondary'
        } else if (this.configuracionPlanilla.id_tipo == 2) {
          if (fila.definitiva >= this.configuracionPlanilla.minBajT && fila.definitiva <= this.configuracionPlanilla.maxBajT) {
            return 'text-danger text-center bg-secondary'
          } else if (fila.definitiva >= this.configuracionPlanilla.minBasT && fila.definitiva <= this.configuracionPlanilla.maxBasT) {
            return 'text-primary text-center bg-secondary'
          } else if (fila.definitiva >= this.configuracionPlanilla.minAltT && fila.definitiva <= this.configuracionPlanilla.maxAltT) {
            return 'text-warning text-center bg-secondary'
          } else if (fila.definitiva >= this.configuracionPlanilla.minSupT && fila.definitiva <= this.configuracionPlanilla.maxSupT) {
            return 'text-success text-center bg-secondary'
          }
          return 'text-secondary text-center bg-secondary'
        }
      },
      async cargarNotasPeriodo() {
        this.notasPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planilla', {params: {idCurso: this.configuracionPlanilla.idCurso, idPeriodo: this.configuracionPlanilla.idPeriodo, idPlanilla: this.configuracionPlanilla.idPlanilla, idTipoEsp: this.configuracionPlanilla.id_tipo, idEspecialidad: this.configuracionPlanilla.id_especialidad, vigencia: this.$store.state.aLectivo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas periodo')
          } else{
            if (response.data.datos != 0) {
              response.data.datos.forEach(element => {
                element.id_asignatura_curso = this.configuracionPlanilla.idPlanilla
                element.periodo = this.configuracionPlanilla.idPeriodo
                if (element.fecha_recupera == '' || element.fecha_recupera == null || element.fecha_recupera == 0) {
                  element.fecha_recupera = null
                } else {
                  element.fecha_recupera = element.fecha_recupera.substr(0,10)
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
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas periodo. Intente más tarde.' + err)
        })
      },
      async construirPlanillaNotas() {
        this.planillita = 1
        this.encabColumnas = [
          { label: 'Apellidos y Nombres Estudiante', width: '30%', field: 'estudiante', sortable: false },
          { label: '', field: 'diversa', sortable: false, tdClass: this.tdClassFuncDiversa },
          { label: 'Definitiva Periodo', field: 'definitiva', sortable: false, tdClass: 'text-center' },
          { label: 'Concepto Definitiva Periodo', field: 'concepto', sortable: false, tdClass: this.tdClassFuncConcepto },
          { label: 'Recuperación', field: 'recuperacion', sortable: false },
          { label: 'Fecha Recuperación', field: 'fecha_recupera', sortable: false },
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
      this.cargarNotasPeriodo()
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