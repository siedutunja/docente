<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> DESCRIPTORES COMPLEMENTARIOS</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="9">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="idPeriodo=null"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-form-group label="Seleccione el Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="cargueDescriptoresPlanilla()" :disabled="idPlanilla!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <b-row v-if="idPeriodo != null">
              <b-col>
                <vue-good-table ref="descriptores" :columns="encabColumnasDescriptores" :rows="descriptoresPlanilla" styleClass="vgt-table condensed bordered striped"
                  :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
                  <div slot="selected-row-actions">
                    <b-button class="mr-2" variant="primary" @click="actualizarDescriptores()">Actualizar Descriptores <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
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
              <b-col lg="12">
                    <b-button class="small mx-1 mt-4" variant="primary" @click="nuevoDescriptor()">Nuevo Descriptor Complementario</b-button>
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
    <b-modal ref="modalNuevoDescriptor" size="xl" scrollable hide-footer :title="'Crear Nuevo Descriptor para el Periodo: ' + this.idPeriodo" ok-only>
      <div class="mx-3">
        <b-card header-bg-variant="secondary">
          <b-row>
            <b-col lg="6">
              <b-form-group label="Concepto Valorativo:" label-for="concepto" class="etiqueta">
                <b-form-select id="concepto" ref="concepto" v-model="$v.nuevoConcepto.idConcepto.$model" :options="comboConceptos" :state="validateStateD('idConcepto')" aria-describedby="feedConcepto"></b-form-select>
                <b-form-invalid-feedback id="feedConcepto">Campo requerido.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col lg="12">
              <b-form-group label="Descriptor Complementario:" label-for="descriptor" class="etiqueta">
                <b-form-textarea id="descriptor" ref="descriptor" v-model="$v.nuevoConcepto.descriptor.$model" autocomplete="off" rows="5" :state="validateStateD('descriptor')" aria-describedby="feedDesc"></b-form-textarea>
                <b-form-invalid-feedback id="feedDesc">Campo requerido.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
        <b-button class="small mx-1 mt-2" variant="primary" @click="validarNuevoDescriptor">Guardar Descriptor</b-button>
        <b-button class="small mx-1 mt-2" variant="secondary" @click="cancelarNuevoDescriptor">Cancelar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table'
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";

  export default {
    name: 'complementarios',
    mixins: [validationMixin],
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
          { label: 'Descriptores Complementarios', field: 'descriptor', sortable: false },
        ],
        encabColumnasCopiar : [
          { label: 'Planillas', field: 'planillaCopiar', sortable: false },
        ],
        idPeriodo: null,
        comboPeriodos: [
          { 'value': 1, 'text': 1},
          { 'value': 2, 'text': 2},
          { 'value': 3, 'text': 3},
          { 'value': 4, 'text': 4},
          { 'value': 5, 'text': 5}
        ],
        idConcepto: null,
        comboConceptos: [],
        nuevoConcepto: {
          idPlanilla: null,
          descriptor: null,
          idConcepto: null,
          idPeriodo: null,
          idGrupo: null
        },
        descriptoresSeleccionadosGuardar: [],
        listaPlanillasCopiar: [],
        planillasSeleccionadasCopiar: [],
        descriptoresSeleccionadosCopiar: []
      }
    },
    validations: {
      nuevoConcepto: {
        idConcepto: { required },
        descriptor: { required, minLength: minLength(15) },
      }
    },
    methods: {
      async actualizarDescriptores() {
        this.descriptoresSeleccionadosGuardar = []
        this.$refs.descriptores.selectedRows.forEach(element => {
          this.descriptoresSeleccionadosGuardar.push({ 'id': element.id, 'descriptor': element.descriptor })
        })
        //alert(JSON.stringify(this.descriptoresSeleccionadosGuardar))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/descriptores/complementarios', JSON.stringify(this.descriptoresSeleccionadosGuardar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
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
      validarNuevoDescriptor() {
        this.$v.nuevoConcepto.$touch()
        if (this.$v.nuevoConcepto.$anyError) {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algunos campos están incompletos.')
          return false
        } else {
          let titulo = 'Guardar Descriptor'
          let pregunta = '¿Esta seguro de guardar el nuevo descriptor?'
          this.$bvModal.msgBoxConfirm(pregunta, {
            headerBgVariant: 'primary',
            headerTextVariant: 'light',
            bodyBgVariant: 'light',
            bodyBgClass: 'text-center',
            title: titulo,
            size: '',
            buttonSize: 'sm',
            okVariant: 'primary',
            okTitle: 'Si, ' + titulo,
            cancelVariant: 'danger',
            cancelTitle: 'Cancelar',
            footerClass: 'p-2',
            bodyClass: 'p-5',
            hideHeaderClose: false,
            centered: true
          })
          .then(value => {
            if (value) {
              this.guardarDescriptor()
            }
          })
        }
        return true
      },
      async guardarDescriptor() {
        await axios
        .post(CONFIG.ROOT_PATH + 'docente/descriptores/complementarios', JSON.stringify(this.nuevoConcepto), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Crear Descriptor Descriptores')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'El descriptor se han guardado correctamente.')
            this.cargueDescriptoresPlanilla()
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Crear Descriptor Descriptores. Intente más tarde. ' + err)
        })
        this.cancelarNuevoDescriptor()
      },
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
        .put(CONFIG.ROOT_PATH + 'docente/copiardescriptores/complementarios', JSON.stringify(this.planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
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
      nuevoDescriptor() {
        this.nuevoConcepto.idPlanilla = this.idPlanilla
        this.nuevoConcepto.idConcepto = 1
        this.nuevoConcepto.descriptor = ''
        this.nuevoConcepto.idPeriodo = this.idPeriodo
        this.nuevoConcepto.idGrupo = 2
        this.$refs['modalNuevoDescriptor'].show()
      },
      cancelarNuevoDescriptor() {
        this.$refs['modalNuevoDescriptor'].hide()
      },
      seleccionarPlanillasCopiar() {
        this.$refs['modalCopiarPlanillas'].show()
      },
      cancelarFormulario() {
        this.$refs['modalCopiarPlanillas'].hide()
      },
      async cargueDescriptoresPlanilla() {
        this.descriptoresPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/descriptores/complementarios', {params: {idPlanilla: this.idPlanilla, idPeriodo: this.idPeriodo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Descriptores complementarios')
          } else{
            if (response.data.datos != 0) {
              this.descriptoresPlanilla = response.data.datos
              //console.log(JSON.stringify(this.descriptoresPlanilla))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Descriptores complementarios. Intente más tarde.' + err)
        })
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
          this.listaPlanillasCopiar.push({'idPlanillaCopiar':  element.idPlanilla, 'planillaCopiar': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase()})
        })
      },
      async ocuparComboConceptos() {
        this.comboConceptos = []
        this.$store.state.datosTablas.conceptos.forEach(element => {
          this.comboConceptos.push({ 'value': element.id, 'text': element.concepto.toUpperCase() })
        })
      },
      tdClassFuncE(row) {
        return 'text-center' 
      },
      colorConcepto(c) {
        let colores = ['','#ee0609','#060dee','#da9711','#009900']
        return 'color: ' + colores[c]
      },
      validateStateD(name) {
        const { $dirty, $error } = this.$v.nuevoConcepto[name]
        return $dirty ? !$error : null
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPlanillas()
      this.ocuparComboConceptos()
    }
  }
</script>