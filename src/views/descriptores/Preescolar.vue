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
                    <span v-if="$store.state.idInstitucion == '17ee4f30-fc80-11ec-a1d1-1dc2835404e5'">
                      <span v-if="props.column.field == 'orden'">
                        <span v-if="props.row.orden==1" :style="(colorConcepto(props.row.orden))"><strong>EN DIFICULTAD</strong></span>
                        <span v-else-if="props.row.orden==2" :style="(colorConcepto(props.row.orden))"><strong>EN PROCESO</strong></span>
                        <span v-else-if="props.row.orden==3" :style="(colorConcepto(props.row.orden))"><strong>ALCANZADO</strong></span>
                        <span v-else-if="props.row.orden==4" :style="(colorConcepto(props.row.orden))"><strong>SUPERADO</strong></span>
                        <span v-else-if="props.row.orden==5"><strong>RECOMENDACIÓN</strong></span>
                        <span v-else-if="props.row.orden==6"><strong>RECOMENDACIÓN</strong></span>
                        <span v-else><strong>-</strong></span>
                      </span>
                      <span v-if="props.column.field == 'periodo'">
                        <span :style="(colorConcepto(props.row.orden))"><strong>PER_{{props.row.periodo}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'descriptor'">
                        <b-form-textarea v-model="props.row.descriptor" autocomplete="off" rows="3" :style="(colorConcepto(props.row.orden))"></b-form-textarea>
                      </span>
                    </span>
                    <span v-else>
                      <span v-if="props.column.field == 'orden'">
                        <span><strong>CONCEPTO_{{props.row.orden}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'periodo'">
                        <span><strong>PER_{{props.row.periodo}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'descriptor'">
                        <b-form-textarea v-model="props.row.descriptor" autocomplete="off" rows="3"></b-form-textarea>
                      </span>
                    </span>
                  </template>
                  <div slot="emptystate">
                    <h5 class="text-danger ml-5">No existen descriptores</h5>
                  </div>
                </vue-good-table>
                
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
          { label: 'Periodos', field: 'periodo', width: '5%', tdClass: this.tdClassFuncE, sortable: false },
          { label: 'Concepto', field: 'orden', width: '5%', tdClass: this.tdClassFuncE, sortable: false },
          { label: 'Descriptores Preescolar', field: 'descriptor', sortable: false },
        ],
        encabColumnasCopiar : [
          { label: 'Planillas', field: 'planillaCopiar', sortable: false },
        ],
        descriptoresSeleccionadosGuardar: [],
        listaPlanillasCopiar: [],
        planillasSeleccionadasCopiar: [],
        descriptoresSeleccionadosCopiar: []
      }
    },
    methods: {
      async copiarDescriptores() {
        this.planillasSeleccionadasCopiar = []
        this.descriptoresSeleccionadosCopiar = []
        this.$refs.descriptores.selectedRows.forEach(element => {
          this.descriptoresSeleccionadosCopiar.push({ 'descriptor': element.descriptor,'orden': element.orden, 'periodo': element.periodo })
        })
        this.$refs.planillasCopy.selectedRows.forEach(element => {
          this.planillasSeleccionadasCopiar.push({ 'idPlanillaCopiar': element.idPlanillaCopiar, 'descriptores': this.descriptoresSeleccionadosCopiar })
        })
        //console.log(JSON.stringify(this.planillasSeleccionadasCopiar))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/copiardescriptores/preescolar', JSON.stringify(this.planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
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
        .put(CONFIG.ROOT_PATH + 'docente/descriptores/preescolar', JSON.stringify(this.descriptoresSeleccionadosGuardar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Descriptores Preescolar')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los descriptores se han actualizado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Descriptores Preescolar. Intente más tarde. ' + err)
        })
      },
      async verificaDescriptoresPlanilla() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/verificardescriptores/preescolar', JSON.stringify({idPlanilla: this.idPlanilla}), { headers: {"Content-Type": "application/json; charset=utf-8" }})
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
        .get(CONFIG.ROOT_PATH + 'docente/descriptores/preescolar', {params: {idPlanilla: this.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Descriptores preescolar')
          } else{
            if (response.data.datos != 0) {
              this.descriptoresPlanilla = response.data.datos
              //console.log(JSON.stringify(this.descriptoresPlanilla))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Descriptores preescolar. Intente más tarde.' + err)
        })
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
          this.listaPlanillasCopiar.push({'idPlanillaCopiar':  element.idPlanilla, 'planillaCopiar': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase()})
        })
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