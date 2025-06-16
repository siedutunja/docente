<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> DESCRIPTORES GENERALES</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="9">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="verificaDescriptoresPlanilla()"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <b-row v-if="idPlanilla != null">
              <b-col>
                <vue-good-table ref="descriptores" :columns="encabColumnasDescriptores" :rows="descriptoresPlanilla" styleClass="vgt-table condensed bordered striped"
                  :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
                  <div slot="selected-row-actions">
                    <b-button class="mr-2" variant="primary" @click="guardarDescriptores()">Guardar Descriptores <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
                    <b-button class="" variant="success" @click="seleccionarPlanillasCopiar()">Copiar Descriptores <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon></b-button>
                  </div>
                  <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'concepto'">
                      <span :style="(colorConcepto(props.row.id_concepto_valorativo))"><strong>{{props.row.concepto}}</strong></span>
                    </span>
                    <span v-if="props.column.field == 'id_periodo'">
                      <span :style="(colorConcepto(props.row.id_concepto_valorativo))"><strong>P{{props.row.id_periodo}}</strong></span>
                    </span>
                     <span v-if="props.column.field == 'descriptor'">
                      <b-form-textarea v-model="props.row.descriptor" autocomplete="off" :style="(colorConcepto(props.row.id_concepto_valorativo))" rows="3"></b-form-textarea>
                    </span>
                  </template>
                  <div slot="emptystate">
                    <h5 class="text-danger ml-5">No existen descriptores</h5>
                  </div>
                </vue-good-table>
                
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col lg="12">
                <b-alert v-if="contPeriodos==0" variant="danger" show><b>Periodos Cerrados:</b><hr>En el momento no tiene periodos activados para consultar o cargas descriptores.</b-alert>
              </b-col>
            </b-row>
          </b-card-text>
          <template #footer>
            <em>Seleccione la planilla, actualice los descriptores, seleccionelos y haga clic en el botón Guardar Descriptores.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
    <b-modal ref="modalCopiarPlanillas" size="xl" scrollable hide-footer title="Seleccione las Planillas a donde se van a Copiar los Descriptores" ok-only>
      <div class="mx-3">
        <b-card header-bg-variant="secondary">
          <vue-good-table ref="planillasCopy" :columns="encabColumnasCopiar" :rows="listaPlanillasCopiar" styleClass="vgt-table condensed bordered striped"
            :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
            <div slot="selected-row-actions">
              <b-button class="mr-2" variant="primary" @click="copiarDescriptores()">Guardar Descriptores <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
            </div>
            <div slot="emptystate">
              <h5 class="text-danger ml-5">No existen planillas para copiar</h5>
            </div>
          </vue-good-table>
        </b-card>
        <b-button class="small mx-1 mt-2" variant="secondary" @click="cancelarFormulario">Cancelar</b-button>
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
    name: 'generales',
    components: {
      VueGoodTable
    },
    data () {
      return {
        idPlanilla: null,
        comboPlanillas: [],
        descriptoresPlanilla: [],
        encabColumnasDescriptores : [
          { label: 'Concepto', field: 'concepto', width: '110px', sortable: false },
          { label: 'Per', field: 'id_periodo', width: '70px', tdClass: this.tdClassFuncE, sortable: false },
          { label: 'Descriptores Generales', field: 'descriptor', sortable: false },
        ],
        encabColumnasCopiar : [
          { label: 'Planillas', field: 'planillaCopiar', sortable: false },
        ],
        descriptoresSeleccionadosGuardar: [],
        listaPlanillasCopiar: [],
        planillasSeleccionadasCopiar: [],
        descriptoresSeleccionadosCopiar: [],
        contPeriodos: 0,
      }
    },
    methods: {
      async copiarDescriptores() {
        this.planillasSeleccionadasCopiar = []
        this.descriptoresSeleccionadosCopiar = []
        this.$refs.descriptores.selectedRows.forEach(element => {
          this.descriptoresSeleccionadosCopiar.push({ 'descriptor': element.descriptor,'idConcepto': element.id_concepto_valorativo, 'periodo': element.id_periodo, 'idGrupo': element.id_grupo_descriptor })
        })
        this.$refs.planillasCopy.selectedRows.forEach(element => {
          this.planillasSeleccionadasCopiar.push({ 'idPlanillaCopiar': element.idPlanillaCopiar, 'descriptores': this.descriptoresSeleccionadosCopiar })
        })
        //console.log(JSON.stringify(this.planillasSeleccionadasCopiar))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/copiardescriptores/generales', JSON.stringify(this.planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.$refs['modalCopiarPlanillas'].hide()
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Copia Descriptores')
          } else{
            this.$refs['modalCopiarPlanillas'].hide()
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los descriptores se han copiado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Copia Descriptores. Intente más tarde. ' + err)
        })
      },
      seleccionarPlanillasCopiar() {
        this.$refs['modalCopiarPlanillas'].show()
      },
      cancelarFormulario() {
        this.$refs['modalCopiarPlanillas'].hide()
      },
      async guardarDescriptores() {
        this.descriptoresSeleccionadosGuardar = []
        this.$refs.descriptores.selectedRows.forEach(element => {
          this.descriptoresSeleccionadosGuardar.push({ 'id': element.id, 'descriptor': element.descriptor })
        })
        //alert(JSON.stringify(this.descriptoresSeleccionadosGuardar))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/descriptores/generales', JSON.stringify(this.descriptoresSeleccionadosGuardar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Descriptores')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los descriptores se han actualizado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Descriptores. Intente más tarde. ' + err)
        })
      },
      async verificaDescriptoresPlanilla() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/verificardescriptores/generales', JSON.stringify({idPlanilla: this.idPlanilla}), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Verificando Descriptores')
          } else{
            this.cargueDescriptoresPlanilla()
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Verificando Descriptores. Intente más tarde. ' + err)
        })
      },
      async cargueDescriptoresPlanilla() {
        this.descriptoresPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/descriptores/generales', {params: {idPlanilla: this.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Descriptores generales')
          } else{
            if (response.data.datos != 0) {
              this.descriptoresPlanilla = response.data.datos
              //console.log(JSON.stringify(this.descriptoresPlanilla))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Descriptores generales. Intente más tarde.' + err)
        })
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        let fechaVigencia = 0
        let restaVigencia = 0
        this.$store.state.datosTablas.periodos.forEach(element => {
          if (element.id == 1) {
            fechaVigencia = new Date(this.$store.state.notasP1_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.contPeriodos++
            }
          }
          if (element.id == 2) {
            fechaVigencia = new Date(this.$store.state.notasP2_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.contPeriodos++
            }
          }
          if (element.id == 3) {
            fechaVigencia = new Date(this.$store.state.notasP3_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.contPeriodos++
            }
          }
          if (element.id == 4) {
            fechaVigencia = new Date(this.$store.state.notasP4_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.contPeriodos++
            }
          }
          if (element.id == 5) {
            fechaVigencia = new Date(this.$store.state.notasP5_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.contPeriodos++
            }
          }
        })
        if (this.contPeriodos > 0) {
          this.$store.state.listaPlanillasDocente.forEach(element => {
            this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
            this.listaPlanillasCopiar.push({'idPlanillaCopiar':  element.idPlanilla, 'planillaCopiar': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase()})
          })
        }
      },
      tdClassFuncE(row) {
        return 'text-center' 
      },
      colorConcepto(c) {
        let colores = ['','#ee0609','#060dee','#da9711','#009900']
        return 'color: ' + colores[c]
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPlanillas()
    }
  }
</script>