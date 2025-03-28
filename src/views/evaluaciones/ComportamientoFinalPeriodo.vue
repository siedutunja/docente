<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <vue-good-table ref="notas4" :columns="encabColumnas" :rows="notasPlanillaCompor" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'estudiante'">
              <span><strong>{{props.row.estudiante}}</strong></span>
            </span>
            <div v-if="configuracionPlanilla.tipoValComp == 0">
              <span v-if="props.column.field == 'definitivacompor'">
                <span><strong>{{props.row.definitivacompor}}</strong></span>
              </span>
            </div>
            <div v-else>
              <span v-if="props.column.field == 'definitiva'">
                <span><strong>{{props.row.definitiva}}</strong></span>
              </span>
            </div>
            <span v-if="props.column.field == 'diversa'">
              <span><strong>{{props.row.diversa}}</strong></span>
            </span>
            <span v-if="props.column.field == 'concepto'">
              <span><strong>{{props.row.concepto}}</strong></span>
            </span>
            <span v-if="props.column.field == 'observaciones'">
              <span>{{props.row.observaciones}}</span>
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
        <b-row><b-col lg="12"><hr></b-col></b-row>
        <b-row class="mt-3">
          <b-col v-if="!botonGuardando">
            <b-button class="small ml-3" variant="secondary" @click="cancelarFormulario">Cerrar</b-button>
            <!--<b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanillaComportamiento()">Guardar Planilla Parcial</b-button>-->
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
        notasPlanillaCompor: [],
        botonGuardando: false,
        encabColumnas: [],
      }
    },
    methods: {
      construirPlanillaNotasComportamiento() {
        if (this.configuracionPlanilla.tipoValComp == 0) {
          this.encabColumnas = [
            { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
            { label: '', field: 'diversa', sortable: false, tdClass: this.tdClassFuncDiversa },
            { label: 'Definitiva', field: 'definitivacompor', width: '120px', sortable: false, tdClass: this.tdClassFuncDefinitivaLetra, thClass: 'text-center' },
            { label: 'Concepto', field: 'concepto', width: '110px', sortable: false, tdClass: this.tdClassFuncConceptoComporLetra },
            { label: 'Observaciones del Periodo', field: 'observaciones', sortable: false },
            { label: 'AJ', field: 'ausJ', width: '60px', sortable: false },
            { label: 'AS', field: 'ausS', width: '60px', sortable: false },
          ]
        } else {
          this.encabColumnas = [
            { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
            { label: '', field: 'diversa', sortable: false, tdClass: this.tdClassFuncDiversa },
            { label: 'Definitiva', field: 'definitiva', width: '120px', sortable: false, tdClass: this.tdClassFuncDefinitivaNota, thClass: 'text-center' },
            { label: 'Concepto', field: 'concepto', width: '110px', sortable: false, tdClass: this.tdClassFuncConceptoComporNota },
            { label: 'Observaciones del Periodo', field: 'observaciones', sortable: false },
            { label: 'AJ', field: 'ausJ', width: '60px', sortable: false },
            { label: 'AS', field: 'ausS', width: '60px', sortable: false },
          ]
        }
      },
      tdClassFuncDefinitivaLetra(fila) {
        if (fila.definitivacompor == this.configuracionPlanilla.compL1) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL2) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL3) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL4) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncDefinitivaNota(fila) {
        if (fila.definitiva >= this.configuracionPlanilla.minBaj && fila.definitiva <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitiva >= this.configuracionPlanilla.minBas && fila.definitiva <= this.configuracionPlanilla.maxBas) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitiva >= this.configuracionPlanilla.minAlt && fila.definitiva <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitiva >= this.configuracionPlanilla.minSup && fila.definitiva <= this.configuracionPlanilla.maxSup) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncConceptoComporLetra(fila) {
        if (fila.definitivacompor == this.configuracionPlanilla.compL1) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL2) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL3) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL4) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncConceptoComporNota(fila) {
        if (fila.definitiva >= this.configuracionPlanilla.minBaj && fila.definitiva <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitiva >= this.configuracionPlanilla.minBas && fila.definitiva <= this.configuracionPlanilla.maxBas) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitiva >= this.configuracionPlanilla.minAlt && fila.definitiva <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitiva >= this.configuracionPlanilla.minSup && fila.definitiva <= this.configuracionPlanilla.maxSup) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncDiversa(fila) {
        if (fila.id_diversa == 'S') {
          return 'text-center text-white alert alert-info'
        }
        //return 'text-secondary text-center bg-light'
      },
      async cargarNotasPeriodoComportamiento() {
        this.notasPlanillaCompor = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planillacompor', {params: {idCurso: this.configuracionPlanilla.idCurso, idPeriodo: this.configuracionPlanilla.idPeriodo, idPlanilla: this.configuracionPlanilla.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas periodo Comportamiento')
          } else{
            if (response.data.datos != 0) {
              response.data.datos.forEach(element => {
                if(element.ausJ === undefined) element.ausJ = null
                if(element.ausS === undefined) element.ausS = null
                if(element.definitivacompor === undefined) element.definitivacompor = null
                if(element.definitiva === undefined) element.definitiva = null
                if(element.concepto === undefined) element.concepto = null
                if(element.observaciones === undefined) element.observaciones = null
                element.id_asignatura_curso = this.configuracionPlanilla.idPlanilla
                element.periodo = this.configuracionPlanilla.idPeriodo
              })
              this.notasPlanillaCompor = response.data.datos
              //console.log(JSON.stringify(this.notasPlanillaCompor))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas periodo Comportamiento. Intente más tarde.' + err)
        })
      },
      cancelarFormulario() {
        this.$router.push('/')
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.cargarNotasPeriodoComportamiento()
      this.construirPlanillaNotasComportamiento()
      console.log(JSON.stringify(this.configuracionPlanilla))
    }
  }
</script>