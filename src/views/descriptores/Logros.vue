<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> LOGROS</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="9">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="verificaLogrosPlanilla()"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <b-row v-if="idPlanilla != null">
              <b-col>
                <vue-good-table ref="logros" :columns="encabColumnasLogros" :rows="logrosPlanilla" styleClass="vgt-table condensed bordered striped"
                  :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
                  <div slot="selected-row-actions">
                    <b-button class="mr-2" variant="primary" @click="guardarLogros()">Guardar Logros <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
                    <b-button class="" variant="success" @click="seleccionarPlanillasCopiar()">Copiar Logros <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon></b-button>
                  </div>
                  <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'id_periodo'">
                      <span><strong>Periodo-{{props.row.id_periodo}}</strong></span>
                    </span>
                     <span v-if="props.column.field == 'logro'">
                      <b-form-textarea v-model="props.row.logro" autocomplete="off" rows="3"></b-form-textarea>
                    </span>
                  </template>
                  <div slot="emptystate">
                    <h5 class="text-danger ml-5">No existen logros</h5>
                  </div>
                </vue-good-table>
              </b-col>
            </b-row>
          </b-card-text>
          <template #footer>
            <em>Seleccione la planilla, actualice los logros, seleccionelos y haga clic en el botón Guardar Logros.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
    <b-modal ref="modalCopiarPlanillas" size="xl" scrollable hide-footer title="Seleccione las Planillas a donde se van a Copiar los Logros" ok-only>
      <div class="mx-3">
        <b-card header-bg-variant="secondary">
          <vue-good-table ref="planillasCopy" :columns="encabColumnasCopiar" :rows="listaPlanillasCopiar" styleClass="vgt-table condensed bordered striped"
            :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
            <div slot="selected-row-actions">
              <b-button class="mr-2" variant="primary" @click="copiarLogros()">Guardar Logros <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
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
    name: 'logros',
    components: {
      VueGoodTable
    },
    data () {
      return {
        idPlanilla: null,
        comboPlanillas: [],
        logrosPlanilla: [],
        encabColumnasLogros : [
          { label: 'Periodo', field: 'id_periodo', width: '110px', tdClass: this.tdClassFuncE, sortable: false },
          { label: 'Logro', field: 'logro', sortable: false },
        ],
        encabColumnasCopiar : [
          { label: 'Planillas', field: 'planillaCopiar', sortable: false },
        ],
        logrosSeleccionadosGuardar: [],
        planillasSeleccionadasCopiar: [],
        logrosSeleccionadosCopiar: [],

        listaPlanillasCopiar: [],
      }
    },
    methods: {
      async copiarLogros() {
        this.planillasSeleccionadasCopiar = []
        this.logrosSeleccionadosCopiar = []
        this.$refs.logros.selectedRows.forEach(element => {
          this.logrosSeleccionadosCopiar.push({ 'logro': element.logro, 'periodo': element.id_periodo })
        })
        this.$refs.planillasCopy.selectedRows.forEach(element => {
          this.planillasSeleccionadasCopiar.push({ 'idPlanillaCopiar': element.idPlanillaCopiar, 'logros': this.logrosSeleccionadosCopiar })
        })
        //console.log(JSON.stringify(this.planillasSeleccionadasCopiar))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/copiarlogros', JSON.stringify(this.planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.$refs['modalCopiarPlanillas'].hide()
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Copia Logros')
          } else{
            this.$refs['modalCopiarPlanillas'].hide()
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los Logros se han copiado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Copia Logros. Intente más tarde. ' + err)
        })
      },
      seleccionarPlanillasCopiar() {
        this.$refs['modalCopiarPlanillas'].show()
      },
      cancelarFormulario() {
        this.$refs['modalCopiarPlanillas'].hide()
      },
      async guardarLogros() {
        this.logrosSeleccionadosGuardar = []
        this.$refs.logros.selectedRows.forEach(element => {
          if (element.logro != null && element.logro != '') {
            element.logro = element.logro.toUpperCase()
          }
          this.logrosSeleccionadosGuardar.push({ 'id': element.id, 'logro': element.logro })
        })
        //alert(JSON.stringify(this.logrosSeleccionadosGuardar))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/logros', JSON.stringify(this.logrosSeleccionadosGuardar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Logros')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los Logros se han actualizado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Logros. Intente más tarde. ' + err)
        })
      },
      async verificaLogrosPlanilla() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/verificarlogros', JSON.stringify({idPlanilla: this.idPlanilla}), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Verificando Logros')
          } else{
            this.cargueLogrosPlanilla()
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Verificando Logros. Intente más tarde. ' + err)
        })
      },
      async cargueLogrosPlanilla() {
        this.logrosPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/logros', {params: {idPlanilla: this.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Logros')
          } else{
            if (response.data.datos != 0) {
              this.logrosPlanilla = response.data.datos
              //console.log(JSON.stringify(this.logrosPlanilla))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Logros. Intente más tarde.' + err)
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
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPlanillas()
    }
  }
</script>