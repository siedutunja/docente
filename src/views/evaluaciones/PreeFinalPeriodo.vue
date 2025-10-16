<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <vue-good-table ref="notas4" :columns="encabColumnas" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'estudiante'">
              <span><strong>{{props.row.estudiante}}</strong></span>
            </span>
            <span v-if="props.column.field == 'definitivapree'">
              <span><strong>{{props.row.definitivapree}}</strong></span>
            </span>
            <span v-if="props.column.field == 'diversa'">
              <span v-if="props.row.id_diversa =='S'"><b-button class="small" variant="info" @click="capturarDescriptorInclusion(props.row)">{{props.row.diversa}}</b-button></span>
            </span>
            <span v-if="props.column.field == 'concepto'">
              <span><strong>{{props.row.concepto}}</strong></span>
            </span>
            <span v-if="props.column.field == 'descriptor'">
              <div v-if="props.row.id_diversa =='S'">
                <span>{{props.row.inclusion}}</span>
              </div>
              <div v-else>
                <span>{{tomarDescriptor(props.row)}}</span>
              </div>
            </span>
            <span v-if="props.column.field == 'ausJ'">
              <span><strong>{{props.row.ausJ}}</strong></span>
            </span>
            <span v-if="props.column.field == 'ausS'">
              <span><strong>{{props.row.ausS}}</strong></span>
            </span>
          </template>
          <div slot="emptystate">
            <h5 class="text-danger ml-5">No existen estudiantes en la planilla</h5>
          </div>
        </vue-good-table>
        <b-row class="mt-3">
          <b-col v-if="!botonGuardando">
            <!--
            <b-button class="small ml-3" variant="secondary" @click="cancelarFormulario">Cerrar</b-button>
            <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanillaComportamiento()">Guardar Planilla Parcial</b-button>
            -->
          </b-col>
          <b-col v-else>
            <b-button class="mx-1 mt-4" variant="primary" disabled>
              <b-spinner small type="grow"></b-spinner>
              Guardando la planilla...
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal ref="modalDescriptorInclusion" size="" scrollable hide-footer title="Editar Descriptor" ok-only>
      <div class="mx-3">
        <b-row>
          <b-col lg="12" md="12">
            <b-form-group label="Descriptor" label-for="descriptor" class="etiqueta">
              <b-form-textarea id="descriptor" v-model="descriptorInclusion" autocomplete="off" rows="5"></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col lg="12" md="12"><hr></b-col>
          <b-col lg="12" md="12">
            <b-button class="small mt-1 mr-3" variant="primary" @click="guardarDescriptorInclusion()">Guardar Descriptor</b-button>
            <b-button class="small mt-1 mr-3" variant="secondary" @click="cancelarVentana">Cancelar</b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table'

  export default {
    name: 'comportamientofinalperiodo',
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
        encabColumnas: [
          { label: 'Apellidos y Nombres Estudiante', width: '30%', field: 'estudiante', sortable: false },
          { label: '', field: 'diversa', sortable: false, tdClass: 'text-center' },
          { label: 'Definitiva', field: 'definitivapree', sortable: false, tdClass: this.tdClassFuncDefinitiva, thClass: 'text-center' },
          { label: 'Concepto', field: 'concepto', sortable: false, tdClass: this.tdClassFuncConcepto },
          { label: 'Descriptor', field: 'descriptor', width: '40%', sortable: false },
          { label: 'AJ', field: 'ausJ', sortable: false },
          { label: 'AS', field: 'ausS', sortable: false },
        ],
        descriptorInclusion: null,
        filaEstudiante: null,
      }
    },
    methods: {
      async guardarDescriptorInclusion() {
        this.filaEstudiante.inclusion = this.descriptorInclusion
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/descriptorinclusion', JSON.stringify(this.filaEstudiante), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Descriptor inclusión')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'El descriptor se ha guardado satisfactoriamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Descriptor inclusión. Intente más tarde. ' + err)
        })
        this.$refs['modalDescriptorInclusion'].hide()
      },
      cancelarVentana() {
        this.descriptorInclusion = null
        this.$refs['modalDescriptorInclusion'].hide()
      },
      capturarDescriptorInclusion(fila) {
        this.filaEstudiante = fila
        this.descriptorInclusion = this.filaEstudiante.inclusion
        this.$refs['modalDescriptorInclusion'].show()
        //console.log(JSON.stringify(this.filaEstudiante))
      },
      tdClassFuncDefinitiva(fila) {
        if (fila.definitivapree == this.configuracionPlanilla.preeL1) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL2) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL3) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL4) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncConcepto(fila) {
        if (fila.definitivapree == this.configuracionPlanilla.preeL1) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL2) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL3) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL4) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tomarDescriptor(fila) {
        if (fila.definitivapree == this.configuracionPlanilla.preeL1) {
          return fila.descBajo
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL2) {
          return fila.descBasico
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL3) {
          return fila.descAlto
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL4) {
          return fila.descSuperior
        }
        return ''
      },
      tdClassFuncDiversa(fila) {
        if (fila.id_diversa == 'S') {
          return 'text-center alert alert-success'
        }
      },
      async cargarNotasPeriodo() {
        this.notasPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planillapree/descriptorgeneral', {params: {idCurso: this.configuracionPlanilla.idCurso, idPeriodo: this.configuracionPlanilla.idPeriodo, idPlanilla: this.configuracionPlanilla.idPlanilla, vigencia: this.$store.state.aLectivo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas periodo Preescolar')
          } else{
            if (response.data.datos != 0) {
              response.data.datos.forEach(element => {
                if(element.ausJ === undefined) element.ausJ = null
                if(element.ausS === undefined) element.ausS = null
                if(element.definitivapree === undefined) element.definitivapree = null
                if(element.concepto === undefined) element.concepto = null
                if(element.observaciones === undefined) element.observaciones = null
                element.id_asignatura_curso = this.configuracionPlanilla.idPlanilla
                element.periodo = this.configuracionPlanilla.idPeriodo
              })
              this.notasPlanilla = response.data.datos
              //console.log(JSON.stringify(this.notasPlanilla))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas periodo Preescolar. Intente más tarde.' + err)
        })
      },
      cancelarFormulario() {
        this.$emit("retorno", 1)
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.cargarNotasPeriodo()
    }
  }
</script>